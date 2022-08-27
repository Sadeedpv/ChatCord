const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, removeuser, getusersinroom} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set the Front end static folder
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;

// Run when client connects
io.on('connection', socket => {

    // Join to chatRoom
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(room);
        // Welcome current user
        socket.emit('message', formatMessage('ChatCord Bot', 'Welcome to ChatCord!'));
        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage('ChatCord Bot', `${username} has joined the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getusersinroom(user.room)
        });
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = removeuser(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage('ChatCord Bot', `${user.username} has left the chat`));
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getusersinroom(user.room)
            });
        }
    })
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});