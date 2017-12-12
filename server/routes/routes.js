//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var rp = require('request-promise');

router.get('/', function(req, res){
  res.render('index')
});

router.route('/getProductDetails')
.post(function(req,res) {
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

router.route('/insert')
.post(function(req,res) {
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId);
  var clientName = req.body.clientName;
  var productId = req.body.productId;
  var familyTotal = 0;
  var syndTotal = 0;
  var ratingsOnlyTotal = 0;
  var syndRatOnly = 0;
  var natRatOnly = 0;
  var totalId = [];
  var syndId = [];
  var sources = {};
  var dashboard = {};
  var totalReviews = {};
  var hagridTotalObj = {};
  var hagridTotalResults = [];
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
      console.log('data',JSON.stringify(data));

        var source = new Object ();
        var family = [];
        var syndication = [];

        var hero = data.products
        var len = hero.length

        for (i = 0; i < len; i++) {
              if ((data.products[i]['sources'][0]) === ('FAMILY')) {
                var innerFamily = [];
                family.push(innerFamily)
                innerFamily.push((data.products[i]['client']), (data.products[i]['externalId']))
              }
              else if ((data.products[i]['sources'][0]) === ('ASSOCIATION') || (data.products[i]['sources'][0]) === ('UPC')) {
                var innerSyndication = [];
                syndication.push(innerSyndication)
                innerSyndication.push((data.products[i]['client']), (data.products[i]['externalId']))
              }
              source.syndication = syndication;
              source.family = family;
          }

        console.log(syndication)
        console.log('working')
        console.log(source)
        // Step 2 (hagrid syndicated call)
        let hagopt = {
          uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+clientName+'&ApiVersion=5.4&filter=productid:'+productId+'&keyproperty=syndication&limit=100',
          headers: {
              'User-Agent': 'Request-Promise'
          },
          json: true // Automatically parses the JSON string in the response
        };
        rp(hagopt)
          .then(function (hagsynd) {
            // console.log('hagsynd',JSON.stringify(hagsynd));
            dashboard['totalDisplayNumber'] = hagsynd['TotalResults'];
            console.log('dashboard["totalDisplayNumber"]: ',dashboard['totalDisplayNumber'] )
            // console.log('hagsynd: ',JSON.stringify(hagsynd));
            hagridTotalObj = hagsynd;
            hagridTotalResults = hagsynd['Results'];
            // console.log('hagridTotalResults[0]: ',hagridTotalResults[0]);
            // console.log('hagridTotalResults[0]["Id"]: ',hagridTotalResults[0]["Id"]);
            console.log('hagridTotalResults.length is ', hagridTotalResults.length);
            // need to march through the object - limit 100 is max
            if(dashboard['totalDisplayNumber']<=100){
              var len = hagridTotalResults.length;
              console.log('len: ',len);
              for (let i=0;i<len;i++){
                totalId.push(results[i]["Id"]);
                console.log('totalId: ',totalId);
                if(results[i]["IsSyndicated"]){
                  syndTotal++
                  if(results[i]["IsRatingsOnly"]){
                    syndRatOnly++
                  }
                }
                if(results[i]["IsRatingsOnly"]){
                  natRatOnly++
                }
              }
              console.log('syndTotal: ',syndTotal);
              console.log('syndRatOnly: ',syndRatOnly);
              console.log('natRatOnly: ',natRatOnly);
              console.log('totalId: ',totalId);
              res.json(hagridTotalObj);
            } else {
              // more than 100 results - need to make more hagrid calls to complete
              for(let i = 1; i < dashboard['totalDisplayNumber']/100;i++) {
                console.log('Now will offset by ',i*100);
                console.log('hagridTotalResults.length: ',hagridTotalResults.length);
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
                    console.log('hagsynd["Results"][0]["Id"]: ',hagsynd['Results'][0]["Id"]);
                    console.log('hagridTotalResults.length is ', hagridTotalResults.length);
                    console.log('hagsynd["Results"].length is ',hagsynd["Results"].length);
                    completeCall(hagsynd, i);
                  })
                  .catch(function (err) {
                    // API call failed...
                });
              }

              function completeCall(data, loopVal){
                hagridTotalResults.push.apply(hagridTotalResults, data["Results"]);
                console.log('hitting completeCall function, loopVal #',loopVal);
                console.log('data["Results"].length: ',data["Results"].length);
                console.log('hagridTotalResults.length is ', hagridTotalResults.length);
                return;
              }

            }
            var timeDelay = 4000 + dashboard['totalDisplayNumber'];
            console.log('timeDelay: ',timeDelay);
            setTimeout(myTimeout1, timeDelay);
            function myTimeout1() {
              console.log("waiting 2 seconds");
              console.log('finished for loop');
              console.log('waiting for calls');
              var len = hagridTotalResults.length;
              console.log('len: ',len);
              for (let i=0;i<len;i++){
                totalId.push(hagridTotalResults[i]["Id"]);
                if(hagridTotalResults[i]["IsSyndicated"]){
                  syndTotal++
                  if(hagridTotalResults[i]["IsRatingsOnly"]){
                    syndRatOnly++
                  }
                }
                if(hagridTotalResults[i]["IsRatingsOnly"]){
                  natRatOnly++
                }
              }
              console.log('syndTotal: ',syndTotal);
              console.log('syndRatOnly: ',syndRatOnly);
              console.log('natRatOnly: ',natRatOnly);
              console.log('totalId.length: ',totalId.length);
              console.log('hagridTotalResults.length: ',hagridTotalResults.length);
              hagridTotalObj['Results']=hagridTotalResults;
              console.log('hagridTotalObj["Results"].length is ',hagridTotalObj["Results"].length)
              res.json(hagridTotalObj);
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
