//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var rp = require('request-promise');

router.get('/', function(req, res){
  res.render('index')
});

// product
router.route('/getProduct').post(function(req,res){
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId);
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  var options = {
    uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/products.json?apiVersion=5.4&appKey=narwhal&clientName='+req.body.clientName+'&filter=id:'+req.body.productId,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  console.log('options: ',options);
  rp(options)
    .then(function (data) {
      console.log('data',JSON.stringify(data));
      res.json(data);
    })
    .catch(function (err) {
        // API call failed
        console.log('/getProductDetails hagrid call failed');
        console.log('error: ',err);
    });
});

// Oracle route (to get family and syndication info)
router.route('/oracle').post(function(req,res){
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId);
  var source = {};
  var options = {
    uri: 'http://oracle-int.bazaar.prod.us-east-1.nexus.bazaarvoice.com/api/3/product/'+req.body.clientName+'/'+req.body.productId+'/sources?apikey=narwhal-jzzvybcdxam4',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  console.log(' Oracle options: ',options);
  rp(options)
    .then(function (data) {
      console.log('Oracle call data',JSON.stringify(data));
      console.log('Oracle call data["products"].length: ',data["products"].length)
      // set local function vars that will be set to the global source object
      var family = [];
      var syndication = [];
      // set data
      var hero = data.products;
      var len = hero.length;
      console.log('hero: ',hero);
      console.log('len: ',len);
      // need error handling for product with no families and no syndication
      if(len==0){
        // no syndication and no family
        source = { syndication: [], family: [] };
      } else {
        // loop through results of calll and organize into family and syndication
        for (i = 0; i < len; i++) {
            if ((data.products[i]['sources'][0]) === ('FAMILY')) {
              var innerFamily = [];
              family.push(innerFamily)
              innerFamily.push((data.products[i]['client']), (data.products[i]['externalId']))
            }
            else if ((data.products[i]['sources'][0]) === ('ASSOCIATION') || (data.products[i]['sources'][0]) === ('UPC') || (data.products[i]['sources'][0]) === ('external_ID')) {
              var innerSyndication = [];
              syndication.push(innerSyndication)
              innerSyndication.push((data.products[i]['client']), (data.products[i]['externalId']))
            }
            source.syndication = syndication;
            source.family = family;
        }
      }

      // console.log('syndication: ', syndication);
      console.log('Oracle call complete');
      console.log('source: ', source);
      res.json(source);
    })
    .catch(function (err) {
        // API call failed...
        console.log('Oracle Call Failed!!!!: ',err);
    });
});

// info drake wants for source syndication
// company Logo, Name, Prod ID, Moderation stop codes, locales that syndicate, syndication delay
//Structure - [{},{}]
// final for syndication
// sb test
router.route('/syndicationDashboard').post(function(req,res){
  console.log('**************')
  console.log('Hitting /syndicationDashboard');
  var clientName = req.body.clientName;
  var source = req.body.sourceObject;
  console.log('clientName: ',clientName);
  console.log('source: ',source);
  if (source['syndication'].length){
    let HmacAuthRequestor = require('hmac-auth');
    let myRequestLib = require('request');
    let yourAPIKey = 'narwhal';
    let yourSecretKey = '7egc3s36ck9wjpg63y6r72csebq2k9chhxepa4z3ts9t';
    let hmacAuth = new HmacAuthRequestor(yourAPIKey, yourSecretKey, myRequestLib);
    let request = hmacAuth.getClient(myRequestLib);
    var edgeArray = [];
    console.log('/syndicationDashboard - clientName: ',clientName);
    console.log('/syndicationDashboard - source: ',source);
    request({
      method : 'GET',
      url : 'http://sb2-int.bazaar.prod.us-east-1.nexus.bazaarvoice.com/api/v3/edges/to/'+clientName,
      timeout : 3000,
      json: true
    }, function (edgeErr, edgeResponse, edgeBody) {
        if(edgeErr){
          // API call failed
          console.log('/syndicationDashboard sb2 hmac edges call failed');
          console.log('error: ',edgeErr);
          res.json(edgeErr);
        }
      if(edgeBody){
        console.log('edgeBody returned data as expected!');
        request({
          method : 'GET',
          url : 'http://sb2-int.bazaar.prod.us-east-1.nexus.bazaarvoice.com/api/v3/displays/'+clientName,
          timeout : 3000,
          json: true
        }, function (displayErr, displayResponse, displayBody) {
          if(displayErr){
            // API call failed
            console.log('/syndicationDashboard sb2 hmac display call failed');
            console.log('error: ',displayErr);
            res.json(displayErr);
          }
          if(displayBody){

            console.log('** SB Display this works just as expected!');
            // iterate through syndication sources
            for(let i=0,len=source["syndication"].length;i<len;i++){
              var syndClient = source["syndication"][i][0];
              console.log('syndClient: ',syndClient);
              var displayObject;
              var sourceDisplayname;
              if(displayBody["data"]){
                displayObject = displayBody["data"];
              }
              if(goal["sourceDisplayName"]){
                sourceDisplayName=goal["sourceDisplayName"];
              }
              var goal = displayObject[Object.keys(displayObject).find(key => key.toLowerCase() === syndClient.toLowerCase())];
              // console.log('Switchboard Display body["data"]['+syndClient+']: ',goal);
              // console.log('sourceDisplayName: ', goal["sourceDisplayName"]);
              // console.log('logoImageName: ',goal["logoImageName"]);
              // console.log('Switchboard data - using find - edgeBody["data"].find(x => x.sourceClientId === "'+syndClient+'"): ',edgeBody["data"].find(x => x.sourceClientId === syndClient));
              var edgeObject = edgeBody["data"].find(x => x.sourceClientId === syndClient);
              var drakeEdge = {"companyLogo":goal["logoImageName"],"sourceDisplayName":sourceDisplayname,"locales":edgeObject.edgeInfo.includeLocales,"modCodes":edgeObject.edgeInfo.excludedContentCodesForImport,"syndicationDelay":edgeObject.edgeInfo.syndicationDelayDays,"matchStragegy":edgeObject.edgeInfo.productMatchingStrategies, "sourceName":edgeObject.edgeInfo.sourceClientName,"productId":source["syndication"][i][1]};
              edgeArray.push(drakeEdge);
            }
            console.log('edgeArray: ',edgeArray);
            res.json(edgeArray);
          }

        });
      }

    });
  } else {
    console.log('There is no syndication sources so no need to make the call');
    res.json({})
  }
});

// blocked dashboard
router.route('/blockedDashboard').post(function(req,res) {
  // get user inputs
  console.log('*****');
  console.log('Hiting blockedDashboard . . .');
  var syndicationObject = req.body.syndicationObject;
  var source = req.body.sourceObject;
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  console.log('source: ', source);
  console.log('syndicationObject: ',syndicationObject);
  console.log('clientName: ',clientName,'productId: ',productId);
  var blockedDashboardObject = {};
  var totalSyndicatedNative = 0;
  var len = source["syndication"].length;
  var callsLeft = len;
  // need to iterate through the syndication sources - get review totals to add to get total synd
  // need to make total review call (isSyndicated = true, limit 1) - to get display syndicated
  // blocked = total - display
  // Goal is to get number, not actual reviews - that is for blockedReviews route
  // Will use countdown strategy employed for familes - easier b/c it is limit 1
  // may roll this into dashboard
  let displaySyndOpt = {
    uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&filter=IsSyndicated:true&keyproperty=syndication&limit=1',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log('hagopt: ',hagopt);
  rp(displaySyndOpt)
    .then(function (displayResults) {
      console.log('****')
      console.log('displayResults["TotalResults"]: ', displayResults["TotalResults"]);
      console.log('****')
      blockedDashboardObject['totalSyndicatedDisplay'] = displayResults["TotalResults"];
      console.log('blockedDashboardObject: ',blockedDashboardObject);
      for(let i=0;i<len;i++){
          var syndClient = source["syndication"][i][0];
          var syndProduct = source["syndication"][i][1];
          console.log('syndClient: ',syndClient);
          console.log('productId: ', syndProduct);
              let hagopt = {
                uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+syndClient+'&ApiVersion=5.4&filter=productid:'+syndProduct+'&limit=1&excludeFamily=true',
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
              };
              rp(hagopt)
                .then(function (hagsynd) {
                  console.log('hagsynd["TotalResults"]: ', hagsynd["TotalResults"]);
                  totalSyndicatedNative += hagsynd["TotalResults"];
                  blockedDashboardObject['totalSyndicatedNative'] = totalSyndicatedNative;
                  callsLeft--
                  console.log('blockedDashboardObject: ',blockedDashboardObject,' callsLeft: ',callsLeft);
                  if (callsLeft<=0){
                    console.log('blockedDashboardObject res json call hit');
                    blockedDashboardObject['blockedSyndicated'] = blockedDashboardObject['totalSyndicatedNative'] - blockedDashboardObject['totalSyndicatedDisplay'];
                    console.log('callsLeft: ',callsLeft);
                    console.log('blockedDashboardObject: ',blockedDashboardObject);
                    res.json(blockedDashboardObject);
                  }
                })
                .catch(function (err) {
                    // API call failed
                    console.log('/blockedDashboard hagrid call failed');
                    console.log('error: ',err);
              });
      }

    })
    .catch(function (err) {
      // API call failed...
  });
});

// family dashboard
router.route('/familyDashboard').post(function(req,res) {
  // get user inputs
  console.log('Hiting familyDashboard . . .');
  var source = req.body.sourceObject;
  console.log('source: ', source);
  var familyDisplayObject = {};
  var totalFamilyResults = 0;
  var len = source["family"].length;
  var callsLeft = len;
  // iterate through family object in source
  console.log('source["family"]: ',source["family"]);
  for (let i = 0;i<len;i++){
    // make hagrid calls to get review totals
    let hagopt = {
      uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+source.family[i][0]+'&ApiVersion=5.4&filter=productid:'+source.family[i][1]+'&limit=1&excludeFamily=true',
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };
    rp(hagopt)
      .then(function (hagfam) {
        console.log('hagfam["TotalResults"]: ', hagfam["TotalResults"]);
        familyDisplayObject[source["family"][i][1]]=hagfam["TotalResults"];
        totalFamilyResults += hagfam["TotalResults"];
        familyDisplayObject["total"]=totalFamilyResults;
        callsLeft--
        console.log('familyDisplayObject: ',familyDisplayObject,' callsLeft: ',callsLeft);
        if (callsLeft<=0){
          console.log('familyDashboard res json call hit');
          console.log('callsLeft: ',callsLeft);
          console.log('familyDisplayObject: ',familyDisplayObject);
          res.json(familyDisplayObject);
        }
      })
      .catch(function (err) {
          // API call failed
          console.log('/familyDashboard hagrid call failed');
          console.log('error: ',err);
    });
  }
});

// All reviews pagination route
router.route('/paginateAll').post(function(req,res){
  console.log('*****');
  console.log('paginationAll route: ')
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId, ' pageNumber: ', req.body.pageNumber);
  console.log('*****');
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  var pageNumber = req.body.pageNumber;
  let pagopt = {
    uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&keyproperty=syndication&limit=100&offset='+(pageNumber*100),
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log('hagopt: ',hagopt);
  rp(pagopt)
    .then(function (pageResults) {
      console.log('****')
      console.log('pageResults["TotalResults"]: ', pageResults["TotalResults"]);
      console.log('****')
      res.json(pageResults);
    })
    .catch(function (err) {
      // API call failed...
  });
});

// Syndication reviews pagination route
router.route('/paginateDisplayableSyndicated').post(function(req,res){
  console.log('*****');
  console.log('paginateDisplayableSyndicated route: ')
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId, ' pageNumber: ', req.body.pageNumber);
  console.log('*****');
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  var pageNumber = req.body.pageNumber;
  let pagopt = {
    uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&filter=IsSyndicated:true&keyproperty=syndication&limit=100&offset='+(pageNumber*100),
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log('hagopt: ',hagopt);
  rp(pagopt)
    .then(function (pageResults) {
      console.log('****')
      console.log('pageResults["TotalResults"]: ', pageResults["TotalResults"]);
      console.log('****')
      res.json(pageResults);
    })
    .catch(function (err) {
      // API call failed...
  });
});

// Native reviews pagination route
router.route('/paginateNative').post(function(req,res){
  console.log('*****');
  console.log('paginationNative route: ')
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId, ' pageNumber: ', req.body.pageNumber);
  console.log('*****');
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  var pageNumber = req.body.pageNumber;
  let pagopt = {
    uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&excludeFamily=true&limit=100&offset='+(pageNumber*100),
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log('hagopt: ',hagopt);
  rp(pagopt)
    .then(function (pageResults) {
      console.log('****')
      console.log('pageResults["TotalResults"]: ', pageResults["TotalResults"]);
      console.log('****')
      res.json(pageResults);
    })
    .catch(function (err) {
      // API call failed...
  });
});

// Family reviews pagination route
router.route('/paginateFamily').post(function(req,res){
  console.log('*****');
  console.log('paginationFamily route: ')
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.familyProductId, ' pageNumber: ', req.body.pageNumber);
  console.log('*****');
  var clientName = req.body.clientName;
  var familyProductId = req.body.familyProductId;
  var pageNumber = req.body.pageNumber;
  let pagopt = {
    uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+familyProductId+'&excludeFamily=true&limit=100&offset='+(pageNumber*100),
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log('hagopt: ',hagopt);
  rp(pagopt)
    .then(function (pageResults) {
      console.log('****')
      console.log('pageResults["TotalResults"]: ', pageResults["TotalResults"]);
      console.log('****')
      res.json(pageResults);
    })
    .catch(function (err) {
      // API call failed...
  });
});

// Blocked Syndicated reviews route - all the syndicated reviews on the respective sites
router.route('/blockedReviews').post(function(req,res){
  console.log('*****');
  console.log('blockedReviews route: ')
  console.log('*****');
  var source = req.body.sourceObject;
  var syndicationObject = req.body.syndicationObject;
  console.log('source: ',source);
  console.log('syndicationObject: ',syndicationObject);
  var len = syndicationObject.length;
  var callsLeft = len;
  var blockedReviews = {};
  for (let i=0;i<len;i++){
    console.log('syndClient: ',syndicationObject[i]["sourceName"]);
    console.log('syndProduct: ',syndicationObject[i]["productId"]);
    console.log('modCodes: ',syndicationObject[i]["modCodes"]);
    console.log('syndicationDelay: ',syndicationObject[i]["syndicationDelay"]);
    console.log('locales: ',syndicationObject[i]["locales"]);
    // modcode blocked
    var hagmodopt = {
      uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=narwhal&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=ModeratorCode:'+syndicationObject[i]["modCodes"].join()+'&attributes=moderatorCodes&limit=100',
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };
    console.log('hagmodopt: ',hagmodopt);
    rp(hagmodopt)
      .then(function (hagmod) {
        console.log('blocked Moderator Reviews');
        console.log('hagmod: ',hagmod);
        if(hagmod["TotalResults"]>100){
          console.log('there are more than 100 modblocked reviews returned - need to loop through');
          var modloop = hagmod["TotalResults"]/100;
          var hagmodResultsObject = hagmod["Results"];
          console.log('loop number: ',modloop);
          var modCallsLeft = modloop;
          for(let j=1;j<modloop;j++){
            var hagmodloopopt = {
              uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=narwhal&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=ModeratorCode:'+syndicationObject[i]["modCodes"].join()+'&attributes=moderatorCodes&limit=100&offset='+(j*100),
              headers: {
                  'User-Agent': 'Request-Promise'
              },
              json: true // Automatically parses the JSON string in the response
            };
            console.log('hagmodloopopt: ',hagmodloopopt);
            rp(hagmodloopopt)
              .then(function(hagmodloop){
                hagmodResultsObject.push.apply(hagmodResultsObject, hagmodloop["Results"]);
                modCallsLeft--
                console.log('hagmodResultsObject: ',hagmodResultsObject,' modCallsLeft: ',modCallsLeft);
                if (modCallsLeft<=0){
                  console.log('end of hagmodloop hit');
                  console.log('modCallsLeft: ',modCallsLeft);
                  console.log('hagmodResultsObject: ',hagmodResultsObject);
                  blockedReviews["modBlocked"]=hagmodResultsObject;
                }
              })
              .catch(function (err) {
                // API call failed...
              });
          }

        } else {
          console.log('there are less than or equal to 100 modblocked reviews returned - no need for a loop');
          blockedReviews["modBlocked"]=hagmod["Results"];
        }
// start synd delay code block

        // get synddelay blocked
        console.log('Hitting syndication delay call ...');
        var days=syndicationObject[i]["syndicationDelay"]; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        console.log('days: ',days);
        console.log('date: ',date);
        console.log('last: ',last);
        var hagdelayopt = {
          uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=narwhal&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=submissiontime:gt:'+parseInt(last.getTime()/1000)+'&attributes=moderatorCodes&limit=100',
          headers: {
              'User-Agent': 'Request-Promise'
          },
          json: true // Automatically parses the JSON string in the response
        };
        console.log('hagdelayopt: ',hagdelayopt);
        rp(hagdelayopt)
          .then(function (hagdelay) {
            console.log('sydication delay Reviews');
            console.log('hagdelay: ',hagdelay);
            if(hagdelay["TotalResults"]>100){
              console.log('there are more than 100 delayed reviews returned - need to loop through');
              var delayloop = hagdelay["TotalResults"]/100;
              var hagdelayResultsObject = hagdelay["Results"];
              console.log('loop number: ',delayloop);
              var delayCallsLeft = delayloop;
              for(let k=1;k<delayloop;k++){
                var hagdelayloopopt = {
                  uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=narwhal&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=submissiontime:gt:'+parseInt(last.getTime()/1000)+'&attributes=moderatorCodes&limit=100&offset='+(k*100),
                  headers: {
                      'User-Agent': 'Request-Promise'
                  },
                  json: true // Automatically parses the JSON string in the response
                };
                console.log('hagdelayloopopt: ',hagdelayloopopt);
                rp(hagdelayloopopt)
                  .then(function(hagdelayloop){
                    hagdelayResultsObject.push.apply(hagdelayResultsObject, hagdelayloop["Results"]);
                    delayCallsLeft--
                    console.log('hagdelayResultsObject: ',hagdelayResultsObject,' delayCallsLeft: ',delayCallsLeft);
                    if (delayCallsLeft<=0){
                      console.log('end of hagdelayloop hit');
                      console.log('delayCallsLeft: ',delayCallsLeft);
                      console.log('hagdelayResultsObject: ',hagdelayResultsObject);
                      blockedReviews["syndDelayBlocked"]=hagdelayResultsObject;
                    }
                  })
                  .catch(function (err) {
                    // API call failed...
                  });
              }

            } else {
              console.log('there are less than or equal to 100 delayed reviews returned - no need for a loop');
              blockedReviews["syndDelayBlocked"]=hagdelay["Results"];
            }


// start locale block code

        // get locale blocked
        console.log('Hitting locale blocked call ...');
        console.log('Locale: ',syndicationObject[i]["locales"]);
        var haglocaleopt = {
          uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=narwhal&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=ContentLocale:neq:'+syndicationObject[i]["locales"].join()+'&attributes=moderatorCodes&limit=100',
          headers: {
              'User-Agent': 'Request-Promise'
          },
          json: true // Automatically parses the JSON string in the response
        };
        console.log('haglocaleopt: ',haglocaleopt);
        rp(haglocaleopt)
          .then(function (haglocale) {
            console.log('blocked locale Reviews');
            console.log('haglocale: ',haglocale);
            if(haglocale["TotalResults"]>100){
              console.log('there are more than 100 locale reviews returned - need to loop through');
              var localeloop = haglocale["TotalResults"]/100;
              var haglocaleResultsObject = haglocale["Results"];
              console.log('loop number: ',localeloop);
              var localeCallsLeft = localeloop;
              for(let l=1;l<localeloop;l++){
                var haglocaleloopopt = {
                  uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=narwhal&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=ContentLocale:neq:'+syndicationObject[i]["locales"].join()+'&attributes=moderatorCodes&limit=100&offset='+(k*100),
                  headers: {
                      'User-Agent': 'Request-Promise'
                  },
                  json: true // Automatically parses the JSON string in the response
                };
                console.log('haglocaleloopopt: ',haglocaleloopopt);
                rp(haglocaleloopopt)
                  .then(function(haglocaleloop){
                    haglocaleResultsObject.push.apply(haglocaleResultsObject, haglocaleloop["Results"]);
                    localeCallsLeft--
                    console.log('hagdelayResultsObject: ',haglocaleResultsObject,' localeCallsLeft: ',localeCallsLeft);
                    if (localeCallsLeft<=0){
                      console.log('end of haglocaleloop hit');
                      console.log('localeCallsLeft: ',localeCallsLeft);
                      console.log('haglocaleResultsObject: ',haglocaleResultsObject);
                      blockedReviews["localeBlocked"]=haglocaleResultsObject;
                    }
                  })
                  .catch(function (err) {
                    // API call failed...
                  });
              }

            } else {
              console.log('there are less than or equal to 100 locale blocked reviews returned - no need for a loop');
              blockedReviews["localeBlocked"]=haglocale["Results"];
            }

            callsLeft--
            console.log('blockedReviews: ',blockedReviews,' callsLeft: ',callsLeft);
            if (callsLeft<=0){
              console.log('blockedReviews res json call hit');
              console.log('callsLeft: ',callsLeft);
              console.log('blockedReviews: ',blockedReviews);
              res.json(blockedReviews);
            }
            })
          .catch(function (err) {
                // API call failed...
          });


// end locale block code
            })
          .catch(function (err) {
                // API call failed...
          });


// end synd delay code block
    })
    .catch(function (err) {
          // API call failed...
    });
  }
});
// dashboard
router.route('/dashboard').post(function(req,res) {
  // get user inputs
  console.log('Hiting dashboard . . .');
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  console.log('clientName: ', clientName,'productId: ', productId);
  // batch call #1 - q0 syndicated total, q1 - review display total
  var batchOneOptions = {
    uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/batch.json?appkey=narwhal&clientname='+clientName+'&keyproperty=syndication&ApiVersion=5.4&resource.q0=reviews&filter.q0=productid:'+productId+'&filter.q0=issyndicated:true&limit.q0=1&resource.q1=statistics&filter.q1=productid:'+productId+'&stats.q1=reviews',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  console.log('batchOneOptions options: ',batchOneOptions);
  rp(batchOneOptions)
    .then(function (synRev) {
      console.log('hitting batchoneoptions . . .');
      console.log('synRev["BatchedResults"]["q0"]["TotalResults"]: ',synRev["BatchedResults"]["q0"]["TotalResults"]);
      // console.log('synRev["BatchedResults"]["q1"]["Results"][0]["ProductStatistics"]["ReviewStatistics"]["TotalReviewCount"]: ',synRev["BatchedResults"]["q1"]["Results"][0]["ProductStatistics"]["ReviewStatistics"]["TotalReviewCount"]);
      var syndDisplayTotal = synRev["BatchedResults"]["q0"]["TotalResults"];
      var allReviewDisplayTotal = synRev["BatchedResults"]["q1"]["Results"][0]["ProductStatistics"]["ReviewStatistics"]["TotalReviewCount"];
      // console.log('synRev: ',JSON.stringify(prodData));
      console.log('syndDisplayTotal(displayed syndicated reviews): ',syndDisplayTotal);
      console.log('allReviewDisplayTotal(total displayed reviews): ',allReviewDisplayTotal);
      // nested batch2Option
      // batch call #2 - q0 num native reviews (reviews with content + ratingsOnly)
      // q1 num ratingsOnly native reviews
      var batch2Options = {
        uri: 'http://hagrid-bazaar-internal.prod.us-east-1.nexus.bazaarvoice.com/data/batch.json?appkey=narwhal&clientname='+clientName+'&excludeFamily=true&ApiVersion=5.4&resource.q0=reviews&filter.q0=productid:'+productId+'&limit.q0=1&resource.q1=reviews&filter.q1=productid:'+productId+'&limit.q1=1&filter.q1=isRatingsOnly:true',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
      };
      console.log('batch2Options options: ',batch2Options);
      rp(batch2Options)
        .then(function (conRat) {
          console.log('conRat: ',JSON.stringify(conRat));
          var nativeDisplayTotal = conRat["BatchedResults"]["q0"]["TotalResults"];
          console.log("total native displayed reviews(content + ratings only): ", nativeDisplayTotal);
          console.log('conRat["BatchedResults"]["q1"]["TotalResults"]: ',conRat["BatchedResults"]["q1"]["TotalResults"]);
          var nativeRatingsOnlyTotal = conRat["BatchedResults"]["q1"]["TotalResults"];
          var nativeContentTotal = nativeDisplayTotal - nativeRatingsOnlyTotal;
          var famDisplayTotal = allReviewDisplayTotal - nativeDisplayTotal - syndDisplayTotal;
          console.log('nativeContentTotal: ',nativeContentTotal);
          console.log('nativeDisplayTotal: ',nativeDisplayTotal);
          console.log('nativeRatingsOnlyTotal: ',nativeRatingsOnlyTotal);
          console.log('famDisplayTotal: ',famDisplayTotal);
          console.log('Am I going crazy?');
          var responseObject = {};
          responseObject["dashboard"] = {nativeReviews:nativeContentTotal, displayableSyndicatedReviews:syndDisplayTotal, familyReviews:famDisplayTotal, totalReviews:allReviewDisplayTotal, ratingsOnlyReviews:nativeRatingsOnlyTotal, displayableNativeReviews:nativeDisplayTotal};
          console.log('ResponseObject object: ',responseObject);
          res.json(responseObject);

        })
        .catch(function (err) {
          // API call failed...
        });
    })
    .catch(function (err) {
        // API call failed...
    });
});
module.exports = router;
