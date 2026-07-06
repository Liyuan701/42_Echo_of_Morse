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
        if (!res.ok) {
          return;
        }

        const data = await res.json();

        if (!isMounted) return;
        if (!data.token) return;

        socketInstance.auth = {
          token: data.token,
        };

        socketInstance.connect();

        setSocket(socketInstance);
      } catch {
        setSocket(null);
        setIsConnected(false);
      }
    };

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);

    initSocket();

    return () => {
      isMounted = false;

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
