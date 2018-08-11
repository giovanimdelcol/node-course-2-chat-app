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
  var formattedtime = moment(msg.createdAt).format('h:mm a');
  console.log('got new message:', msg);
  var li = jQuery('<li></li>');
  li.text(`${msg.from} ${formattedtime}: ${msg.text}`);
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

socket.on('newLocationMessage', function(message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');
  var formattedtime = moment(message.createdAt).format('h:mm a');

  li.text(`${message.from}: ${formattedtime}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

var messageTextBox = $('[name=message]');

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();//impede o default do botao de recarrregar a pagina

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('')
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location');
        
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fecth location.');
    });
});
