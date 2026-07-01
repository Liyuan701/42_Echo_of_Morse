// TODO Marc & Gustav:
// Chat messages and game invitations are persisted correctly, but the receiving
// browser does not get them until the page is refreshed. This means the REST API
// and PostgreSQL path work, while the Socket.IO connection/delivery path does not.
//
// Please verify the browser is actually connected to the expected socket server:
// - docker-compose.dev.yml exposes ws directly at http://localhost:3001.
// - .env.example currently sets NEXT_PUBLIC_WS_URL=https://localhost:8443, which
//   is the production WAF address and may be wrong when running the dev compose.
// - Confirm the browser console logs "CONNECTED" and inspect connect_error.
// - Confirm both accounts connect with their real NextAuth user IDs.
// - Confirm /socket.io/ polling and WebSocket requests succeed in DevTools.
//
// In development, NEXT_PUBLIC_WS_URL should normally be:
// NEXT_PUBLIC_WS_URL=http://localhost:3001


import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token?: string) {
  if (typeof window === "undefined") return null;

  if (!socket) {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || window.location.origin;
    socket = io(WS_URL, {
      path: "/socket.io/",
      transports: ["polling", "websocket"],
      autoConnect: false,
      auth: token ? { token } : undefined,
    });
    console.log("✅ SOCKET CREATED");
  }

  return socket;
}