var config = require('../config.json');
var shapeways = require('shapeways');

exports.uploadModel = function (req, res) {

  var client = new shapeways.client({
    consumerKey: config.app.key,
    consumerSecret: config.app.secret,
    oauthToken: req.session.oauthToken,
    oauthSecret: req.session.oauthSecret
  });
  var params = {
    //file: './files/fruitify.obj',
    //file: encodeURIComponent(req.body.str.toString('base64')),
    file: req.body.str,
    fileName: 'fruitify' + Math.round(Math.random() * 100) + '.x3d',
    hasRightsToModel: true,
    acceptTermsAndConditions: true,
  };
  client.addModel(params, function (error, results) {
    if (error) return console.log(error)
    console.log('ಠoಠ ' + JSON.stringify(results))
    res.send(results);
  });

};