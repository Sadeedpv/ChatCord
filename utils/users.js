const users = [];
// Adduser, removeuser, getuser, getusersinroom

function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function removeuser(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getusersinroom(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    removeuser,
    getusersinroom
}