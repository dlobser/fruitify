var assert = require('assert');
//var libdir = (process.env.COVERAGE) ? "../../lib-cov" : "../../lib";
//var shapeways = require(libdir);
var shapeways = require('shapeways');

exports.uploadModel = function (req, res, done) {
  var old_post = shapeways.client.prototype.post;
  shapeways.client.prototype.post = function (url, body, callback) {
    assert.equal(url, "https://api.shapeways.com/models/86/files/v1");
    assert.equal(typeof (body), "string");
    console.log(url, body, callback);
    callback(null, {});
  };

  var client = new shapeways.client();
  var params = {
    file: req.body.str,
    fileName: "model.obj",
    hasRightsToModel: true,
    acceptTermsAndConditions: true,
  };
  client.addModelFile(86, params, function (error, results) {
    assert.equal(typeof (results), "object");
    assert.equal(error, null);
    done();
    console.log('ok');
  });

  shapeways.client.prototype.post = old_post;
}