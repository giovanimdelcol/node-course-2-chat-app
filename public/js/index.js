var socket = io();//funcao disponibilizada pela url acima
    //que existe devido ao servidor carregar var io = socketIO(server);
    //esse metodo inicia a conexao socket e retorna uma instancia de conexao
socket.on('connect', function ()  {
    console.log('conectado ao servidor');

    socket.emit('createEmail', {
        to: 'jane@example.com',
        text:'this is sparta!'
    });

    socket.emit('createMessage', {
        msg:'Mensagem de texto'
    });
}); 

socket.on('disconnect', function () {
    console.log('desconectado');
});

socket.on('newMessage', function (msg) {
  console.log('got new message:', msg);
});

socket.on('newEmail', function (email) {
    console.log('New Email', email);
});
