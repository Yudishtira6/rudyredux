//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var rp = require('request-promise');
var switchboardArray = [];
var nativeContentTotal = 0;
var nativeRatingsOnlyTotal = 0;
var nativeDisplayTotal = 0;
var syndDisplayTotal = 0;
var famDisplayTotal = 0;
var allReviewDisplayTotal = 0;
// var fs = require('fs'),
//     path = require('path'),    
//     filePath = path.join(__dirname, '../../switchboard-expressiveClient.json');
// console.log("start");
// var stream = fs.createReadStream(filePath, {flags: 'r', encoding: 'utf-8'});
// var buf = '';
// stream.on('data', function(d) {
//     buf += d.toString(); // when data is read, stash it in a string buffer
//     pump(); // then process the buffer
// });

// function pump() {
//     var pos;
//     while ((pos = buf.indexOf('\n')) >= 0) { // keep going while there's a newline somewhere in the buffer
//         if (pos == 0) { // if there's more than one newline in a row, the buffer will now start with a newline
//             buf = buf.slice(1); // discard it
//             continue; // so that the next iteration will start with data
//         }
//         processLine(buf.slice(0,pos)); // hand off the line
//         buf = buf.slice(pos+1); // and slice the processed data off the buffer
//     }
// }
// console.log('end');
// function processLine(line) { // here's where we do something with a line

//     if (line[line.length-1] == '\r') line=line.substr(0,line.length-1); // discard CR (0x0D)

//     if (line.length > 0) { // ignore empty lines
//         var obj = JSON.parse(line); // parse the JSON
//         switchboardArray.push(obj);
//     }
// }

router.get('/', function(req, res){
  res.render('index')
});

// Test routes

// product
router.route('/getProductDetails').post(function(req,res){
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
        // API call failed...
    });
});

// Oracle route
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

// source for real - syndication
router.route('/sourceforrealSyn').post(function(req,res){
  console.log('*****');
  console.log('sourceforrealSyn route: ')
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId, 'source: ',req.body.source);
  console.log('*****');
  var source = req.body.source;
  var syndications = [];
  // iterate through source object for syndication info
  for (let i = 0, len = source.syndication.length;i<len;i++){
    var options = {
      uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/products.json?apiVersion=5.4&appKey=test&clientName='+source.syndication[i][0]+'&filter=id:'+source.syndication[i][1],
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };
    console.log('options: ',options);
    rp(options)
      .then(function (data) {
        console.log('data for sfr Syn: ',JSON.stringify(data));
        syndications.push(data);
      })
      .catch(function (err) {
          // API call failed...
      });
  }
  // delay
  setTimeout(myTimeout5, 4000);
  function myTimeout5() {
    var SynResponseObject = {syndicationData:syndications};
    res.json(SynResponseObject);
  }
});

// source for real - family
router.route('/sourceforrealFam').post(function(req,res){
  console.log('*****');
  console.log('sourceforrealFam route: ')
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId, 'source: ',req.body.source);
  console.log('*****');
  var source = req.body.source;
  var families = [];
  // iterate through source object for syndication info
  for (let i = 0, len = source.family.length;i<len;i++){
    var options = {
      uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/products.json?apiVersion=5.4&appKey=test&clientName='+source.family[i][0]+'&filter=id:'+source.family[i][1],
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };
    console.log('options: ',options);
    rp(options)
      .then(function (data) {
        console.log('data for sfr Fam: ',JSON.stringify(data));
        families.push(data);
      })
      .catch(function (err) {
          // API call failed...
      });
  }
  // delay
  setTimeout(myTimeout4, 4000);
  function myTimeout4() {
    var FamResponseObject = {familyData:families};
    res.json(FamResponseObject);
  }
});



//  pagination for reals
router.route('/paginationforreals').post(function(req,res){
  console.log('*****');
  console.log('paginationforreals route: ')
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId, 'source: ',req.body.source, ' category: ', req.body.category, ' pageNumber: ', req.body.pageNumber);
  console.log('*****');
  var source = req.body.source;
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  var category = req.body.category;
  var pageNumber = req.body.pageNumber;
  let pagopt = {
    uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&keyproperty=syndication&limit=100&offset='+(pageNumber*100),
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log('hagopt: ',hagopt);
  rp(pagopt)
    .then(function (pageResults) {
      console.log('****')
      console.log('pageResults: ', pageResults);
      console.log('****')
      res.json(pageResults);
    })
    .catch(function (err) {
      // API call failed...
  });
});

// sources
router.route('/getSources').post(function(req,res){
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId);
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
      console.log('Oracle call complete');
      console.log('source: ', source);

      // iterate through synd sources to get switchboard info

    })
    .catch(function (err) {
        // API call failed...
    });
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
      syndDisplayTotal = synRev["BatchedResults"]["q0"]["TotalResults"];
      allReviewDisplayTotal = synRev["BatchedResults"]["q1"]["Results"][0]["ProductStatistics"]["ReviewStatistics"]["TotalReviewCount"];
      // console.log('synRev: ',JSON.stringify(prodData));
      console.log('syndDisplayTotal: ',syndDisplayTotal);
      console.log('allReviewDisplayTotal: ',allReviewDisplayTotal);
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
          nativeDisplayTotal = conRat["BatchedResults"]["q0"]["TotalResults"];
          if (conRat["BatchedResults"]["q1"]["Results"].length>0){
              nativeRatingsOnlyTotal = conRat["BatchedResults"]["q1"]["Results"][0]["ReviewStatistics"]["TotalReviewCount"];
          } else {
            nativeRatingsOnlyTotal = 0;
          }
          nativeContentTotal = nativeDisplayTotal - nativeRatingsOnlyTotal;
          famDisplayTotal = allReviewDisplayTotal - nativeDisplayTotal - syndDisplayTotal;
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

// On user input - quick call to get product name and image
// Also get Dashboard data - all except blocked syndication reviews
router.route('/getProductDetailsComplex')
.post(function(req,res) {
  // get user inputs
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId);

  // batch call #1 - q0 syndicated total, q1 - review display total
  var batch1Options = {
    uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/batch.json?appkey=narwhaul&clientname='+req.body.clientName+'&keyproperty=syndication&ApiVersion=5.4&resource.q0=reviews&filter.q0=productid:'+req.body.productId+'&filter.q0=issyndicated:true&limit.q0=1&resource.q1=statistics&filter.q1=productid:'+req.body.productId+'&stats.q1=reviews',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  console.log('batch1Options options: ',batch1Options);
  rp(batch1Options)
    .then(function (synRev) {
      syndDisplayTotal = synRev["BatchedResults"]["q0"]["TotalResults"];
      allReviewDisplayTotal = synRev["BatchedResults"]["q1"]["Results"]["ReviewStatistics"]["TotalReviewCount"];
      console.log('synRev: ',JSON.stringify(prodData));
      console.log('syndDisplayTotal: ',syndDisplayTotal);
      console.log('allReviewDisplayTotal: ',allReviewDisplayTotal);

      // nested batch2Option
      // batch call #2 - q0 num native reviews (reviews with content + ratingsOnly)
      // q1 num ratingsOnly native reviews
      var batch2Options = {
        uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/batch.json?appkey=narwhaul&clientname='+req.body.clientName+'&excludeFamily=true&ApiVersion=5.4&resource.q0=reviews&filter.q0=productid:'+req.body.productId+'&limit.q0=1&resource.q1=reviews&filter.q1=productid:'+req.body.productId+'&limit.q1=1&filter.q1=isRatingsOnly:true',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
      };
      console.log('batch2Options options: ',batch2Options);
      rp(batch2Options)
        .then(function (conRat) {
          nativeDisplayTotal = conRat["BatchedResults"]["q0"]["TotalResults"];
          nativeRatingsOnlyTotal = conRat["BatchedResults"]["q1"]["Results"]["ReviewStatistics"]["TotalReviewCount"];
          nativeContentTotal = nativeDisplayTotal - nativeRatingsOnlyTotal;
          famDisplayTotal = allReviewDisplayTotal - nativeDisplayTotal - syndDisplayTotal;
          console.log('conRat: ',JSON.stringify(conRat));
          console.log('nativeContentTotal: ',nativeContentTotal);
          console.log('nativeDisplayTotal: ',nativeDisplayTotal);
          console.log('nativeRatingsOnlyTotal: ',nativeRatingsOnlyTotal);
          console.log('famDisplayTotal: ',famDisplayTotal);

          // nested product function
          // plug in user input to hagrid product call to get name and image
          var options = {
            uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/products.json?apiVersion=5.4&appKey=narwhaul&clientName='+req.body.clientName+'&filter=id:'+req.body.productId,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
          };
          console.log('Product options: ',options);
          rp(options)
            .then(function (prodData) {
              console.log('prodData',JSON.stringify(prodData));
              res.json(prodData);
            })
            .catch(function (err) {
                // API call failed...
            });
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
router.route('/insert')
.post(function(req,res) {
  // get user inputs
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId);
  // console.log('switchboardArray[0]: ',switchboardArray[0]);
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
