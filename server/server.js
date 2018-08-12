const path = require('path');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/validation')
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users');
// console.log(__dirname + '/../public' );
// console.log(publicPath)

var app = express();
//o createServer recebe um callback de argumento
//esse callback eh compativel com a variavel app criada acima
//a partir do expressa, entao substituimos o trecho abaixo
//pelo que segue
// var server = http.createServer((req, res) => {
//});

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));
//configura a rota
io.on('connection', (socket) => {
  console.log('new user connected');

  socket.emit('newEmail', {
    from:'Giovani',
    city:'Brags'
  });

  // socket.emit('newMessage', {
  //   msg:_msg.msg,
  //   createdAt: new Date
  // });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)){
      return callback('name and room are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    //socket.leave

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined.`));  
    callback();
  });

  socket.on('createMessage', (_msg, _callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(_msg.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, _msg.text));
    }
    
    _callback();
    //BROADCAST EMITE PARA TODOS MENOS PARA O SOCKET CHAMADOR
    // socket.broadcast.emit('newMessage', {
    //   msg:_msg.msg,
    //   createdAt: new Date
    // });    
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', 
                            generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

  });

  socket.on('createEmail', (newEmail) => {
    console.log('createEmail: ', newEmail);
  });

  socket.on('disconnect', () => {
    console.log('client desconectado do servidor');
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Started on port ', port);
});

module.exports = {app};