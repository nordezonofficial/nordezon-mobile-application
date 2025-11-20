import BrandDetailedHeader from "@/components/brands/BrandDetailedHeader";
import ChatHeader from "@/components/messages/ChatHeader";
import { SocketProvider } from "@/socket/SocketProvider";
import { Stack } from "expo-router";
import React from "react";

export default function ChatLayout() {
    return (
        <SocketProvider>
            <Stack>
                {/* Chat List Screen */}
                <Stack.Screen
                    name="chatlist"
                    options={{
                        header: () => <BrandDetailedHeader />, // 👈 custom header for chat list
                    }}
                />

                {/* Single Chat / Messages Screen */}
                <Stack.Screen
                    name="chatwindow"
                    options={{
                        header: () => <ChatHeader />, // 👈 different header for individual chat
                    }}
                />
            </Stack>
        </SocketProvider>
    );
}
