//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var rp = require('request-promise');

router.get('/', function(req, res){
  res.render('index')
});

router.route('/insert')
.post(function(req,res) {
  console.log('clientName: ',req.body.clientName,'productId: ',req.body.productId);
  var options = {
    // uri: 'https://api.github.com/users/Sahedeva/repos',
    uri: 'http://hagrid-bazaar.prod.eu-west-1.nexus.bazaarvoice.com/data/reviews.json?appkey=newRudy&clientname='+req.body.clientName+'&ApiVersion=5.4&filter=productid:'+req.body.productId+'&keyproperty=syndication',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  console.log('options: ',options);
rp(options)
    .then(function (data) {
      console.log('data',data);
        res.json(data);
    })
    .catch(function (err) {
        // API call failed...
    });
})


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