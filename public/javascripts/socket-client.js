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
    $('#sounds .controls').click(function(){
        // console.log($(this).parent("li").attr('data-id'));
        socket.emit('press', { "soundid":$(this).parent("li").attr('data-id'), "email":email });
    });    
  });
})();


