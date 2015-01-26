var express = require('express');
var ejs = require('ejs');
var app = express();
var fs = require('fs');

var config = require('./config.json');
var routes = require('./routes/index.js');
var upload = require('./routes/upload.js');
var auth = require('./routes/auth.js');
var mongoose = require('mongoose');

var http = require('http');
var path = require('path');
var shapeways = require('shapeways');

app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
// var session = require('cookie-session');
// app.use(session({
//   keys: ['']
// }));
var session = require('express-session');
app.use(session({
  secret: 'shapeways',
  resave: false,
  saveUninitialized: true
}))

//app.use(express.methodOverride());
app.use(auth.middleware);

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

app.post('/uploadThumbnail', routes.uploadThumbnail);

app.get('/gallery', routes.gallery);

app.get('/records/:num', routes.getRecord);

app.get('/login', auth.login);

app.get('/callback', auth.callback);

app.post('/uploadModel', upload.uploadModel);

app.post('/uploadModelThumbnail', upload.uploadModelThumbnail);

app.get('/shape/:id', routes.shapeRebuild);

//this should always be in the bottom of this file
app.get('/:id', routes.shapeShow);