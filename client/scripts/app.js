
var app = {};

app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  app.fetch(); 
  app.handleUsernameClick();
  app.handleSubmit();
  app.changeRoom();
  app.createRoom();
  //setInterval(app.fetch, 2000);
};

app.appendFetchtoStorage = function(data) {
  for (let message of data.results) {
    //adds each message to storage object with objectID as key after escaping all parts of the message.

    app.messageStorage[message.objectId] = app.escapeMessage(message);
    //add each roomname property to a roomList set to have a list of unique roomnames
    app.roomList.add(message.roomname);
  }
  //remove all children from room dropdown menu
  $('#roomSelect').children().remove();

  //repopulate dropdown menu adding new rooms if there are any.
  for (let room of app.roomList) {
    app.renderRoom(room);
  }
  debugger;
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

app.fetch = () => {
  $.ajax({
    url: app.server,
    data: {
      order: '-createdAt'
    },
    type: 'GET',
    contentType: 'application/json',
    success: app.appendFetchtoStorage,
    failure: function(data) {
      console.log('this failed:' + data);
    }
  });
};


app.clearMessages = function() {
  $('#chats').children().remove();
};

app.escapeMessage = (message) => {
  message.username = _.escape(message.username);
  message.roomname = _.escape(message.roomname);
  message.text = _.escape(message.text);
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
