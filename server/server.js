const path = require('path');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
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
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));  
  socket.on('createMessage', (_msg, _callback) => {
 
    io.emit('newMessage', generateMessage(_msg.from, _msg.text));
    _callback('This is event Acknowledgment from the server');
    //BROADCAST EMITE PARA TODOS MENOS PARA O SOCKET CHAMADOR
    // socket.broadcast.emit('newMessage', {
    //   msg:_msg.msg,
    //   createdAt: new Date
    // });    
  });

  socket.on('createEmail', (newEmail) => {
    console.log('createEmail: ', newEmail);
  });

  socket.on('disconnect', () => {
    console.log('client desconectado do servidor');
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Started on port ', port);
});

module.exports = {app};