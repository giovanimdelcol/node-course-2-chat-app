var socket = io();//funcao disponibilizada pela url acima
    //que existe devido ao servidor carregar var io = socketIO(server);
    //esse metodo inicia a conexao socket e retorna uma instancia de conexao
socket.on('connect', function ()  {
    console.log('conectado ao servidor');

    socket.emit('createEmail', {
        to: 'jane@example.com',
        text:'this is sparta!'
    });

    // socket.emit('createMessage', {
    //     msg:'Mensagem de texto'
    // });
}); 

socket.on('disconnect', function () {
    console.log('desconectado');
});

socket.on('newMessage', function (msg) {
  console.log('got new message:', msg);
  var li = jQuery('<li></li>');
  li.text(`${msg.from}: ${msg.text}`);
  jQuery('#messages').append(li);
});

socket.on('newEmail', function (email) {
    console.log('New Email', email);
});

// socket.emit('createMessage',{
//     from: 'Frank',
//     text:'Hi'
// }, function(data) {
//     console.log('Got it > ', data);
// });

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();//impede o default do botao de recarrregar a pagina

    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    }, function () {

    });
});
