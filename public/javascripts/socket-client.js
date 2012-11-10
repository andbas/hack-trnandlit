(function () {
  window.bitb = {};

  window.addEventListener('load', function (document) {
    var socket = io.connect('/')
      , email = $('#email').val();

    socket.emit('login',{"email":email});

    socket.on('users online',function(data){
      bitb.users = data;
    });

    socket.on('user connected',function(data){
      bitb.users[data.socketId] = data.email;
    });

    socket.on('user disconnected',function(data){
      delete bitb.users[data.socketId];
    });

    socket.on('press',function(data){
      console.log('Pressed data: ' + data);
    });
  });
})();


