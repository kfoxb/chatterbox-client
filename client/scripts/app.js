// YOUR CODE HERE:
var app = {};
app.init = function() {
  return true;
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

app.renderMessage = function() {

};