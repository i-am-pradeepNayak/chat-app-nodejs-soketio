const users = [];

//Add user
const addUser = ({ id, username, room }) => {
  //trim the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //validate the data
  if (!username && !room) {
    return {
      error: "Username and room required",
    };
  }

  //Check for existing user
  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  //validate user
  if (existingUser) {
    return {
      error: "Username already exist",
    };
  }

  //store user
  const user = { id, username, room };
  users.push(user);

  return {
    user
  };
};

//getuser
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

//to remove user
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//users in room
const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = { removeUser, getUsersInRoom, addUser ,getUser};
