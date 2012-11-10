
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , bitb = require('./routes/bitb')
  , http = require('http')
  , path = require('path')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , users = {};

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/bitb', bitb.index);


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {

  socket.on('login', function(data){
    var email = data.email;
    users[socket.id] = email;
    socket.broadcast.emit('user connected', {"email":data.email,"socketId":socket.id});
    socket.emit('users online', users);
  });

  socket.on('disconnect', function () {
    delete users[socket.id];
    socket.broadcast.emit('user disconnected', {"socketId":socket.id});
  });

  socket.on('press',function(data){
    socket.broadcast.emit('press', {"pressed":data});
  });
});