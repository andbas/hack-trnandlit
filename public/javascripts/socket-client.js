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
            $('#participants').append("<li class=\"button\" data-id=\""+$.md5(this)+"\">"
                +"<img src=\""+'http://www.gravatar.com/avatar/' + $.md5(this)+'.jpg?size=100'+"\">"+"</img>"
                +"<h4>"+this+"</h4>"
                +"</li>"
            );
        });
    });

    socket.on('user connected',function(data){
        bitb.users[data.socketId] = data.email;

        $('div#time-track').timeTrack('add', data.email );
        $('#participants').append("<li class=\"button\" data-id=\""+$.md5(data.email)+"\">"
            +"<img src=\""+'http://www.gravatar.com/avatar/' + $.md5(data.email)+'.jpg?size=100'+"\">"+"</img>"
            +"<h4>"+data.email+"</h4>"
            +"</li>"
        );
    });

    socket.on('user disconnected',function(data){
        $('div#time-track').timeTrack('remove', bitb.users[data.socketId] );
        $('[data-id='+$.md5(data.email)+']').remove();
        delete bitb.users[data.socketId];        
    });

    socket.on('press',function(data){
        $('div#time-track').timeTrack('send', data.email );
        bitb.playSound(data.soundid);
    });

    $('div#time-track').timeTrack();

    $('.button').each(function(){          
    var _this = $(this);
     $(this).prepend("<img src=\""+'http://www.gravatar.com/avatar/' + $.md5(_this.attr('data-id'))+'.jpg?size=100'+"\">"+"</img>");
    });

    var keymaps = 'qwertyuiasdfghjk'.split('');

    $('#sounds .controls').each(function(){
      var key = keymaps.shift();
      $(this).attr('data-key-map', key).after( $('<span>').text(key) );
    });

    $(window).keypress(function(event){

      var btn =  $('#sounds .controls[data-key-map=' + String.fromCharCode(event.charCode).toLowerCase() + ']');
      btn.addClass('active'); setTimeout(function () {btn.removeClass('active') }, 300 );
      btn.click();

    });

    $('#sounds .controls').click(function(){
        // console.log($(this).parent("li").attr('data-id'));
        socket.emit('press', { "soundid":$(this).parent("li").attr('data-id'), "email":email });
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
          var element = window.document.getElementById('sound'+soundId);
          channel.finished = current_time + element.duration * 1000;
          channel.track.src = element.src;
          channel.track.load();
          channel.track.play();
          break;
        }
      }
    }
  });
})();
