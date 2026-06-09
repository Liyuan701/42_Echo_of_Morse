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
 
// DB sync helpers
async function setUserOnline(userId) {
  try {
    await fetch("http://web:3000/api/users/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isOnline: false }),
    });
  } catch (err) {
    console.error("setUserOffline error:", err.message);
  }
}


 
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
  console.log("🔌 socket connected");
    const userId = socket.handshake.auth.userId;
 
   console.log("setting online:", userId); //! debug

  if (!userId) {
    console.log("❌ NO USER ID");
    socket.disconnect();
    return;
  }
 
  const isFirstTab = !onlineUsers.has(userId);
 
  if (isFirstTab) {
    onlineUsers.set(userId, new Set());
    await setUserOnline(userId); // sync DB: user comes online
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
    console.log(
      "❌ DISCONNECT",
      userId,
      socket.id,
      "reason:",
      reason
    );
 
    const sockets = onlineUsers.get(userId);
 
    if (!sockets) return;
 
    sockets.delete(socket.id);
 
    if (sockets.size === 0) {
      onlineUsers.delete(userId);
      console.log("❌ USER OFFLINE:", userId);
      await setUserOffline(userId); // sync DB: user goes offline
    }
 
    emitUserCount();
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