const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const PORT = process.env.PORT || 10000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

const users = new Map();

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("join", (username) => {
    users.set(socket.id, username);
    io.emit("users", Array.from(users.values()));
  });

  socket.on("message", (data) => {
    if (typeof data.message === "string" && data.message.trim() !== "") {
      io.emit("message", { user: users.get(socket.id), message: data.message });
    }
  });

  socket.on("delete", (msgId) => {
    io.emit("delete", msgId);
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    io.emit("users", Array.from(users.values()));
  });
});

server.listen(10000, () => {
  console.log("Server is running on port 10000");
});
