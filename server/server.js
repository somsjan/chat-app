const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const {generateMessage, generateLocationMessage} =require('./utils/message');
const {isRealString} = require ('./utils/validation');
const {Users} = require('./utils/users')

const publicPath = path.join(__dirname , '/../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('name and roomname are required');
        } else {
            socket.join(params.room);
            users.removeUser(socket.id);
            users.addUser(socket.id, params.name, params.room);
            console.log(`${params.name} has joined room: ${params.room}`)


            io.to(params.room).emit('updateUserList', users.getUserList(params.room));
            socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
            socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the channel`));

            callback();
        }
    });

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
        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room}`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
