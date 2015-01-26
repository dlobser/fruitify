var assert = require('assert');
var config = require('../config.json');
var shapeways = require('shapeways');
//var fs = require('fs');

exports.uploadModel = function (req, res, done) {

  var old_post = shapeways.client.prototype.post;
  shapeways.client.prototype.post = function (url, body, callback) {
    //assert.equal(url, "https://api.shapeways.com/models/v1");
    //assert.equal(typeof (body), "string");
    console.log(url, callback)
    callback();
  };

  var client = new shapeways.client({
    consumerKey: config.app.key,
    consumerSecret: config.app.secret,
    oauthToken: req.session.oauthToken,
    oauthSecret: req.session.oauthSecret
  });
  var params = {
    file: req.body.str,
    fileName: "model.obj",
    hasRightsToModel: true,
    acceptTermsAndConditions: true,
  };
  client.addModel(params, function (error, results) {
    if (error) return console.log(error)
      //assert.equal(typeof (results), "object");
      //assert.equal(error, null);
    console.log('ಠoಠ ' + JSON.stringify(results))
    res.send(results);
    done();
  });

  shapeways.client.prototype.post = old_post;
  //}
};

exports.uploadModelThumbnail = function (req, res, done) {
  var old_post = shapeways.client.prototype.post;
  shapeways.client.prototype.post = function (url, body, callback) {
    //assert.equal(url, "https://api.shapeways.com/models/86/photos/v1");
    //assert.equal(typeof (body), "string");
    console.log(url, callback)
    callback();
  };

  var client = new shapeways.client({
    consumerKey: config.app.key,
    consumerSecret: config.app.secret,
    oauthToken: req.session.oauthToken,
    oauthSecret: req.session.oauthSecret
  });
  var params = {
    file: req.body.thumbnail,
  };
  client.addModelPhoto(86, params, function (error, results) {
    if (error) return console.log(error)
      //assert.equal(typeof (results), "object");
      //assert.equal(error, null);
    console.log('¬_¬' + JSON.stringify(results))
    res.send(results);
    done();
  });

  shapeways.client.prototype.post = old_post;
};