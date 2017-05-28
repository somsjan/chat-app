var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('newMessage', function (message){
    console.log('New message received: ', message);
    var formattedTime = moment(message.createdAt).format('HH:mm');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
            from: message.from,
            text: message.text,
            createdAt: formattedTime
        });
    jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function (message){
    console.log('New location received: ', message);
    var formattedTime = moment(message.createdAt).format('HH:mm');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
            from: message.from,
            url: message.url,
            createdAt: formattedTime
        });
    jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: "User",
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function (e){
    console.log('send-location');

    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    } else {
        locationButton.attr('disabled', 'disabled').text('Sending location...');

        navigator.geolocation.getCurrentPosition(function (position) {
            locationButton.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function () {
            locationButton.removeAttr('disabled').text('Send location');
            alert('Unable to fetch location');
      });
    }
});
