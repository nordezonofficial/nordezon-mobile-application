import { API_URL } from "@/constants/keys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = async (): Promise<Socket> => {
    if (socket) return socket; // avoid duplicate connections

    let token: string | null = await AsyncStorage.getItem("@access_token");
    socket = io(API_URL, {
        transports: ["websocket"],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 10000,
        auth: {
            token,
        },
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) throw new Error("Socket not initialized — call initializeSocket() first.");
    return socket;
};
