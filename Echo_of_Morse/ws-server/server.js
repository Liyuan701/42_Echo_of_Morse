// TODO Marc & Gustav:
// Real-time chat and game invitations still do not reach the second browser,
// although refreshing shows the persisted database data. Please debug this
// Socket.IO delivery path:

// 1. Confirm both users reach this connection handler and userId is the correct
//    NextAuth user ID, not undefined or the ID of a previously logged-in account.
// 2. Confirm each socket joins `user:<userId>` and that the recipient room has
//    at least one socket before io.to(room).emit(...) is called.
// 3. Confirm the server receives "chat:message:send" and emits
//    "chat:message:new" to the intended recipient.
// 4. Confirm the server receives "game-invitation:send" and emits
//    "game-invitation:new" to the intended recipient.
// 5. Check the dev URL: docker-compose.dev.yml exposes http://localhost:3001,
//    while the WAF URL https://localhost:8443 belongs to the production setup.
// 6. Add temporary logs for socket.id, userId, room membership, event payloads,
//    and recipient room size to locate where delivery stops.

// REST/Prisma must remain authoritative. Socket events should notify clients
// only after the corresponding database write succeeds.




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


// const io = new Server(httpServer, {
//   path: "/socket.io/",
//   cors: {
//     origin: ["https://echoesofmorse"],
//     credentials: true,
//   },
//   transports: ["websocket", "polling"],
//   pingInterval: 25000,
//   pingTimeout: 20000,
// });


function ackSuccess(ack, deliveredTo = 0) {
  if (typeof ack === "function") {
    ack({
      ok: true,
      deliveredTo,
    });
  }
}

function ackError(ack, code, message) {
  if (typeof ack === "function") {
    ack({
      ok: false,
      code,
      message,
    });
  }
}


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

  console.log(
    [...onlineUsers.entries()].map(([user, sockets]) => ({
      user,
      count: sockets.size,
      sockets: [...sockets],
    }))
  );
}

io.on("connection", async (socket) => {
  const userId = socket.handshake.auth.userId;

  if (!userId) {
    console.log("❌ NO USER ID");
    socket.disconnect();
    return;
  }

  console.log(
    "CONNECT",
    {
      socketId: socket.id,
      userId,
      auth: socket.handshake.auth,
    }
  );

  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }

  onlineUsers.get(userId).add(socket.id);

  try {
    const res = await fetch("http://web:3000/api/users/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        isOnline: true,
      }),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("database update for connection failed", err);
  }

  const room = `user:${userId}`;
  socket.join(room);
  console.log(
    "JOIN ROOM",
    room,
    "members:",
    io.sockets.adapter.rooms.get(room)?.size || 0
  );

  console.log("✅ USER ONLINE:", userId);

  socket.emit("users-count", onlineUsers.size);
  socket.emit("online-users", [...onlineUsers.keys()]);

  emitUserCount();

  socket.on("get-users-count", () => {
    socket.emit("users-count", onlineUsers.size);
  });



  // socket.on("chat:message:send", (payload) => {
  //   if (
  //     !payload ||
  //     payload.senderId !== userId ||
  //     typeof payload.toUserId !== "string" ||
  //     typeof payload.message?.id !== "string"
  //   ) {
  //     return;
  //   }

  //   console.log(
  //     "CHAT SEND",
  //     {
  //       from: userId,
  //       to: payload?.toUserId,
  //       socketId: socket.id,
  //       messageId: payload?.message?.id,
  //     }
  //   );

  //   const room = `user:${payload.toUserId}`;
  //   const roomObj = io.sockets.adapter.rooms.get(room);
  //   if (!roomObj || roomObj.size === 0) {
  //     console.log("❌ ROOM EMPTY", room);
  //   }
  //   console.log(
  //     "CHAT TARGET",
  //     room,
  //     "members:",
  //     io.sockets.adapter.rooms.get(room)?.size || 0
  //   );

  //   io.to(room).emit("chat:message:new", {
  //     ...payload.message,
  //     senderId: userId,
  //   });
  // });


socket.on("chat:message:send", (payload, ack) => {
  if (
    !payload ||
    typeof payload.toUserId !== "string" ||
    typeof payload.message?.id !== "string"
  ) {
    return ack?.({
      ok: false,
      code: "INVALID_PAYLOAD",
      message: "Invalid chat message payload",
    });
  }

  const room = `user:${payload.toUserId}`;
  const deliveredTo = io.sockets.adapter.rooms.get(room)?.size || 0;

  console.log("CHAT SEND", {
    from: userId,
    to: payload.toUserId,
    socketId: socket.id,
    messageId: payload.message.id,
    deliveredTo,
  });

  if (deliveredTo === 0) {
    console.log("❌ ROOM EMPTY", room);
  }

  try {
    io.to(room).emit("chat:message:new", {
      ...payload.message,
      senderId: userId, 
    });

    return ack?.({
      ok: true,
      deliveredTo,
      delivered: deliveredTo > 0,
    });

  } catch (err) {
    console.error(err);

    return ack?.({
      ok: false,
      code: "INTERNAL_ERROR",
      message: "Failed to emit message",
    });
  }
});

  // socket.on("game-invitation:send", (payload) => {
  //   if (
  //     !payload ||
  //     typeof payload.toUserId !== "string" ||
  //     typeof payload.invitationId !== "string"
  //   ) {
  //     return;
  //   }

  //   console.log(
  //     "INVITE SEND",
  //     {
  //       from: userId,
  //       to: payload?.toUserId,
  //       invitationId: payload?.invitationId,
  //     }
  //   );

  //   const room = `user:${payload.toUserId}`;
  //   const roomObj = io.sockets.adapter.rooms.get(room);
  //   if (!roomObj || roomObj.size === 0) {
  //     console.log("❌ ROOM EMPTY", room);
  //   }
  //   console.log(
  //     "INVITE TARGET",
  //     room,
  //     "members:",
  //     io.sockets.adapter.rooms.get(room)?.size || 0
  //   );

  //   io.to(room).emit("game-invitation:new", {
  //     invitationId: payload.invitationId,
  //     fromUserId: userId,
  //   });
  // });

socket.on("game-invitation:send", (payload, ack) => {
  if (
    !payload ||
    typeof payload.toUserId !== "string" ||
    typeof payload.invitationId !== "string"
  ) {
    return ackError(
      ack,
      "INVALID_PAYLOAD",
      "Invalid invitation payload"
    );
  }

  console.log("INVITE SEND", {
    from: userId,
    to: payload.toUserId,
    invitationId: payload.invitationId,
  });

  const room = `user:${payload.toUserId}`;

  const deliveredTo = io.sockets.adapter.rooms.get(room)?.size || 0;

  if (deliveredTo === 0) {
    console.log("❌ ROOM EMPTY", room);
  }

  console.log(
    "INVITE TARGET",
    room,
    "members:",
    deliveredTo
  );

  try {
    io.to(room).emit("game-invitation:new", {
      invitationId: payload.invitationId,
      fromUserId: userId,
    });

    ackSuccess(ack, deliveredTo);
  } catch (err) {
    console.error(err);

    ackError(
      ack,
      "INTERNAL_ERROR",
      "Failed to emit invitation update"
    );
  }
});












  // socket.on("game-invitation:answered", (payload) => {
  //   if (
  //     !payload ||
  //     typeof payload.toUserId !== "string" ||
  //     typeof payload.invitationId !== "string" ||
  //     (payload.status !== "accepted" && payload.status !== "declined")
  //   ) {
  //     return;
  //   }

  //   const room = `user:${payload.toUserId}`;
  //   const roomObj = io.sockets.adapter.rooms.get(room);
  //   if (!roomObj || roomObj.size === 0) {
  //     console.log("❌ ROOM EMPTY", room);
  //   }
  //   console.log(
  //     "INVITE TARGET",
  //     room,
  //     "members:",
  //     io.sockets.adapter.rooms.get(room)?.size || 0
  //   );

  //   io.to(room).emit("game-invitation:updated", {
  //     invitationId: payload.invitationId,
  //     status: payload.status,
  //     answeredByUserId: userId,
  //   });
    
  // });



  socket.on("game-invitation:answered", (payload, ack) => {
    if (
      !payload ||
      typeof payload.toUserId !== "string" ||
      typeof payload.invitationId !== "string" ||
      (payload.status !== "accepted" &&
        payload.status !== "declined")
    ) {
      return ackError(
        ack,
        "INVALID_PAYLOAD",
        "Invalid invitation payload"
      );
    }

    const room = `user:${payload.toUserId}`;
    const deliveredTo = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("INVITE ANSWER", {
      from: userId,
      to: payload.toUserId,
      invitationId: payload.invitationId,
      status: payload.status,
      deliveredTo,
    });

    try {
      io.to(room).emit("game-invitation:updated", {
        invitationId: payload.invitationId,
        status: payload.status,
        answeredByUserId: userId,
      });

      ackSuccess(ack, deliveredTo);
    } catch (err) {
      console.error(err);
      ackError(
        ack,
        "INTERNAL_ERROR",
        "Failed to emit invitation update"
      );
    }
  });



  socket.on("radio:join", ({ radioId }, ack) => {
    if (!radioId) {
      return ackError(
        ack,
        "INVALID_RADIO_ID",
        "radioId is required"
      );
    }
    socket.join(`radio:${radioId}`);
    ackSuccess(ack, 1);
  });

  socket.on("radio:leave", ({ radioId }, ack) => {
    if (!radioId) {
      return ack?.({ ok: false });
    }
    const room = `radio:${radioId}`;
    socket.leave(room);
    ack?.({ ok: true });
  });

  socket.on("disconnect", async (reason) => {

    const sockets = onlineUsers.get(userId);
    

    if (!sockets || !sockets.has(socket.id)) {
      console.log("Missing socket set for", userId);
      return;
    }

    console.log(
      "Before disconnect:",
      userId,
      [...(onlineUsers.get(userId) || [])]
    );

    sockets.delete(socket.id);

    console.log(
      "After disconnect:",
      userId,
      [...(onlineUsers.get(userId) || [])]
    );

    if (sockets.size === 0) {
      onlineUsers.delete(userId);
      console.log("❌ USER OFFLINE:", userId);

      try {
        const res = await fetch("http://web:3000/api/users/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            isOnline: false,
          }),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (err)
      {
        console.error("database update for disconnection failed", err);
      }
    }

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

const interval = setInterval(cleanupUsers, 60000);

process.on("SIGTERM", () => clearInterval(interval));
process.on("SIGINT", () => clearInterval(interval));