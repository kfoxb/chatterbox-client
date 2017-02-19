
var app = {};

app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  app.fetch((data) => {
    app.appendFetchtoStorage(data);
    app.initialize();
  }); 
  app.handleUsernameClick();
  app.handleSubmit();
  app.changeRoom();
  app.createRoom();
  //setInterval(app.fetch, 2000);
};

app.initialize = () => {
  //move this functionality into appendFetchtoStorage
  for (let message in app.messageStorage) {
    app.roomList.add(app.messageStorage[message].roomname);
  }
  //delete all menu children before this loop runs
  for (let room of app.roomList) {
    app.renderRoom(room);
  }

  app.generateRoom();
};

app.messageStorage = {};
app.friendList = {};
app.roomList = new Set();

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    contentType: 'application/json',
    datatype: 'json',
    success: null,
    data: JSON.stringify(message)
  });
};

app.fetch = (cb = appendFetchtoStorage) => {
  $.ajax({
    url: app.server,
    data: {
      order: '-createdAt'
    },
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json',
    success: cb,
    failure: function(data) {
      console.log('this failed:' + data);
    }
  });
};

app.appendFetchtoStorage = function(data) {
  for (var i = 0; i < data.results.length; i++) {
    app.messageStorage[data.results[i].objectId] = app.escapeMessage(data.results[i]);
  }
},

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
  var text = '<div>' + message.text + '</div>';
  var username = '<a class="username" href="#">' + message.username + '</a>';
  var roomName = '<div>' + message.roomname + '</div>';
  if (app.friendList[message.username] !== undefined) {
    username = '<strong>' + username + '</strong>';
    text = '<strong>' + text + '</strong>';
  }
  var completeMessage = '<div>' + username + text + roomName + '</div>';
  $('#chats')[appendOrPrepend](completeMessage);
};


app.handleUsernameClick = function() {
  $('#chats').on('click', '.username', function() {
    var username = $(this).text();
    app.friendList[username] = username;
    app.generateRoom();
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
    app.renderMessage(message, 'prepend');
  });
};

app.changeRoom = function() {
  $('#roomSelect').on('change', app.generateRoom);
};

app.createRoom = function() {
  $('#createRoom form').submit(function(event) {
    event.preventDefault();
    let roomname = $('input[name=createRoomForm]').val();
    app.renderRoom(roomname);
    $('input[name=createRoomForm]').val('');
    $('#roomSelect').val(roomname);
    app.generateRoom();
  });
};

app.generateRoom = () => {
  app.clearMessages();
  for (var key in app.messageStorage) {
    if (app.messageStorage[key].roomname === $(':selected').val()) {
      app.renderMessage(app.messageStorage[key]);
    }
  }
};

app.renderRoom = function(roomName) {
  var room = '<option>' + roomName + '</option>';
  $('#roomSelect').append(room);
};

// app.refresh = function() {
//   // app.fetch();
//   //clears all chats off screen
//   $('#chats').children().remove();
//   var initializeRooms = function(storage) {
//     var roomList = {};
//     for (var key in storage) {
//       var roomName = storage[key].roomname;
//       roomList[roomName] = roomName;
//     }

//     for (key in roomList) {
//       app.renderRoom(roomList[key]);
//     }
//   };
  
//   var initializeMessages = function(storage) {
//     for (key in storage) {
//       app.renderMessage(storage[key]);
//     }
//   };

//   initializeRooms(app.messageStorage);
//   initializeMessages(app.messageStorage);
// };

// handler for our drop down menu to hide other rooms

// app.resetToCorrectRoom = function() {
//   $('#chats').children().remove();
//   for (var key in app.messageStorage) {
//     if (app.messageStorage[key].roomname === $(':selected').val()) {
//       app.renderMessage(app.messageStorage[key]);
//     }
//   }
// };


$('document').ready(app.init);
