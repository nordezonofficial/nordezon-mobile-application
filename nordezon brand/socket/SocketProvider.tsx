import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket } from "./index";

const SocketContext = createContext<any>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        const setup = async () => {
            const s = await initializeSocket();
            setSocket(s);
            s.connect();
            s.on("connect", () => console.log("✅ Connected:", s.id));
            s.on("disconnect", () => console.log("❌ Disconnected"));
            s.on("connect_error", (err) => console.log("⚠️ Connect error:", err.message));
        };

        setup();

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
