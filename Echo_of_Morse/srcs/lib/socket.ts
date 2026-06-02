import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
if (!WS_URL) {
  throw new Error("Missing NEXT_PUBLIC_WS_URL");
}

let socket: Socket | null = null;

const randomId = Math.random().toString(36).slice(2);

export function getSocket() {
  if (typeof window === "undefined") return null;

  let userId = localStorage.getItem("userId");

  if (!userId) {
    userId = Math.random().toString(36).slice(2);
    localStorage.setItem("userId", userId);
  }

  if (!socket) {
    socket = io(WS_URL, {
      path: "/socket.io/",
      // auth: {
      //   userId: session.user.id,
      // },
      query: {
        userId,
      },
      transports: ["polling", "websocket"],
      autoConnect: true,
    });

    console.log("✅ SOCKET CREATED");
  }

  return socket;
}

