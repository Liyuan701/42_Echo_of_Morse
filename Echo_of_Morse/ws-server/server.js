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

// const { Server } = require("socket.io");
// const express = require("express");
// const http = require("http");

// const app = express();
// const httpServer = http.createServer(app);

// const io = new Server(httpServer, {
//   path: "/socket.io/",
//   cors: { origin: "*" },
//   pingInterval: 25000,
//   pingTimeout: 20000,
// });


// // API calls
// async function setUserOnline(userId) {
//   try {
//     await fetch("http://web:3000/api/users/status", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId, isOnline: true }),
//     });
//   } catch (err) {
//     console.error("setUserOnline error:", err.message);
//   }
// }

// async function setUserOffline(userId) {
//   try {
//     await fetch("http://web:3000/api/users/status", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId, isOnline: false }),
//     });
//   } catch (err) {
//     console.error("setUserOffline error:", err.message);
//   }
// }

// // To complete the server.io heartbeat, in case of server crash.
// async function cleanupUsers() {
//   try {
//     await fetch("http://web:3000/api/users/cleanup", {
//       method: "POST",
//     });
//   } catch (err) {
//     console.error("cleanup error:", err.message);
//   }
// }

// // Socket handlers
// async function handleConnection(socket) {
//   // const userId = socket.handshake.auth.userId;
//   if (!socket.handshake.auth?.userId) {
//     socket.disconnect();
//     return;
//   }
//   if (userId) {
//     await setUserOnline(userId);
//   }

//   socket.on("send-morse", (data) => {
//     socket.broadcast.emit("receive-morse", data);
//   });

//   socket.on("disconnect", () => {
//     handleDisconnect(userId);
//   });
// }

// function 
// (userId) {
//   if (userId) {
//     setUserOffline(userId);
//   }
// }

//----------------------------------------------------------------

// Start logic
// io.on("connection", handleConnection);

// io.on("connection", (socket) => {
//   console.log("✅ CLIENT CONNECTED:", socket.id);

//   console.log("Current count:", io.engine.clientsCount);

//   io.emit("users-count", io.engine.clientsCount);

//   socket.on("disconnect", (reason) => {
//     console.log("❌ CLIENT DISCONNECTED", socket.id, reason);

//     io.emit("users-count", io.engine.clientsCount);
//   });
// });

const { Server } = require("socket.io");
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

const onlineUsers = new Map();

function emitUserCount() {
  io.emit("users-count", onlineUsers.size);
  io.emit("online-users", [...onlineUsers.keys()]);
  console.log(
  "Users:",
  onlineUsers.size,
  "Sockets (tabs):",
  io.engine.clientsCount
);
}


io.on("connection", async (socket) => {
  const userId = socket.handshake.auth.userId; 

  if (!userId) {
    console.log("❌ NO USER ID");
    socket.disconnect();
    return;
  }

  await fetch("http://web:3000/api/users/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      isOnline: true,
    }),
  });

  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }

  onlineUsers.get(userId).add(socket.id);

  console.log("✅ USER ONLINE:", userId);

  socket.emit("users-count", onlineUsers.size);
  socket.emit("online-users", [...onlineUsers.keys()]);

  emitUserCount();

  socket.on("get-users-count", () => {
    socket.emit("users-count", onlineUsers.size);
  });

  socket.on("disconnect", async (reason) => {

    const sockets = onlineUsers.get(userId);

    if (!sockets) return;

    sockets.delete(socket.id);

    if (sockets.size === 0) {
      onlineUsers.delete(userId);
      console.log("❌ USER OFFLINE:", userId);
    }


    await fetch("http://web:3000/api/users/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        isOnline: false,
      }),
    });

    emitUserCount();

    console.log(
      "❌ DISCONNECT",
      userId,
      socket.id,
      "reason:",
      reason
    );
  });
});



httpServer.listen(3001, () => {
  console.log("WS SERVER RUNNING ON 3001");
});


function shutdown() {
  console.log("✅ Shutting down...");

  io.close(() => {
    console.log("Socket.IO closed");

    httpServer.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });

  // emergency timeout
  setTimeout(() => {
    console.error("Force shutdown");
    process.exit(1);
  }, 5000);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function cleanupUsers() {
  try {
    await fetch("http://web:3000/api/users/cleanup", {
      method: "POST",
    });
  } catch (err) {
    console.error("cleanup error:", err.message);
  }
}

setInterval(cleanupUsers, 60000);


// podman exec -it transcendence_db_dev psql -U postgres -d transcendence
// \d "User"
// SELECT username, "isOnline", "lastSeen"
// FROM "User";
