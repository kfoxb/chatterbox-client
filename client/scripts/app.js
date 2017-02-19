
var app = {};

app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  app.fetch(); 
  app.handleUsernameClick();
  app.handleSubmit();
  app.filterRooms();
  app.createRoom();
  setInterval(app.resetToCorrectRoom, 2000);
};

app.messageStorage = {};
app.friendList = {};

app.success = function() {
  console.log('success');
};

app.send = function(message) {
  $.ajax({
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/',
    type: 'POST',
    contentType: 'application/json',
    datatype: 'json',
    success: null,
    data: JSON.stringify(message)
  });
};

var firstTimeRun = true;

app.fetch = function(cb) {
  $.ajax({
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    data: {
      order: '-createdAt'
    },
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json',
    success: function(data) {
      for (var i = 0; i < data.results.length; i++) {
        app.messageStorage[data.results[i].objectId] = app.escapeMessage(data.results[i]);
      }
      if (firstTimeRun) {
        app.refresh();
        firstTimeRun = false;  
      }
    },
    failure: function(data) {
      console.log('this failed:' + data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.escapeMessage = function(message) {
  //debugger;
  var escapeCharacters = ['"', '&', '<', '>'];
  for (var key in message) {
    //this filters out people that use null as a username, roomname, or message
    if (message[key] !== null) {
      var string = message[key].split('');
      for (var i = 0; i < string.length; i++) {
        if (string[i] === escapeCharacters[0]) {
          string.splice(i, 1, '&quot;');
        } else if (string[i] === escapeCharacters[1]) {
          string.splice(i, 1, '&amp;');
        } else if (string[i] === escapeCharacters[2]) {
          string.splice(i, 1, '&lt;');
        } else if (string[i] === escapeCharacters[3]) {
          string.splice(i, 1, '&gt;');
        }
      }
    }
    message[key] = string.join('');
  }
  return message;
};

app.renderMessage = function(message, appendOrPrepend = 'append') {
  // debugger;
  message = app.escapeMessage(message);
  var text = '<div>' + message.text + '</div>';
  var username = '<a class="username" href="#">' + message.username + '</a>';
  var roomName = '<div>' + message.roomname + '</div>';
  if (app.friendList[message.username] !== undefined) {
    username = '<strong>' + username + '</strong>';
    text = '<strong>' + text + '</strong>';
  }
  var completeMessage = '<div>' + username + text + roomName + '</div>';
  //$('#main').append(username);
  $('#chats')[appendOrPrepend](completeMessage);
};

app.renderRoom = function (roomName) {
  var room = '<option>' + roomName + '</option>';
  $('#roomSelect').append(room);
};

app.handleUsernameClick = function() {
  $('#chats').on('click', '.username', function() {
    var username = $(this).text();
    app.friendList[username] = username;
    app.resetToCorrectRoom();
  });
};

app.handleSubmit = function() {
  $('#send form').submit(function(event) {
    event.preventDefault();
    var message = {};
    message.username = (window.location.search).slice(10);
    message.text = $('input[name=messageForm]').val();
    message.roomname = $(':selected').val();
    app.send(message);
    $('input[name=messageForm]').val('');
    // app.resetToCorrectRoom();
    app.renderMessage(message, 'prepend');
  });
};

app.refresh = function() {
  // app.fetch();
  //clears all chats off screen
  $('#chats').children().remove();
  var initializeRooms = function(storage) {
    var roomList = {};
    for (var key in storage) {
      var roomName = storage[key].roomname;
      roomList[roomName] = roomName;
    }

    for (key in roomList) {
      app.renderRoom(roomList[key]);
    }
  };
  
  var initializeMessages = function(storage) {
    for (key in storage) {
      app.renderMessage(storage[key]);
    }
  };

  initializeRooms(app.messageStorage);
  initializeMessages(app.messageStorage);
};

// handler for our drop down menu to hide other rooms
app.filterRooms = function () {
  $('#roomSelect').on('change', app.resetToCorrectRoom);
};

app.resetToCorrectRoom = function() {
  $('#chats').children().remove();
  for (var key in app.messageStorage) {
    if (app.messageStorage[key].roomname === $(':selected').val()) {
      app.renderMessage(app.messageStorage[key]);
    }
  }
};

app.createRoom = function() {
  $('#createRoom form').submit(function(event) {
    event.preventDefault();
    var message = {};
    message.roomname = $('input[name=createRoomForm]').val();
    app.messageStorage[message.roomname] = message.roomname;
    $('input[name=createRoomForm]').val('');
    app.renderRoom(message.roomname);
    $('#roomSelect').val(message.roomname);
    app.resetToCorrectRoom();
  });
};

$('document').ready(app.init);
