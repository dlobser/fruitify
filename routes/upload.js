var config = require('../config.json');
var shapeways = require('shapeways');
var fs = require('fs');

exports.uploadModel = function (req, res) {

  fs.writeFile('./files/fruitify.obj', req.body.str, function () {
    var client = new shapeways.client({
      consumerKey: config.app.key,
      consumerSecret: config.app.secret,
      oauthToken: req.session.oauthToken,
      oauthSecret: req.session.oauthSecret
    });
    var params = {
      file: './files/tree.obj',
      //file: encodeURIComponent(req.body.str.toString('base64')),
      fileName: 'fruitify.obj',
      hasRightsToModel: true,
      acceptTermsAndConditions: true,
    };
    client.addModel(params, function (error, results) {
      if (error) return console.log(error)
      console.log('ಠoಠ ' + JSON.stringify(results))
      res.send(results);
    });

  })

};