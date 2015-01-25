var express = require('express');
var ejs = require('ejs');
var app = express();
var fs = require('fs');

var config = require('./config.json');
var routes = require('./routes/index.js');
var auth = require('./routes/auth.js');
var mongoose = require('mongoose');

app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
var session = require('cookie-session');
app.use(session({
  keys: config.app.key
}));

var port = process.env.PORT || config.port;
app.listen(port, function () {
  console.log('Listening on ' + port);
});

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  // yay!
  console.log('yay! database connected');
});

app.get('/', routes.index);

app.post('/upload', routes.uploadThumbnail);

app.get('/gallery', routes.gallery);

app.get('/records/:num', function (req, res) {

  var query = {};
  var select = 'data imgURL';
  var option = {
    limit: 2,
    skip: req.params.num
  };
  Record.find(query, select, option, function (err, data) {
      if (err) return console.error(err);
      res.send(data);
    })
    //res.render('gallery.html');
});

app.get('/login', auth.login);

app.get('/callback', auth.callback);

app.get('/:id/shape', routes.shapeRebuild);

//this should always be in the bottom of this file
app.get('/:id', routes.shapeShow);

// main page - display the card form
// app.get('/turbine', function (request, response) {

//   response.render("turbine.html");
// });

// app.get('/login', function (req, res) {
//   auth = new Auth;
//   return auth.login(function (error, callback) {
//     req.session.oauth_token = callback.oauth_token;
//     req.session.oauth_token_secret = callback.oauth_token_secret;
//     return res.redirect(callback.url);
//   });
// });

// app.get('/callback', function (req, res) {
//   auth = new Auth;
//   return auth.handleCallback(req.query.oauth_token, req.session.oauth_token_secret, req.query.oauth_verifier, function (callback) {
//     req.session.oauth_access_token = callback.oauth_access_token;
//     req.session.oauth_access_token_secret = callback.oauth_access_token_secret;
//     return res.redirect('/turbine');
//   });
// });

// app.post('/upload', function (req, res) {

//   var fs = require('fs');
//   var buffer = new Buffer(req.body.file);
//   fs.writeFile("./static/tree.obj", req.body.file, function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(req.body);
//       return models.putModel("./static/tree.obj", req.session.oauth_access_token, req.session.oauth_access_token_secret, function (callback) {
//         return res.render('upload_success.html', {
//           "callback": JSON.parse(callback),
//           "server": cfg.API_SERVER
//         });
//       });
//     }
//   });
// });

// /* Start the App
//  */
// // Make server turn on and listen at defined PORT (or port 3000 if is not defined)
// // var port = 3000;
// // app.listen(port, function() {
// //   console.log("Listening on " + port);
// // });

// isLoggedIn = function (session) {
//   if (!session.oauth_access_token) {
//     return false;
//   }
//   return true;
// };

// isJson = function (url) {
//   var json;
//   json = false;
//   if ((url.substring(url.length - 5)) === ".json") {
//     json = true;
//   }
//   return json;
// };