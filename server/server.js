const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const {generateMessage, generateLocationMessage} =require('./utils/message');
const publicPath = path.join(__dirname , '/../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined the channel'));

    socket.on('createMessage', (message, callback) =>{
        console.log(message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords) =>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
        // console.log(coords.createdAt);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
