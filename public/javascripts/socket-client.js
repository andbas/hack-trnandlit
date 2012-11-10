(function () {
  window.bitb = {};

  window.addEventListener('load', function (document) {
    var socket = io.connect('/')
      , email = $('#email').val();

    socket.emit('login',{"email":email});

    socket.on('users online',function(data){
        bitb.users = data;

        $.each(bitb.users, function(){
            $('div#time-track').timeTrack('add', this );
        });
    });

    socket.on('user connected',function(data){
        bitb.users[data.socketId] = data.email;

        $('div#time-track').timeTrack('add', data.email );


    });

    socket.on('user disconnected',function(data){
        $('div#time-track').timeTrack('remove', bitb.users[data.socketId] );
        delete bitb.users[data.socketId];
    });

    socket.on('press',function(data){
      console.log('Pressed data: ' + data);
    });
  });
})();


