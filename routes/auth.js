var config = require('../config.json');
var shapeways = require('shapeways');

exports.login = function (req, res) {
  var callbackUrl = req.protocol + '://' + req.hostname;
  if (config.port != 80) {
    callbackUrl += ':' + config.port;
  }
  callbackUrl += '/callback';
  var client = new shapeways.client({
    consumerKey: config.app.key,
    consumerSecret: config.app.secret,
    authorizationCallback: callbackUrl,
  }, function (error, authUrl) {
    if (!error && authUrl) {
      req.session.oauthToken = client.oauthToken;
      req.session.oauthSecret = client.oauthSecret;
      console.log(req.session.oauthToken, req.session.oauthSecret)
        // res.writeHead(302, {
        //   Location: authUrl + "&oauth_callback=" + callbackUrl
        // });
      res.redirect(authUrl + "&oauth_callback=" + callbackUrl)
        //return res.end();
      return;
    }

    res.render('error', {
      title: config.app.name + ': Error Authorizing with Shapeways',
      error: error,
    });
  });

};

exports.callback = function (req, res) {
  var client = new shapeways.client({
    consumerKey: config.app.key,
    consumerSecret: config.app.secret,
    oauthToken: req.session.oauthToken,
    oauthSecret: req.session.oauthSecret,
  });
  client.verifyUrl(req.url, function (error) {
    if (!error) {
      req.session.oauthToken = client.oauthToken;
      req.session.oauthSecret = client.oauthSecret;
      res.writeHead(302, {
        Location: '/'
      });
      return res.end();
    } else {
      res.render('error', {
        title: config.app.name + ': Error Authorizing with Shapeways',
        error: error,
      });
    }
  });
};

exports.middleware = function (req, res, next) {
  // these are safe pages to serve when a user isn't logged in
  if (req.url !== '/login' && req.url.indexOf('/callback') !== 0) {
    if (!req.session.oauthSecret || !req.session.oauthToken) {
      res.writeHead(302, {
        Location: '/login',
      });
      return res.end();
    } else {
      req.api = new shapeways.client({
        consumerKey: config.app.key,
        consumerSecret: config.app.secret,
        oauthToken: req.session.oauthToken,
        oauthSecret: req.session.oauthSecret,
      });
    }
  }
  next();
};

exports.uploadModel = function (req, res) {

  console.log(req.body.str)
  var client = new shapeways.client({
    consumerKey: config.app.key,
    consumerSecret: config.app.secret,
    oauthToken: req.session.oauthToken,
    oauthSecret: req.session.oauthSecret,
  }, function (error, authUrl) {
    if (!error && authUrl) {
      req.session.oauthToken = client.oauthToken;
      req.session.oauthSecret = client.oauthSecret;
      console.log('urllib ' + req.session.oauthToken, req.session.oauthSecret)
        // res.writeHead(302, {
        //   Location: authUrl + "&oauth_callback=" + callbackUrl
        // });
        //res.redirect(authUrl + "&oauth_callback=" + callbackUrl)
        //return res.end();
      var urllib = require('urllib');
      //console.log(req.body.str);
      urllib.request('http://api.shapeways.com/models/v1' + req.body.str, {
        method: 'POST',
        timeout: 6000 //,
          // data:{
          //   'str': req.body.str
          // }
      }, function (err, data, res) {
        if (err) return console.error(err);
        console.log('(ಠ_ಠ)' + JSON.stringify(data));
        return;
      });
    }

    res.render('error', {
      title: config.app.name + ': Error Authorizing with Shapeways',
      error: error,
    });
  });
}