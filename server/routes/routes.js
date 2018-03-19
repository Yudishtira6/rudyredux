//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var rp = require('request-promise');
var nativeContentTotal = 0;
var nativeRatingsOnlyTotal = 0;
var nativeDisplayTotal = 0;
var syndDisplayTotal = 0;
var famDisplayTotal = 0;
var allReviewDisplayTotal = 0;
var switchboardArray = [];
var fs = require('fs')
var path = require('path')

router.get('/', function(req, res){
  res.render('index')
});

// product
router.route('/getProduct').post(function(req,res){
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId);
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  var options = {
    uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/products.json?apiVersion=5.4&appKey=test&clientName='+req.body.clientName+'&filter=id:'+req.body.productId,
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
    uri: 'https://oracle-bazaar.prod.us-east-1.nexus.bazaarvoice.com/api/3/product/'+req.body.clientName+'/'+req.body.productId+'/sources?apikey=hackathon-qdu8sarvq',
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
            else if ((data.products[i]['sources'][0]) === ('ASSOCIATION') || (data.products[i]['sources'][0]) === ('UPC') || (data.products[i]['sources'][0]) === ('EXTERNAL_ID')) {
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
    var edgeBody = {};
    console.log('/syndicationDashboard - clientName: ',clientName);
    console.log('/syndicationDashboard - source: ',source);
    request({
      method : 'GET',
      url : 'https://sb2-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/api/v3/edges/to/'+clientName,
      timeout : 3000,
      json: true
    }, function (err, response, body) {
      if(err){
        // API call failed
        console.log('/syndicationDashboard sb2 hmac edges call failed');
        console.log('error: ',err);
        res.json(err);
      }
      console.log('this works just as expected!');
      edgeBody = body;
      request({
        method : 'GET',
        url : 'https://sb2-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/api/v3/displays/'+clientName,
        timeout : 3000,
        json: true
      }, function (err, response, body) {
        if(err){
          // API call failed
          console.log('/syndicationDashboard sb2 hmac display call failed');
          console.log('error: ',err);
          res.json(err);
        }
        console.log('** SB Display this works just as expected!');

        // iterate through syndication sources
        for(let i=0,len=source["syndication"].length;i<len;i++){
          var syndClient = source["syndication"][i][0];
          console.log('syndClient: ',syndClient);
          var displayObject = body["data"];
          var goal = displayObject[Object.keys(displayObject).find(key => key.toLowerCase() === syndClient.toLowerCase())];
          console.log('Switchboard Display body["data"]['+syndClient+']: ',goal);
          console.log('sourceDisplayName: ', goal["sourceDisplayName"]);
          console.log('logoImageName: ',goal["logoImageName"]);
          console.log('Switchboard data - using find - edgeBody["data"].find(x => x.sourceClientId === "'+syndClient+'"): ',edgeBody["data"].find(x => x.sourceClientId === syndClient));
          var edgeObject = edgeBody["data"].find(x => x.sourceClientId === syndClient);
          var drakeEdge = {"companyLogo":goal["logoImageName"],"sourceDisplayName":goal["sourceDisplayName"],"locales":edgeObject.edgeInfo.includeLocales,"modCodes":edgeObject.edgeInfo.excludedContentCodesForImport,"syndicationDelay":edgeObject.edgeInfo.syndicationDelayDays,"matchStragegy":edgeObject.edgeInfo.productMatchingStrategies, "sourceName":edgeObject.edgeInfo.sourceClientName,"productId":source["syndication"][i][1]};
          edgeArray.push(drakeEdge);
        }
        console.log('edgeArray: ',edgeArray);
        res.json(edgeArray);
    });
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
    uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&filter=IsSyndicated:true&keyproperty=syndication&limit=1',
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
                uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+syndClient+'&ApiVersion=5.4&filter=productid:'+syndProduct+'&limit=1&excludeFamily=true',
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

  /*
  var familyDisplayObject = {};
  var totalFamilyResults = 0;
  var len = source["family"].length;
  var callsLeft = len;
  // iterate through family object in source
  console.log('source["family"]: ',source["family"]);
  for (let i = 0;i<len;i++){
    // make hagrid calls to get review totals
    let hagopt = {
      uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+source.family[i][0]+'&ApiVersion=5.4&filter=productid:'+source.family[i][1]+'&limit=1&excludeFamily=true',
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
  */
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
      uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+source.family[i][0]+'&ApiVersion=5.4&filter=productid:'+source.family[i][1]+'&limit=1&excludeFamily=true',
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
    uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&keyproperty=syndication&limit=100&offset='+(pageNumber*100),
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
    uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&filter=IsSyndicated:true&keyproperty=syndication&limit=100&offset='+(pageNumber*100),
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
    uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&excludeFamily=true&limit=100&offset='+(pageNumber*100),
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
    uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+familyProductId+'&excludeFamily=true&limit=100&offset='+(pageNumber*100),
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
      uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=test&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=ModeratorCode:'+syndicationObject[i]["modCodes"].join()+'&attributes=moderatorCodes&limit=100',
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
              uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=test&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=ModeratorCode:'+syndicationObject[i]["modCodes"].join()+'&attributes=moderatorCodes&limit=100&offset='+(j*100),
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
          uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=test&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=submissiontime:gt:'+parseInt(last.getTime()/1000)+'&attributes=moderatorCodes&limit=100',
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
                  uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=test&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=submissiontime:gt:'+parseInt(last.getTime()/1000)+'&attributes=moderatorCodes&limit=100&offset='+(k*100),
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
          uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=test&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=ContentLocale:neq:'+syndicationObject[i]["locales"].join()+'&attributes=moderatorCodes&limit=100',
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
                  uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=test&clientName='+syndicationObject[i]["sourceName"]+'&keyProperty=syndication&filter=productid:'+syndicationObject[i]["productId"]+'&include=products&stats=reviews&filter=ContentLocale:neq:'+syndicationObject[i]["locales"].join()+'&attributes=moderatorCodes&limit=100&offset='+(k*100),
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
  /*
  let pagopt = {
    uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=narwhal&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+familyProductId+'&excludeFamily=truelimit=100&offset='+(pageNumber*100),
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
  */
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
    uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/batch.json?appkey=narwhaul&clientname='+clientName+'&keyproperty=syndication&ApiVersion=5.4&resource.q0=reviews&filter.q0=productid:'+productId+'&filter.q0=issyndicated:true&limit.q0=1&resource.q1=statistics&filter.q1=productid:'+productId+'&stats.q1=reviews',
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
        uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/batch.json?appkey=narwhaul&clientname='+clientName+'&excludeFamily=true&ApiVersion=5.4&resource.q0=reviews&filter.q0=productid:'+productId+'&limit.q0=1&resource.q1=reviews&filter.q1=productid:'+productId+'&limit.q1=1&filter.q1=isRatingsOnly:true',
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
          /*
          if (conRat["BatchedResults"]["q1"]["TotalResults"]>){
              console.log("hitting if ratings only reviews present");
              console.log('conRat["BatchedResults"]["q1"]["Results"].length: ',conRat["BatchedResults"]["q1"]["Results"].length);
              console.log('conRat["BatchedResults"]["q1"]["Results"]: ',conRat["BatchedResults"]["q1"]["Results"]);
              var nativeRatingsOnlyTotal = conRat["BatchedResults"]["q1"]["Results"][0]["ReviewStatistics"]["TotalReviewCount"];
              console.log("ratings only displayed reviews: ", nativeRatingsOnlyTotal);
          } else {
            var nativeRatingsOnlyTotal = 0;
            console.log("ratings only displayed reviews: ", nativeRatingsOnlyTotal);
          */
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

// On user input - detailed call to get syndication data
router.route('/insertTest')
.post(function(req,res) {
  // get user inputs
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId);
  // set global vars that will persist through all the nested calls
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  var syndTotal = 0;
  var totalId = [];
  var syndId = [];
  var sources = {};
  var dashboard = {};
  var totalReviews = {};
  var hagridTotalObj = {};
  var familyObj = {};
  var syndObj = {};
  var rejected = {};
  rejected["Results"] = [];
  // console.log('rejected: ',rejected);
  var hagridTotalResults = [];
  var source = new Object ();
  // Step 1 (Oracle call to get sources)
  var options = {
    uri: 'https://oracle-bazaar.prod.us-east-1.nexus.bazaarvoice.com/api/3/product/'+req.body.clientName+'/'+req.body.productId+'/sources?apikey=hackathon-qdu8sarvq',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  console.log('options: ',options);
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
            else if ((data.products[i]['sources'][0]) === ('ASSOCIATION') || (data.products[i]['sources'][0]) === ('UPC') || (data.products[i]['sources'][0]) === ('EXTERNAL_ID')) {
              var innerSyndication = [];
              syndication.push(innerSyndication)
              innerSyndication.push((data.products[i]['client']), (data.products[i]['externalId']))
            }
            source.syndication = syndication;
            source.family = family;
        }
      }

      // console.log('syndication: ', syndication);
      console.log('Oracle call complete')
      console.log('source: ', source)
      // Step 2 (hagrid syndicated call - first nested cal - all displayed reviews)
      let hagopt = {
        uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&keyproperty=syndication&limit=100',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
      };
      rp(hagopt)
        .then(function (hagsynd) {
          dashboard['totalDisplayNumber'] = hagsynd['TotalResults'];
          console.log('dashboard["totalDisplayNumber"]: ',dashboard['totalDisplayNumber'] )
          // set hagrid object to value of first call
          // need to march through the object - limit 100 is max
          // when marching through will just add to the results array
          // the rest of the object's info does not change in significant ways
          hagridTotalObj = hagsynd;
          hagridTotalResults = hagsynd['Results'];
          console.log('hagridTotalResults.length is ', hagridTotalResults.length);
            // console.log('hagridTotalResults[0]: ',hagridTotalResults[0]);
            // console.log('hagridTotalResults[0]["Id"]: ',hagridTotalResults[0]["Id"]);
          // if there are less than 100 results - no need to march
          if(dashboard['totalDisplayNumber']<=100){
            console.log('Hagrid total displayable with less than 100 results');
          } else {
            // more than 100 results - need to make more hagrid calls to complete
            for(let i = 1; i < dashboard['totalDisplayNumber']/100;i++) {
              // console.log('Now will offset by ',i*100);
              // console.log('hagridTotalResults.length: ',hagridTotalResults.length);
              let hagopt = {
                uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&keyproperty=syndication&limit=100&offset='+(i*100),
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
              };
              // console.log('hagopt: ',hagopt);
              rp(hagopt)
                .then(function (hagsynd) {
                  // console.log('hagsynd["Results"][0]["Id"]: ',hagsynd['Results'][0]["Id"]);
                  // console.log('hagridTotalResults.length is ', hagridTotalResults.length);
                  // console.log('hagsynd["Results"].length is ',hagsynd["Results"].length);
                  completeCall(hagsynd);
                })
                .catch(function (err) {
                  // API call failed...
              });
            }
          }
          // function to concat new results array to the previous results array
          //    from the next offset call
          function completeCall(data){
            hagridTotalResults.push.apply(hagridTotalResults, data["Results"]);
            // console.log('hitting completeCall function, loopVal #',loopVal);
            // console.log('data["Results"].length: ',data["Results"].length);
            // console.log('hagridTotalResults.length is ', hagridTotalResults.length);
            return;
          }
          //timeout code was here but was moved to end of steps
          //End of Step 2
          //Step 3
          // console.log('Source: ', source);
          //2 paths - family and syndication
          //Step 3a - Family
          // if no families - can skip call
          // get length of family array
          let famLen = source.family.length
          if(famLen==0){
            console.log('There are no families - can skip call - go to Step 3b')
          } else {
            // there are families to iterate through
            for(let i = 0; i<famLen;i++){
              console.log('outer family loop #',i);
              console.log('source.family[i][0]: ',source.family[i][0]);
              console.log('source.family[i][1]: ',source.family[i][1]);
              // native family call
              let hagopt = {
                uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+source.family[i][0]+'&ApiVersion=5.4&filter=productid:'+source.family[i][1]+'&limit=100&excludeFamily=true',
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
              };
              // First family call
              rp(hagopt)
                .then(function (hagfam) {
                  // console.log('hagfam["TotalResults"]: ', hagfam["TotalResults"]);
                  // if less than 100 results - no need to march
                  if(hagfam["TotalResults"]<=100){
                    console.log('for family member ',i,' less than 100 results - no need to march');
                  } else {
                  console.log('first rp call for i = ',i);
                  familyObj[source.family[i][1]] = hagfam;
                  // march over results
                  for(let j = 1; j<hagfam["TotalResults"]/100;j++){
                    console.log('Inner family loop #',j);
                    var hagoffopt = {
                      uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+source.family[i][0]+'&ApiVersion=5.4&filter=productid:'+source.family[i][1]+'&limit=100&excludeFamily=true&offset='+(j*100),
                      headers: {
                          'User-Agent': 'Request-Promise'
                      },
                      json: true // Automatically parses the JSON string in the response
                    };
                    console.log('hagoffopt: ',hagoffopt);
                    rp(hagoffopt)
                      .then(function (hagfamoffset) {
                        console.log('hitting offset rp');
                        console.log('i: ',i);
                        console.log('hagfamoffset["Results"].length: ', hagfamoffset["Results"].length);
                        console.log('familyObj[source.family[i][1]]["Results"].length: ', familyObj[source.family[i][1]]["Results"].length);
                        familyObj[source.family[i][1]]['Results'].push.apply(familyObj[source.family[i][1]]['Results'], hagfamoffset["Results"]);
                        console.log('hagfamoffset["Results"].length: ',hagfamoffset["Results"].length);
                        console.log('familyObj[source.family[i][1]]["Results"].length: ', familyObj[source.family[i][1]]['Results'].length);
                        // completeFamCall(hagfamoffset);

                      })
                      .catch(function (err) {
                        // API call failed...
                      });
                    }
                  }
                  // function completeFamCall(data){
                  //   familyObj[source.family[i][1]]['results'].push.apply(familyObj[source.family[i][1]]['results'], data["Results"]);
                  //   console.log('hitting completeFamCall function');
                  //   console.log('data["Results"].length: ',data["Results"].length);
                  //   console.log('familyObj[source.family[i][1]]["results"].length: ', familyObj[source.family[i][1]]['results'].length);
                  //   return;
                  // }
                })
                .catch(function (err) {
                    // API call failed...
              });
            }
          }
          // step 3b Syndication path
          // if no syndication - can skip call
          // get length of syndication array
          let syndLen = source.syndication.length
          if(syndLen==0){
            console.log('There are no syndication - can skip call - go to Step 4')
          } else {
          for(let i = 0, len = source.syndication.length; i<len;i++){
            console.log('outer family loop #',i);
            console.log('source.syndication[i][0]: ',source.syndication[i][0]);
            console.log('source.syndication[i][1]: ',source.syndication[i][1]);
            let hagopt = {
              uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+source.syndication[i][0]+'&ApiVersion=5.4&filter=productid:'+source.syndication[i][1]+'&limit=100&excludeFamily=true',
              headers: {
                  'User-Agent': 'Request-Promise'
              },
              json: true // Automatically parses the JSON string in the response
            };
                rp(hagopt)
                  .then(function (hagsyn) {
                    // console.log('hagsyn["TotalResults"]: ', hagsyn["TotalResults"]);
                    console.log('Sydication first rp call for i = ',i);
                    console.log('hagsyn["TotalResults"]: ',hagsyn["TotalResults"]);
                    console.log('source.syndication['+i+'][1]: ',source.syndication[i][1]);
                    console.log('syndObj: ',syndObj);
                    syndObj[source.syndication[i][1]] = hagsyn;
                    console.log('syndObj[source.syndication['+i+'][1]]["TotalResults"]: ',syndObj[source.syndication[i][1]]["TotalResults"]);
                    // march over results
                    if(hagsyn["TotalResults"]>100){
                    for(let j = 1; j<hagsyn["TotalResults"]/100;j++){
                      console.log('Inner synd loop #',j);
                      var hagsynoffopt = {
                        uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+source.syndication[i][0]+'&ApiVersion=5.4&filter=productid:'+source.syndication[i][1]+'&limit=100&excludeFamily=true&offset='+(j*100),
                        headers: {
                            'User-Agent': 'Request-Promise'
                        },
                        json: true // Automatically parses the JSON string in the response
                      };
                      console.log('hagsynoffopt: ',hagsynoffopt);
                      rp(hagsynoffopt)
                        .then(function (hagsynoffset) {
                          console.log('hitting offset rp');
                          console.log('i: ',i);
                          console.log('hagsynoffset["Results"].length: ', hagsynoffset["Results"].length);
                          console.log('syndObj[source.syndication[i][1]]["Results"].length: ', syndObj[source.syndication[i][1]]["Results"].length);
                          syndObj[source.syndication[i][1]]['Results'].push.apply(syndObj[source.syndication[i][1]]['Results'], hagsynoffset["Results"]);
                          console.log('hagsynoffset["Results"].length: ',hagsynoffset["Results"].length);
                          console.log('syndObj[source.syndication[i][1]]["Results"].length: ', syndObj[source.syndication[i][1]]['Results'].length);

                        })
                        .catch(function (err) {
                          // API call failed...
                        });
                    }
                  } else {
                    console.log('less than 100 syndicated reviews');
                  }
                  })
                  .catch(function (err) {
                      // API call failed...
                  });
                // reject calls
                // console.log('Switchboard data - using find - switchboardArray.find(x => x._name === "'+clientName.toLowerCase()+'")',switchboardArray.find(x => x._name.toLowerCase() === clientName.toLowerCase()));
                console.log('Switchboard data - using find - switchboardArray.find(x => x._name === "'+clientName.toLowerCase()+'")');
                // console.log('Switchboard data - using find - switchboardArray.find(x => x._name === "Buyagift-EN")',switchboardArray.find(x => x._name.toLowerCase() === 'buyagift-en'));
                var switchEntry = switchboardArray.find(x => x._name.toLowerCase() === clientName.toLowerCase());
                var theKeys = Object.getOwnPropertyNames(switchEntry["import"]).toString();
                // console.log('theKeys: ', theKeys);

                // console.log('source.syndication['+i+'][0]: ',source.syndication[i][0]);

                var getPropValue = function(prop){
                  console.log('prop: ',prop);
                  var match = new RegExp(prop, 'i').exec(theKeys);
                  console.log('match: ',match);
                  // return match && match.length > 0 ? theObject[match[0]] : '';
                  return match[0];
                }
                var testSwitch1 = getPropValue(source.syndication[i][0]);
                console.log('testSwitch1: ', testSwitch1);
                console.log('switchEntry["import"]['+testSwitch1+']: ',switchEntry["import"][testSwitch1]);
                var modCodes = switchEntry["import"][testSwitch1]['_excludedContentCodesForImport'];
                console.log('modCodes: ',modCodes);
                var contentCodeLength = modCodes.length;
                // console.log('getPropValue('+source.syndication[i][0]+'): ',getPropValue(source.syndication[i][0]));
                // console.log('switchEntry["import"]: ',switchEntry["import"]);
                // var switchEntry = switchboardArray.find(x => x._name.toLowerCase() === 'oralb-fi_fi');

                // var contentCodeLength = switchEntry["import"][source.syndication[i][0]].length;
                // console.log('contentCodeLength: ', contentCodeLength);

                // var contentCodeLength = switchEntry["import"].find(x => x.[source.syndication[i][0]].length;
                // console.log('contentCodeLength: ', contentCodeLength);
                // console.log('Pre Rejtest - syndObj: ', syndObj);
                console.log('Pre Rejtest - syndTotal: ',syndTotal);
                console.log('Pre Rejtest - syndDisplayTotal: ',syndDisplayTotal);
                // console.log('Pre Rejtest - syndObj[source.syndication[0][1]]["Results"].length: ',syndObj[source.syndication[0][1]]["Results"].length);

                var rejtest = {};
                if(syndDisplayTotal==0){
                  console.log('no syndication');
                } else if (syndObj[source.syndication[0][1]]["Results"].length>syndDisplayTotal){
                  console.log('there are blocked syndicated reviews');
                  for(let i=0;i<contentCodeLength;i++){
                    console.log('Rejected loop #',i);
                    // var hagrejopt = {
                    //   uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=test&clientName='+source.syndication[0][0]+'&keyProperty=syndication&filter=productid:'+source.syndication[0][1]+'&include=products&stats=reviews&filter=ModeratorCode:'+switchEntry["import"][source.syndication[i][0]][i],
                    //   headers: {
                    //       'User-Agent': 'Request-Promise'
                    //   },
                    //   json: true // Automatically parses the JSON string in the response
                    // };

                    var hagrejopt = {
                      uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=test&clientName='+source.syndication[0][0]+'&keyProperty=syndication&filter=productid:'+source.syndication[0][1]+'&include=products&stats=reviews&filter=ModeratorCode:'+modCodes[i],
                      headers: {
                          'User-Agent': 'Request-Promise'
                      },
                      json: true // Automatically parses the JSON string in the response
                    };
                    console.log('hagrejopt: ',hagrejopt);
                    rp(hagrejopt)
                      .then(function (hagrej) {
                        hagrej["Results"][0]["Content"] = switchboardOshKoshData["import"]["Carters"]["_excludedContentCodesForImport"][i];
                        rejected["Results"].push.apply(rejected["Results"],hagrej["Results"]);
                        rejtest = rejected;
                    })
                    .catch(function (err) {
                          // API call failed...
                    });
                  }
                  // function rejectConcat(hagrejobj){
                  //   rejected["Results"].push.apply(rejected["Results"],hagrej["Results"]);
                  //   console.log('rejected["Results"].length = ',rejected["Results"].length);
                  //   console.log('rejected: ',rejected);
                  //   return rejected;
                  // }
                }
              }
            }

              var timeDelay = 4000 + dashboard['totalDisplayNumber'];
              console.log('timeDelay: ',timeDelay);
              setTimeout(myTimeout1, timeDelay);

// old iterator function
//   var len = hagridTotalResults.length;
            //   // console.log('len: ',len);
            //   for (let i=0;i<len;i++){
            //     totalId.push(results[i]["Id"]);
            //     // console.log('totalId: ',totalId);
            //     if(results[i]["IsSyndicated"]){
            //       syndTotal++
            //       if(results[i]["IsRatingsOnly"]){
            //         syndRatOnly++
            //       }
            //     }
            //     if(results[i]["IsRatingsOnly"]){
            //       natRatOnly++
            //     }
            //   }
            //   console.log('syndTotal: ',syndTotal);
            //   console.log('syndRatOnly: ',syndRatOnly);
            //   console.log('natRatOnly: ',natRatOnly);
            //   console.log('totalId: ',totalId);
            //   res.json(hagridTotalObj);



              function myTimeout1() {
                console.log("waiting "+timeDelay+" milliseconds");
                console.log('finished for loop');
                console.log('waiting for calls');
                // console.log('Switchboard data- switchboardArray[0]["import"]["EverydaymeFI_FI"]["_excludedContentCodesForImport"]:',switchboardArray[0]["import"]["EverydaymeFI_FI"]["_excludedContentCodesForImport"]);

                console.log('totalId.length: ',totalId.length);
                console.log('hagridTotalResults.length: ',hagridTotalResults.length);
                hagridTotalObj['Results']=hagridTotalResults;
                console.log('hagridTotalObj["Results"].length is ',hagridTotalObj["Results"].length);
                var famRevTotal = 0;
                if (Object.keys(familyObj).length==0){
                  famRevTotal = 0;
                } else {
                  famRevTotal = familyObj[source.family[0][1]]["Results"].length;
                }
                setTimeout(myTimeout2, 4000);
                function myTimeout2(){
                  console.log('rejected: ',rejected);
                  if (syndTotal==0){
                    var syndicatedReviews = 0;
                    var blockedSyndicatedReviews = 0;
                  } else {
                    var syndicatedReviews = syndObj[source.syndication[0][1]]["Results"].length;
                    var blockedSyndicatedReviews = syndObj[source.syndication[0][1]]["Results"].length-syndTotal;
                  }

                  var responseObj = {
                    hagrid:hagridTotalObj,
                    syndObj,
                    familyObj,
                    rejected: rejtest,
                    dashboard: {
                      nativeReviews:nativeContentTotal,
                      syndicatedReviews:syndicatedReviews,
                      familyReviews:famDisplayTotal,
                      totalReviews:allReviewDisplayTotal,
                      ratingsOnlyReviews:nativeRatingsOnlyTotal,
                      displayableNativeReviews:nativeDisplayTotal,
                      blockedSyndicatedReviews:blockedSyndicatedReviews,
                      displayableSyndicatedReviews:syndDisplayTotal}};
                  console.log('responseObj: ',responseObj);
                  res.json(responseObj);
                }
              }
          })
          .catch(function (err) {
        // API call failed...
          })
        })
    .catch(function (err) {
        // API call failed...
    });
});


// paginate route
router.route('/paginate')
.post(function(req,res){
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  var category = req.body.category;
  var pageNum = req.body.pageNum;
  console.log('clientName: ',clientName,' productId: ',productId, ' category: ',category,' pageNum: ',pageNum);
  // Step 1 (Oracle call to get sources)
  var source = new Object ();
  var options = {
    uri: 'https://oracle-bazaar.prod.us-east-1.nexus.bazaarvoice.com/api/3/product/'+clientName+'/'+productId+'/sources?apikey=hackathon-qdu8sarvq',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  console.log('options: ',options);
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
            else if ((data.products[i]['sources'][0]) === ('ASSOCIATION') || (data.products[i]['sources'][0]) === ('UPC') || (data.products[i]['sources'][0]) === ('EXTERNAL_ID')) {
              var innerSyndication = [];
              syndication.push(innerSyndication)
              innerSyndication.push((data.products[i]['client']), (data.products[i]['externalId']))
            }
            source.syndication = syndication;
            source.family = family;
        }
      }
      console.log('Oracle call complete')
      console.log('source: ', source)
      // switch statements for category
      switch(category) {
        case native:
          let natopt = {
            uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&limit=100&excludeFamily=true&offset='+(pageNum*100),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
          };
          rp(natopt)
            .then(function (data) {
              console.log('data: ',data);
              res.json(data);
            })
            .catch(function (err) {
                // API call failed...
            });
          break;
        case syndicated:
          let synopt = {
            uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&limit=100&excludeFamily=true&offset='+(pageNum*100),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
          };
          rp(synopt)
            .then(function (data) {
              console.log('data: ',data);
              res.json(data);
            })
            .catch(function (err) {
                // API call failed...
            });
          break;
        case family:
          let famopt = {
            uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&limit=100&excludeFamily=true&offset='+(pageNum*100),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
          };
          rp(famopt)
            .then(function (data) {
              console.log('data: ',data);
              res.json(data);
            })
            .catch(function (err) {
                // API call failed...
            });
          break;
        case blocked:
          let blockopt = {
            uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&limit=100&excludeFamily=true&offset='+(pageNum*100),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
          };
          rp(blockopt)
            .then(function (data) {
              console.log('data: ',data);
              res.json(data);
            })
            .catch(function (err) {
                // API call failed...
            });
          break;
        default:
          let totalopt = {
            uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&limit=100&excludeFamily=true&offset='+(pageNum*100),
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
          };
          rp(totalopt)
            .then(function (data) {
              console.log('data: ',data);
              res.json(data);
            })
            .catch(function (err) {
                // API call failed...
            });
      }
    })
    .catch(function (err) {
        // API call failed...
    });

});

router.route('/update')
.post(function(req, res) {
 const doc = {
     description: req.body.clientName,
     amount: req.body.productId,
 };
 console.log(doc);
});
router.get('/delete', function(req, res){
 var id = req.query.id;
 console.log("id: ",id);
});
router.get('/getAll', function(req, res) {
 var data = [{clientName:"cvsPharmacy",productId:911321}];
 res.json(data)
});
module.exports = router;
