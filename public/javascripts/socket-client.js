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
    
    $('.button').each(function(){          
    var _this = $(this);
     $(this).prepend("<img src=\""+'http://www.gravatar.com/avatar/' + $.md5(_this.attr('data-id'))+'.jpg?size=100'+"\">"+"</img>");
    });
         
    //$(document).keydown(function(code) {
     //   console.log('Handler for .keydown() called.' + code);
    //});
    $('.controls').click(function(){
        socket.emit('press', {soundid:'123'});
    });    
  });
})();


