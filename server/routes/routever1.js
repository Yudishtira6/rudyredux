//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var rp = require('request-promise');
var jsonfiletest = require("../../sample.json");
console.log('jsonfiletest: ',jsonfiletest);
const fs = require('fs');

fs.readFile('../../sampleswitchtest.json', (err, data) => {  
    if (err) throw err;
    let switchfiletest = JSON.parse(data);
    console.log('switchfiletest: ',switchfiletest);
}
// var switchfiletest = require("../../sampleswitchtest.json");
// console.log('switchfiletest: ',switchfiletest);

var switchboardOshKoshData = {"_name":"Cartersoshkoshca","_syndicationVersion":2,"display":{"5084-fr_ca":{"_internalCode":"5084-fr_ca","_sources":{"Carters":{"_sourceDisplayName":"carters.com","_logoImageName":"https://photos-us.bazaarvoice.com/photo/2/cGhvdG86YXR0cmlidXRpb25sb2dvMg/cartersoshkoshca%3ACarters.gif","_summaryIcon":null,"_bannerIcon":null,"_displayOrder":2147483647,"_maxSyndicatedSummaries":0,"_contentConfigurations":{"REVIEW":{"_contentTruncationEnabled":false,"_showAttribution":true,"_showLogo":true,"_useAttributionLink":false,"_syndicationDisplayType":"INLINE","_showInSearchVoiceInlinePages":false}}},"OshKosh":{"_sourceDisplayName":"oshkosh.com","_logoImageName":"https://photos-us.bazaarvoice.com/photo/2/cGhvdG86YXR0cmlidXRpb25sb2dvMg/cartersoshkoshca%3AOshKosh.png","_summaryIcon":null,"_bannerIcon":null,"_displayOrder":2147483647,"_maxSyndicatedSummaries":0,"_contentConfigurations":{"REVIEW":{"_contentTruncationEnabled":false,"_showAttribution":true,"_showLogo":true,"_useAttributionLink":false,"_syndicationDisplayType":"INLINE","_showInSearchVoiceInlinePages":false}}}}},"5084-fr":{"_internalCode":"5084-fr","_sources":{"Carters":{"_sourceDisplayName":"carters.com","_logoImageName":"https://photos-us.bazaarvoice.com/photo/2/cGhvdG86YXR0cmlidXRpb25sb2dvMg/cartersoshkoshca%3ACarters.gif","_summaryIcon":null,"_bannerIcon":null,"_displayOrder":2147483647,"_maxSyndicatedSummaries":0,"_contentConfigurations":{"REVIEW":{"_contentTruncationEnabled":false,"_showAttribution":true,"_showLogo":true,"_useAttributionLink":false,"_syndicationDisplayType":"INLINE","_showInSearchVoiceInlinePages":false}}},"OshKosh":{"_sourceDisplayName":"oshkosh.com","_logoImageName":"https://photos-us.bazaarvoice.com/photo/2/cGhvdG86YXR0cmlidXRpb25sb2dvMg/cartersoshkoshca%3AOshKosh.png","_summaryIcon":null,"_bannerIcon":null,"_displayOrder":2147483647,"_maxSyndicatedSummaries":0,"_contentConfigurations":{"REVIEW":{"_contentTruncationEnabled":false,"_showAttribution":true,"_showLogo":true,"_useAttributionLink":false,"_syndicationDisplayType":"INLINE","_showInSearchVoiceInlinePages":false}}}}},"5084-en_ca":{"_internalCode":"5084-en_ca","_sources":{"Carters":{"_sourceDisplayName":"carters.com","_logoImageName":"https://photos-us.bazaarvoice.com/photo/2/cGhvdG86YXR0cmlidXRpb25sb2dvMg/cartersoshkoshca%3ACarters.gif","_summaryIcon":null,"_bannerIcon":null,"_displayOrder":2147483647,"_maxSyndicatedSummaries":0,"_contentConfigurations":{"REVIEW":{"_contentTruncationEnabled":false,"_showAttribution":true,"_showLogo":true,"_useAttributionLink":false,"_syndicationDisplayType":"INLINE","_showInSearchVoiceInlinePages":false}}},"OshKosh":{"_sourceDisplayName":"oshkosh.com","_logoImageName":"https://photos-us.bazaarvoice.com/photo/2/cGhvdG86YXR0cmlidXRpb25sb2dvMg/cartersoshkoshca%3AOshKosh.png","_summaryIcon":null,"_bannerIcon":null,"_displayOrder":2147483647,"_maxSyndicatedSummaries":0,"_contentConfigurations":{"REVIEW":{"_contentTruncationEnabled":false,"_showAttribution":true,"_showLogo":true,"_useAttributionLink":false,"_syndicationDisplayType":"INLINE","_showInSearchVoiceInlinePages":false}}}}},"5084":{"_internalCode":"5084","_sources":{"Carters":{"_sourceDisplayName":"carters.com","_logoImageName":"https://photos-us.bazaarvoice.com/photo/2/cGhvdG86YXR0cmlidXRpb25sb2dvMg/cartersoshkoshca%3ACarters.gif","_summaryIcon":null,"_bannerIcon":null,"_displayOrder":2147483647,"_maxSyndicatedSummaries":0,"_contentConfigurations":{"REVIEW":{"_contentTruncationEnabled":false,"_showAttribution":true,"_showLogo":true,"_useAttributionLink":false,"_syndicationDisplayType":"INLINE","_showInSearchVoiceInlinePages":false}}},"OshKosh":{"_sourceDisplayName":"oshkosh.com","_logoImageName":"https://photos-us.bazaarvoice.com/photo/2/cGhvdG86YXR0cmlidXRpb25sb2dvMg/cartersoshkoshca%3AOshKosh.png","_summaryIcon":null,"_bannerIcon":null,"_displayOrder":2147483647,"_maxSyndicatedSummaries":0,"_contentConfigurations":{"REVIEW":{"_contentTruncationEnabled":false,"_showAttribution":true,"_showLogo":true,"_useAttributionLink":false,"_syndicationDisplayType":"INLINE","_showInSearchVoiceInlinePages":false}}}}},"5084-en":{"_internalCode":"5084-en","_sources":{"Carters":{"_sourceDisplayName":"carters.com","_logoImageName":"https://photos-us.bazaarvoice.com/photo/2/cGhvdG86YXR0cmlidXRpb25sb2dvMg/cartersoshkoshca%3ACarters.gif","_summaryIcon":null,"_bannerIcon":null,"_displayOrder":2147483647,"_maxSyndicatedSummaries":0,"_contentConfigurations":{"REVIEW":{"_contentTruncationEnabled":false,"_showAttribution":true,"_showLogo":true,"_useAttributionLink":false,"_syndicationDisplayType":"INLINE","_showInSearchVoiceInlinePages":false}}},"OshKosh":{"_sourceDisplayName":"oshkosh.com","_logoImageName":"https://photos-us.bazaarvoice.com/photo/2/cGhvdG86YXR0cmlidXRpb25sb2dvMg/cartersoshkoshca%3AOshKosh.png","_summaryIcon":null,"_bannerIcon":null,"_displayOrder":2147483647,"_maxSyndicatedSummaries":0,"_contentConfigurations":{"REVIEW":{"_contentTruncationEnabled":false,"_showAttribution":true,"_showLogo":true,"_useAttributionLink":false,"_syndicationDisplayType":"INLINE","_showInSearchVoiceInlinePages":false}}}}}},"export":{},"import":{"Carters":{"_sourceClientName":"Carters","_allowDuplicateContent":true,"_contextDataValueStrategy":"IMPORT_MATCHING","_includeClientResponses":false,"_includeRatingsOnlyReviews":false,"_keepFeatured":false,"_productMatchingStrategies":["SYNDICATION_MATCH_TABLE","EAN","UPC","ISBN","EXTERNAL_ID"],"_ratingDimensionsStrategy":"IMPORT_ALL","_videoImportStrategy":"VIDEO_EXTERNAL_ONLY","_includePhotos":false,"_excludedContentCodesForImport":["RET","PC","PRI","STP","CSN"],"_copyFamilyAttributesFromHostProduct":false,"_syndicationVersion":2,"_sendThroughModeration":false},"OshKosh":{"_sourceClientName":"OshKosh","_allowDuplicateContent":true,"_contextDataValueStrategy":"IMPORT_MATCHING","_includeClientResponses":false,"_includeRatingsOnlyReviews":false,"_keepFeatured":false,"_productMatchingStrategies":["SYNDICATION_MATCH_TABLE","EAN","UPC","ISBN","EXTERNAL_ID"],"_ratingDimensionsStrategy":"IMPORT_ALL","_videoImportStrategy":"VIDEO_EXTERNAL_ONLY","_includePhotos":false,"_excludedContentCodesForImport":["RET","PC","PRI","STP","CSN"],"_copyFamilyAttributesFromHostProduct":false,"_syndicationVersion":2,"_sendThroughModeration":false}},"portal":{"_enabledAnalystReports":["PRR_SYNDICATION_INBOUND","PRR_SYNDICATION_PRODUCT"]}};

console.log('Switchboard data- switchboardOshKoshData["import"]["Carters"]["_excludedContentCodesForImport"]:',switchboardOshKoshData["import"]["Carters"]["_excludedContentCodesForImport"]);

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
  var familyObj = {};
  var syndObj = {};
  var rejected = {};
  rejected["Results"] = [];
  console.log('rejected: ',rejected);
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
  // console.log('options: ',options);
  rp(options)
    .then(function (data) {
      // console.log('data',JSON.stringify(data));
      console.log('data["products"].length: ',data["products"].length)

        
        var family = [];
        var syndication = [];

        var hero = data.products;
        var len = hero.length;
        console.log('hero: ',hero);
        console.log('len: ',len);
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

        console.log('syndication: ', syndication);
        console.log('working')
        console.log('source: ', source)
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
            // console.log('dashboard["totalDisplayNumber"]: ',dashboard['totalDisplayNumber'] )
            // console.log('hagsynd: ',JSON.stringify(hagsynd));
            hagridTotalObj = hagsynd;
            hagridTotalResults = hagsynd['Results'];
            // console.log('hagridTotalResults[0]: ',hagridTotalResults[0]);
            // console.log('hagridTotalResults[0]["Id"]: ',hagridTotalResults[0]["Id"]);
            // console.log('hagridTotalResults.length is ', hagridTotalResults.length);
            // need to march through the object - limit 100 is max
            // if(dashboard['totalDisplayNumber']<=100){
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
            // } else {
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

              function completeCall(data){
                hagridTotalResults.push.apply(hagridTotalResults, data["Results"]);
                // console.log('hitting completeCall function, loopVal #',loopVal);
                // console.log('data["Results"].length: ',data["Results"].length);
                // console.log('hagridTotalResults.length is ', hagridTotalResults.length);
                return;
              }

            
            //timeout code was here
              //End of Step 2

              //Step 3
              // console.log('Source: ', source);
              //2 paths - family and syndication
              // family
              for(let i = 0, len = source.family.length; i<len;i++){
                console.log('outer family loop #',i);
                console.log('source.family[i][0]: ',source.family[i][0]);
                console.log('source.family[i][1]: ',source.family[i][1]);
                let hagopt = {
                  uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+source.family[i][0]+'&ApiVersion=5.4&filter=productid:'+source.family[i][1]+'&limit=100&excludeFamily=true',
                  headers: {
                      'User-Agent': 'Request-Promise'
                  },
                  json: true // Automatically parses the JSON string in the response
                };
                rp(hagopt)
                  .then(function (hagfam) {
                    // console.log('hagfam["TotalResults"]: ', hagfam["TotalResults"]);
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
              // step 3 syndication path
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
                    console.log('first rp call for i = ',i);
                    syndObj[source.syndication[i][1]] = hagsyn;
                    // march over results
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
                  })
                  .catch(function (err) {
                      // API call failed...
                  });
              }

              var timeDelay = 4000 + dashboard['totalDisplayNumber'];
              console.log('timeDelay: ',timeDelay);
              setTimeout(myTimeout1, timeDelay);
              function myTimeout1() {
                console.log("waiting "+timeDelay+" milliseconds");
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
                // for (let product in syndObj){
                //   syndId.push(syndObj["Results"]["Id"]);
                // }

                console.log('syndTotal: ',syndTotal);
                console.log('syndRatOnly: ',syndRatOnly);
                console.log('natRatOnly: ',natRatOnly);
                var rejtest = {};
                if (syndObj[source.syndication[0][1]]["Results"].length>syndTotal){
                  console.log('there are blocked syndicated reviews');
                  for(let i=0,len=switchboardOshKoshData["import"]["Carters"]["_excludedContentCodesForImport"].length;i<len;i++){
                    console.log('Rejected loop #',i);
                    var hagrejopt = {
                      uri: 'http://hagrid-bazaar-external.prod.us-east-1.nexus.bazaarvoice.com/data/reviews.json?apiVersion=5.4&appKey=test&clientName='+source.syndication[0][0]+'&keyProperty=syndication&filter=productid:'+source.syndication[0][1]+'&include=products&stats=reviews&filter=ModeratorCode:'+switchboardOshKoshData["import"]["Carters"]["_excludedContentCodesForImport"][i],
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
                var responseObj = {hagrid:hagridTotalObj, syndObj, familyObj, rejected: rejtest, dashboard: {nativeReviews:(dashboard['totalDisplayNumber']-syndTotal), syndicatedReviews:syndObj[source.syndication[0][1]]["Results"].length, familyReviews:famRevTotal, totalReviews:dashboard['totalDisplayNumber'], ratingsOnlyReviews:0, displayableNativeReviews:(dashboard['totalDisplayNumber']-syndTotal), blockedSyndicatedReviews:(syndObj[source.syndication[0][1]]["Results"].length-syndTotal), displayableSyndicatedReviews:syndTotal}};
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
