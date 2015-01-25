var mongoose = require('mongoose');

var recordSchema = mongoose.Schema({
  'data': {
    type: String
  },
  'imgURL': {
    type: String
  }
});

module.exports = mongoose.model('Record', recordSchema);