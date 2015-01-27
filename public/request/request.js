function saveToDb() {
  if (document.getElementById('thumbnail') !== null) {
    document.getElementById('container').removeChild(document.getElementById('thumbnail'));
  }
  $.ajax({
    url: '/uploadThumbnail',
    method: 'POST',
    data: {
      'data': writeData(),
      'imgURL': makeThumbnail()
    },
    dataType: 'json',
    error: function (err) {
      console.error(err);
    },
    success: function (data) {
      console.log(data);
    }
  })
}

function askForRebuildShape(id) {
  $.ajax({
    url: '/shape/' + id,
    method: 'GET',
    dataType: 'json',
    error: function (err) {
      console.error(err);
    },
    success: function (data) {
      console.log(data[0].data);
      setTimeout(function () {
        readData(JSON.parse(data[0].data));
      }, 1000);
    }
  })
}

function sendToSW() {
  $.ajax({
    //url: 'http://api.shapeways.com/models/v1/' + data,
    url: '/uploadModel',
    method: 'POST',
    data: {
      'str': outputString()
    },
    dataType: 'json',
    error: function (err) {
      console.error(err);
    },
    success: function (data) {
      console.log(data);
    }
  })
}

$(document).ready(function () {
  var id = document.location.pathname.slice(1);
  if (id.length) {
    askForRebuildShape(id);
  }
});