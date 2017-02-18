// YOUR CODE HERE:
var app = {};
app.init = function() {
  app.handleUsernameClick();
  app.handleSubmit();
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
    url: undefined,
    type: 'GET',
    datatype: 'json',
    success: null,
    data: JSON.stringify(message)
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message) {
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