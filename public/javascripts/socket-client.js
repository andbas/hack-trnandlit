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
        $('div#time-track').timeTrack('send', data.email );

    });

    $('div#time-track').timeTrack();

    $('.button').each(function(){          
    var _this = $(this);
     $(this).prepend("<img src=\""+'http://www.gravatar.com/avatar/' + $.md5(_this.attr('data-id'))+'.jpg?size=100'+"\">"+"</img>");
    });
         
    //$(document).keydown(function(code) {
     //   console.log('Handler for .keydown() called.' + code);
    //});
    $('.controls').click(function(){
        socket.emit('press', { "soundid":"123", "email":email });
    });

    bitb.channel_max = bitb.channel_max || 15;
    bitb.audiochannels = bitb.audiochannels || [];

    var i;

    for (i = 0; i < bitb.channel_max; i++) {
      bitb.audiochannels[i] = {};
      bitb.audiochannels[i].track = new Audio();
      bitb.audiochannels[i].finished = -1;
    }


    var sounds = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016'];
    var body = $('body');
    sounds.forEach(function (sound) {
      body.append('<audio id="sound' + sound + '" src="sounds/' + sound + '.mp3" preload="auto"></audio>');
    });

    window.bitb.playSound = window.bitb.playSound || function (soundId) {
      var i
        , current_time = (new Date()).getTime();

      for (i = 0; i < bitb.channel_max; i++) {
        var channel = bitb.audiochannels[i];
        if (channel.finished < current_time) {
          channel.finished = current_time + document.getElementById(soundId).duration * 1000;
          channel.track.src = document.getElementById(soundId).src;
          channel.track.load();
          channel.track.play();
          break;
        }
      }
    }
  });
})();


