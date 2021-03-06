//TODO
/*
FIX on submit taken back to lobby instead of staying in current room
Fix on fetch messages are duplicated into storage array
*/


let app = {};

app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = () => {
  app.fetch(); 
  app.handleUsernameClick();
  app.handleSubmit();
  app.changeRoom();
  app.createRoom();
  //setInterval(app.fetch, 2000);
};

app.processFetch = (data) => {
  // for (let message of data.results) {
  //   //adds each message to storage object with objectID as key after escaping all parts of the message.
  //   app.messageStorage[message.objectId] = app.escapeMessage(message);
  //   //add each roomname property to a roomList set to have a list of unique roomnames
  //   app.roomList.add(message.roomname);
  // }


//this causes duplicate messages to be added to storage
  for (var i = data.results.length - 1; i >= 0; i--) {
    let message = data.results[i];

    if (app.messageStorage.length !== 0 || app.messageStorage[app.messageStorage.length - 1].objectId !== message.objectId) { 
      continue;
    } else {
      for (; i >= 0; i--) {
        app.messageStorage.push(message);
      }
      // break;
    }

    app.roomList.add(data.results[i].roomname);
  }
  //remove all children from room dropdown menu
  $('#roomSelect').children().remove();

  //repopulate dropdown menu adding new rooms if there are any.
  for (let room of app.roomList) {
    app.renderRoom(room);
  }
  app.generateRoom();
};


app.messageStorage = [];
app.friendList = {};
app.roomList = new Set(['lobby']);

app.send = (message) => {
  $.ajax({
    url: app.server,
    type: 'POST',
    contentType: 'application/json',
    datatype: 'json',
    success: app.fetch,
    data: JSON.stringify(message)
  });
};

app.fetch = (cb = app.processFetch) => {
  $.ajax({
    url: app.server,
    data: {
      order: '-createdAt'
    },
    type: 'GET',
    contentType: 'application/json',
    success: cb,
    failure: function(data) {
      console.log('this failed:' + data);
    }
  });
};


app.clearMessages = () => {
  $('#chats').children().remove();
};

app.escapeMessage = (message) => {
  message.username = _.escape(message.username);
  message.roomname = _.escape(message.roomname);
  message.text = _.escape(message.text);
  return message;
};


app.renderMessage = (message) => {
  let text = '<div>' + message.text + '</div>';
  let username = '<a class="username" href="#">' + message.username + '</a>';
  let roomName = '<div>' + message.roomname + '</div>';
  if (app.friendList[message.username] !== undefined) {
    username = '<strong>' + username + '</strong>';
    text = '<strong>' + text + '</strong>';
  }
  let completeMessage = '<div>' + username + text + roomName + '</div>';
  $('#chats').prepend(completeMessage);
};


app.handleUsernameClick = () => {
  $('#chats').on('click', '.username', function(event) {
    event.preventDefault();
    let username = $(this).text();
    app.friendList[username] = username;
    app.generateRoom();
  });
};

app.handleSubmit = () => {
  $('#send form').submit(function(event) {
    //stops page from refreshing after clicking submit
    event.preventDefault();
    let $form = $('input[name=messageForm]');
    //if form has input, send message and reset form
    if ($form.val() !== '') {
      app.send({
        username: (window.location.search).slice(10),
        text: $form.val(),
        roomname: $(':selected').val()
      });
      $form.val('');
      //I have no idea why this is needed because send should call app.fetch upon completion
      //but messages don't show up without it.
      app.fetch();
    }
  });
};

app.changeRoom = () => {
  $('#roomSelect').on('change', app.generateRoom);
};

app.createRoom = () => {
  $('#createRoom form').submit(function(event) {
    event.preventDefault();
    let $form = $('input[name=createRoomForm]');
    if ($form.val() !== '') {
      let roomname = $form.val();
      // app.renderRoom(roomname);
      app.roomList.add(roomname);
      $form.val('');
      app.fetch((data) => {
        app.processFetch(data);
        $('#roomSelect').val(roomname);
        app.generateRoom();
      });
    }
  });
};

app.generateRoom = () => {
  app.clearMessages();
  for (let message of app.messageStorage) {
    if (message.roomname === $(':selected').val()) {
      app.renderMessage(message);
    }
  }
};

app.renderRoom = (roomName) => {
  let room = '<option>' + roomName + '</option>';
  $('#roomSelect').append(room);
};

$('document').ready(app.init);
