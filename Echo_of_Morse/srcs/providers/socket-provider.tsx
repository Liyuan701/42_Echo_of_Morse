// "use client";

// import {createContext, useContext, useEffect, useState} from "react";
// import { getSocket } from "@/lib/socket";
// import type { Socket } from "socket.io-client";
// import { useSession } from "next-auth/react";

// type SocketContextType = {
//   socket: Socket | null;
//   isConnected: boolean;
// };

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   isConnected: false,
// });

// export function SocketProvider({ children }: { children: React.ReactNode }) {

//   const { data: session, status } = useSession();
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {

//     if (status === "unauthenticated") {
//       const socketInstance = getSocket();
//       if (socketInstance?.connected) {
//         socketInstance.disconnect();
//       }
//       setSocket(null);
//       setIsConnected(false);
//       return;
//     }

//     const socketInstance = getSocket();
//     if (!socketInstance) {
//       return;
//     }

//     const userId = session?.user?.id;

//     if (status === "loading") {
//       return;
//     }

//     if (status !== "authenticated" || !userId) {
//       socketInstance.disconnect();
//       setSocket(null);
//       setIsConnected(false);
//       return;
//     }

//     socketInstance.auth = {
//       userId,
//     };

//     if (!socketInstance.connected && !socketInstance.active) {
//       socketInstance.connect();
//     }

//     console.log(
//       "CONNECTING",
//       session.user.id,
//       socketInstance.connected,
//       socketInstance.id
//     );

//     setSocket(socketInstance);
//     setIsConnected(socketInstance.connected);

//     const handleConnect = () => {
//       console.log("CONNECTED", socketInstance.id);
//       setIsConnected(true);
//     };

//     const handleDisconnect = (reason: string) => {
//       console.log("DISCONNECTED", reason);
//       setIsConnected(false);
//     };

//     socketInstance.on("connect", handleConnect);
//     socketInstance.on("disconnect", handleDisconnect);

//     const presenceHeartbeat = window.setInterval(() => {
//       if (!socketInstance.connected) {
//         return;
//       }

//       void fetch("/api/users/status", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId,
//           isOnline: true,
//         }),
//       });
//     }, 60000);

//     return () => {
//       window.clearInterval(presenceHeartbeat);
//       socketInstance.off("connect", handleConnect);
//       socketInstance.off("disconnect", handleDisconnect);
//     };
//   }, [status, session?.user?.id]);

//   return (
//     <SocketContext.Provider value={{ socket, isConnected }}>
//       {children}
//     </SocketContext.Provider>
//   );
// }

// export function useSocket() {
//   return useContext(SocketContext);
// }


//-----------------------------------------------------------------


"use client";

import {createContext, useContext, useEffect, useState} from "react";
import { getSocket } from "@/lib/socket";
import type { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {

  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {

    const socketInstance = getSocket();
    if (!socketInstance) return;
    socketInstance.disconnect();

    if (status === "loading") return;

    const userId = session?.user?.id;

    if (status !== "authenticated" || !userId) {
      if (socketInstance.connected) {
        socketInstance.disconnect();
      }
      setSocket(null);
      setIsConnected(false);
      return;
    }

    let isMounted = true;

    const initSocket = async () => {
      try {
        const res = await fetch("/api/socket/token");
        const data = await res.json();

        if (!isMounted) return;

        socketInstance.auth = {
          token: data.token,
        };

        if (!socketInstance.connected) {
          socketInstance.connect();
        }

        console.log(
          "CONNECTING",
          session.user.id,
          socketInstance.connected,
          socketInstance.id,
          socketInstance.auth
        );

        setSocket(socketInstance);
      } catch (err) {
        console.error("Socket token fetch failed", err);
      }
    };

    const handleConnect = () => {
      console.log("CONNECTED", socketInstance.id);
      setIsConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log("DISCONNECTED", reason);
      setIsConnected(false);
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);

    initSocket();

    const presenceHeartbeat = window.setInterval(() => {
      if (!socketInstance.connected) return;

      fetch("/api/users/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isOnline: true,
        }),
      });
    }, 60000);

    return () => {
      isMounted = false;

      window.clearInterval(presenceHeartbeat);
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
    };
  }, [status, session?.user?.id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}