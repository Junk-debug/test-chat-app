const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./route");
const { addUser, findUser, getRoomUsers, removeUser } = require("./users");

const app = express();
app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ username, roomId }) => {
    socket.join(roomId);

    const { isExist } = addUser({ name: username, roomId });

    const userMessage = isExist
      ? `Welcome back ${username} to room ${roomId}`
      : `Welcome ${username} to room ${roomId}`;

    console.log("joined", username, roomId);

    socket.emit("message", {
      data: {
        user: { name: "Admin" },
        message: userMessage,
      },
    });

    socket.broadcast.to(roomId).emit("message", {
      data: {
        user: { name: "Admin" },
        message: `${username} has joined the room ${roomId}`,
      },
    });

    io.to(roomId).emit("roomInfo", {
      data: {
        roomId,
        users: getRoomUsers(roomId),
      },
    });
  });

  socket.on("sendMessage", ({ message, params }) => {
    const user = findUser(params);

    if (user) {
      io.to(user.roomId).emit("message", {
        data: { user, message },
      });
    }
  });

  socket.on("disconnecting", (reason) => {
    console.log("disconnecting", reason);
    console.log(socket.id);
  });

  // socket.on("disconnect", ({ params }) => {
  //   console.log("leave", params);
  //   const user = removeUser(params);

  //   if (!user) {
  //     return;
  //   }

  //   const { name, roomId } = user;

  //   io.to(roomId).emit("message", {
  //     data: {
  //       user: { name: "Admin" },
  //       message: `${name} has left the room ${roomId}`,
  //     },
  //   });

  //   io.to(roomId).emit("roomInfo", {
  //     data: {
  //       roomId,
  //       users: getRoomUsers(roomId),
  //     },
  //   });
  // });

  console.log("connected");

  io.on("disconnect", () => {
    console.log("disconnected");
  });
});

const port = 5500;
server.listen(port, () => {
  console.log(`Listening on port ${port} \nhttp://localhost:${port}`);
});
