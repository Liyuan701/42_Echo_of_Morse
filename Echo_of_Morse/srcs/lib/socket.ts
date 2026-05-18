import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

export function createSocket(userId: string) {
  if (!socket) {
    socket = io(WS_URL, {
      path: "/socket.io",
      transports: ["websocket"],
    //   auth: { userId: session.user.id },
    });

    console.log("🧠 Socket created");

  }

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

console.log("WS_URL =", WS_URL);