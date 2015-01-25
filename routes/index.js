var mongoose = require('mongoose');
var Record = require('../model/model.js');

// var jsonParser = bodyParser.json();

exports.index = function (req, res) {
  // if (!isLoggedIn(req.session)) {
  //   return res.redirect('/login');
  // } else {
  //   return res.redirect('/turbine');
  // }
  res.render('index.html');
}

exports.gallery = function (req, res) {
  res.render('gallery.html');
}

exports.uploadThumbnail = function (req, res) {

  //console.log(req.body.data, req.body.imgURL);

  if (!req.body.data) {
    return res.send('need data');
  }
  if (!req.body.imgURL) {
    return res.send('need imgURL');
  }

  var record = new Record();
  record.data = req.body.data;
  record.imgURL = req.body.imgURL;
  record.save();
  //res.send('saved');
}

exports.shapeShow = function (req, res) {
  res.render('index.html');
}

exports.shapeRebuild = function (req, res) {
  var query = {
    '_id': req.params.id
  };
  var select = 'data';
  var option = {
    limit: 1
  };
  Record.find(query, select, option, function (err, data) {
    if (err) return console.error(err);
    res.send(data);
  });
}