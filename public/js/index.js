const chatForm = document.getElementById('chat-form');
const chat = document.querySelector('.chat-messages');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true    
})

console.log(username, room);

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    chat.scrollTop = chat.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get message text
    const message = e.target.elements.msg.value;
    // Emit message to server
    socket.emit('chatMessage', message);
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName = document.getElementById('room-name');
    roomName.innerText = room;
}

function outputUsers(users) {
    userList = document.getElementById('users');
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}