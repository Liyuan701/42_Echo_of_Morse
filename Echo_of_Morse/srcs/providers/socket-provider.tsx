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
    const userId = session?.user?.id;

    if (!socketInstance) {
      return;
    }

    if (status !== "authenticated" || !userId) {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    socketInstance.disconnect();
    socketInstance.auth = {
      userId,
    };

    setSocket(socketInstance);
    
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
    socketInstance.connect();

    // heart beat timer  (60 seconds)
    // Keep database presence alive while this authenticated socket is active.
    const presenceHeartbeat = window.setInterval(() => {
      if (!socketInstance.connected) {
        return;
      }

      void fetch("/api/users/status", {
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
      window.clearInterval(presenceHeartbeat);
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.disconnect();
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
