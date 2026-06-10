// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export function getSocket() {
//   if (typeof window === "undefined") return null;

//   let userId = localStorage.getItem("userId");

//   if (!userId) {
//     userId = Math.random().toString(36).slice(2);
//     localStorage.setItem("userId", userId);
//   }

//   if (!socket) {
//     const url = process.env.NEXT_PUBLIC_WS_URL || window.location.origin;
//     socket = io(url, {
//       path: "/socket.io/",
//       query: {
//         userId,
//       },
//       transports: ["polling", "websocket"],
//       autoConnect: true,
//     });

//     console.log("✅ SOCKET CREATED");
//   }

//   return socket;
// }

//----------------------------------------------------------------


import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
if (!WS_URL) {
  throw new Error("Missing NEXT_PUBLIC_WS_URL");
}

let socket: Socket | null = null;

export function getSocket() {
  if (typeof window === "undefined") return null;
  if (!socket) {
    socket = io(WS_URL, {
      path: "/socket.io/",
      transports: ["polling", "websocket"],
      autoConnect: false,
      // auth: { userId },
    });

    console.log("✅ SOCKET CREATED");
  }

  return socket;
}