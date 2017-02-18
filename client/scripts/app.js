// YOUR CODE HERE:
var app = {};

app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

app.init = function() {
  app.handleUsernameClick();
  app.handleSubmit();
  //app.fetch();
  //setInterval(app.fetch, 1000);
};

app.success = function() {
  console.log('success');
};

app.send = function(message) {
  $.ajax({
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    datatype: 'json',
    success: null,
    data: JSON.stringify(message)
  });
};


app.fetch = function() {
  $.ajax({
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    datatype: 'json',
    contentType: 'application/json',
    success: function(data) {
      // debugger;
      console.log('this worked!' + JSON.stringify(data.results));
    },
    failure: function(data) {
      console.log('this failed:' + data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(...message) {
  var text = '<div>' + message.text + '</div>';
  var username = '<a class="username" href="#">' + message.username + '</a>';
  $('#main').append(username);
  $('#chats').append(text);
};

app.renderRoom = function (roomName) {
  var room = '<div>' + roomName + '</div>';
  $('#roomSelect').append(room);
};

app.handleUsernameClick = function() {
  $('#main').on('click', '.username', function() {
    console.log('I\'ve been clicked!');
  });
};

app.handleSubmit = function () {
  $('#send .submit').on('click', '', function() {
    var message = {};
    message.username = (window.location.search).slice(10);
    message.text = $('input[name=messageForm]').val();
    app.send(message);
  });
};