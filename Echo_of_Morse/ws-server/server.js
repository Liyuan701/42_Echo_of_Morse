// import { Server } from "socket.io";

// const io = new Server(3001, { cors: { origin: "*" }});

// io.on("connection", (socket) => {

//   console.log("User connected");
//   socket.on("send-morse", (data: string) => { socket.broadcast.emit("receive-morse", data); });
//   socket.on("disconnect", () => { console.log("User disconnected"); });

// });


//-------------------------------------------------------------------------------------

// const { Server } = require("socket.io");

// const io = new Server(3001, {
//   cors: { origin: "*" }
// });

// io.on("connection", (socket) => {
//   console.log("User connected");

//   socket.on("send-morse", (data) => {
//     socket.broadcast.emit("receive-morse", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });


//----------------------------------------------------------------------

const { Server } = require("socket.io");

// Init server

// const io = new Server(3001, {
//   cors: { origin: "*" },
//   pingInterval: 25000,
//   pingTimeout: 20000,
// });

const express = require("express");
const http = require("http");

const app = express();
const httpServer = http.createServer(app);


const io = new Server(httpServer, {
  path: "/socket.io/",
  cors: { origin: "*" },
  pingInterval: 25000,
  pingTimeout: 20000,
});


// API calls
async function setUserOnline(userId) {
  try {
    await fetch("http://web:3000/api/users/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, isOnline: true }),
    });
  } catch (err) {
    console.error("setUserOnline error:", err.message);
  }
}

async function setUserOffline(userId) {
  try {
    await fetch("http://web:3000/api/users/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, isOnline: false }),
    });
  } catch (err) {
    console.error("setUserOffline error:", err.message);
  }
}


// To complete the server.io heartbeat, in case of server crash.
async function cleanupUsers() {
  try {
    await fetch("http://web:3000/api/users/cleanup", {
      method: "POST",
    });
  } catch (err) {
    console.error("cleanup error:", err.message);
  }
}

// Socket handlers
async function handleConnection(socket) {
  const userId = socket.handshake.auth.userId;
  if (userId) {
    await setUserOnline(userId);
  }

  socket.on("send-morse", (data) => {
    socket.broadcast.emit("receive-morse", data);
  });

  socket.on("disconnect", () => {
    handleDisconnect(userId);
  });
}

function handleDisconnect(userId) {
  if (userId) {
    setUserOffline(userId);
  }
}

// Start logic
// io.on("connection", handleConnection);

io.on("connection", (socket) => {
  console.log("✅ CLIENT CONNECTED:", socket.id);

  console.log("Current count:", io.engine.clientsCount);

  io.emit("users-count", io.engine.clientsCount);

  socket.on("disconnect", (reason) => {
    console.log("❌ CLIENT DISCONNECTED", socket.id, reason);

    io.emit("users-count", io.engine.clientsCount);
  });
});

httpServer.listen(3001, () => {
  console.log("WS SERVER RUNNING ON 3001");
});

setInterval(cleanupUsers, 60000);
