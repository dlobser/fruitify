function saveToDb() {
  if (document.getElementById('thumbnail') !== null) {
    document.getElementById('container').removeChild(document.getElementById('thumbnail'));
  }
  $.ajax({
    url: '/upload',
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
    url: '/' + id + '/shape',
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
    url: '/login',
    method: 'GET',
    // dataType: 'json',
    // data: {
    //   'test': 2353
    // }
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