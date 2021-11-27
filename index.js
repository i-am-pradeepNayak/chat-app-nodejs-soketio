const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname, "./public");

app.use(express.static(publicDirectory));

io.on("connection", (socket) => {
  console.log("new connection maded");

  //welome message
  socket.emit("sendMsg", "Welcome");
  socket.broadcast.emit("sendMsg", "A new user joined");

  //getting input type value
  socket.on("input", (data, cb) => {
    if (data === "1") {
      return cb("Numbers not allowed");
    }
   
    socket.emit("sendMsg", data); //sending msg to client
    cb("Delivers successfully");
  });

  //To get particular user location
  socket.on("location", (data, cb) => {
    io.emit(
      "shareLocation",
      `https://google.com/maps?q=${data.latitude},${data.longitude}`
    );
    cb("Data received successfully");
  });

  //particular user disconnted

  socket.on("disconnect", () => {
    io.emit("sendMsg", "A user has left");
  });
});

server.listen(3000, () => {
  console.log("Running on localhost 3000");
});
