// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

// export function createSocket(userId: string) {
//   if (!socket) {
//     socket = io(WS_URL, {
//       path: "/socket.io",
//       transports: ["websocket"],
//     //   auth: { userId: session.user.id },
//     });

//     console.log("🧠 Socket created");

//   }

//   return socket;
// }

// export function getSocket() {
//   return socket;
// }

// export function disconnectSocket() {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// }

// console.log("WS_URL =", WS_URL);


//-----------------------------------------------------------------------------------

// import { io, Socket } from "socket.io-client";

// const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

// let socket: Socket | null = null;

// export function getSocket() {
//   if (!socket) {
//     socket = io(WS_URL, {
//       transports: ["polling", "websocket"],
//     });

//     console.log("🧠 SOCKET CREATED");
//   }

//   return socket;
// }

//----------------------------------------------------------------------------

// import { io, Socket } from "socket.io-client";

// const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

// declare global {
//   var socket: Socket | undefined;
// }

// let socket: Socket | null = null;

// export function getSocket() {

//   if (typeof window === "undefined") {
//     return null;
//   }

//   if (!globalThis.socket) {
//     globalThis.socket = io(WS_URL, {
//       transports: ["polling", "websocket"],
//     });

//     console.log("🧠 SOCKET CREATED");
//   }

//   return globalThis.socket;
// }

import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

let socket: Socket | null = null;

export function getSocket() {
  if (typeof window === "undefined") return null;

  if (!socket) {
    socket = io(WS_URL, {
      // path: "/socket.io/",
      // transports: ["polling", "websocket"],
      transports: ["websocket"],
      autoConnect: true,
    });

    console.log("✅ SOCKET CREATED");
  }

  return socket;
}

