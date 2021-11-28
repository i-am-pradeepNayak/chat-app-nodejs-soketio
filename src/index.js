const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./time");
const { removeUser, getUsersInRoom, addUser, getUser } = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  //room connection
  socket.on("join", ({ username, room }, cb) => {
    const { user, error } = addUser({ id: socket.id, username, room });
    console.log(error);
    if (error) {
      return cb(error);
    }

    socket.join(user.room);
    socket.emit("message", generateMessage(` joined the chat`,user.username));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username}  has joined!`,user.username));
    cb();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }
    const user = getUser(socket.id);

    io.to(user.room).emit("message", generateMessage(message,user.username));
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,user.username
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left!`,user.username)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
