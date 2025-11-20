import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import { primaryOrange } from '@/constants/colors';
import { formatDate } from '@/helpers';
import { setChatList } from '@/store/slices/chat';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from "../../socket/SocketProvider";

/**
 * MessagesContainer
 * Ensure that every time this screen is navigated to (comes into focus),
 * we emit "get_all_chats" to fetch the latest chats from the server.
 * Also show unread message count on chat list item if "unreadMessageCount" is present.
 * 
 * Now: Implements client-side search based on the TextField.
 */
const ChatListContainer = () => {
    const router = useRouter()
    const socket = useSocket();
    // Use this state for search text
    const [searchText, setSearchText] = useState("");
    const dispatch = useDispatch();
    const { chatList } = useSelector((state: any) => state.chat);

    useFocusEffect(
        useCallback(() => {
            // On every focus, emit request for chats
            if (socket) {
                socket.emit("get_all_chats");
            }
        }, [socket])
    );

    useEffect(() => {
        if (!socket) return;

        const handleChatsResponse = (response: any) => {
            if (response?.status === "success") {
                dispatch(setChatList(response.data || []));
            } else {
                console.warn("⚠️ Chat fetch failed:", response?.message);
            }
        };

        // Listen for both legacy and correct event name just in case
        socket.on("get_all_chats", handleChatsResponse);
        socket.on("all_chats_response", handleChatsResponse);

        return () => {
            socket.off("get_all_chats", handleChatsResponse);
            socket.off("all_chats_response", handleChatsResponse);
        };
    }, [socket]);

    // Memoized filtered chat list based on search input
    const filteredChatList = useMemo(() => {
        if (!searchText.trim()) return chatList;
        const lower = searchText.toLowerCase();
        return chatList.filter((item: any) => {
            // Searchable fields: user fullName and last message body
            const name = item?.user?.fullName || '';
            const lastMessageBody = item?.lastMessage?.messageBody || '';
            return (
                name.toLowerCase().includes(lower) ||
                lastMessageBody.toLowerCase().includes(lower)
            );
        });
    }, [searchText, chatList]);

    const renderItem = ({ item }: { item: any }) => {
        const lastMessage = item?.lastMessage?.messages;
        const lastMessageBody = lastMessage
            ? lastMessage.messageBody
                ? lastMessage.messageBody.length > 40
                    ? lastMessage.messageBody.slice(0, 40) + "..."
                    : lastMessage.messageBody
                : lastMessage.url
                    ? "Sent Image"
                    : "No messages yet"
            : "No messages yet";

        const messageTime = item?.lastMessage?.sentAt
            ? formatDate(item.lastMessage.sentAt)
            : "";

        const hasProfile = !!item?.user?.profile;
        const unreadMessageCount = item?.unreadMessageCount;

        return (
            <CTouchableOpacity
                style={styles.card}
                onPress={() => router.push({
                    pathname: "/(chat)/chatwindow",
                    params: {
                        roomId: item.id,
                        fullName: item?.user?.fullName || "Unknown User",
                        profile: item?.user?.profile || "",
                    },
                })}
            >
                <View style={styles.avatarContainer}>
                    {hasProfile ? (
                        <Image
                            source={{ uri: item.user.profile }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.iconAvatar]}>
                            <Ionicons name="person-circle-outline" size={42} color="#ccc" />
                        </View>
                    )}

                </View>

                <View style={styles.textContainer}>
                    <CText style={styles.name}>
                        {item?.user?.fullName || "Unknown User"}
                    </CText>
                    <CText style={styles.message}>{lastMessageBody}</CText>
                </View>

                {messageTime ? <CText style={styles.time}>{messageTime}</CText> : null}
                {/* Unread Message Badge */}
                {unreadMessageCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <CText style={styles.unreadBadgeText}>
                            {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                        </CText>
                    </View>
                )}
            </CTouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <CText style={styles.header}>Messages</CText>

            <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} color="#888" />
                <TextInput
                    placeholder="Search messages..."
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCorrect={false}
                    autoCapitalize="none"
                    clearButtonMode="while-editing"
                />
            </View>

            <FlatList
                data={filteredChatList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={
                    <CText style={{ textAlign: "center", color: "#888", marginTop: 28 }}>
                        {searchText.trim()
                            ? "No conversations found."
                            : "No conversations to display."}
                    </CText>
                }
            />
        </View>
    );
};

export default ChatListContainer;

const styles = StyleSheet.create({
    container: {
        marginBottom: 80,
    },
    header: {
        color: '#222',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fbfbfa',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        color: '#333',
        marginLeft: 8,
        fontSize: 14,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingTop: 15,
        paddingRight: 5,
        // marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
    },
    avatarContainer: {
        width: 55,
        height: 55,
        borderRadius: 30,
        overflow: 'hidden',
        marginRight: 12,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
    },
    name: {
        color: '#222',
        fontSize: 16,
        fontWeight: '600',
    },
    message: {
        color: '#555',
        fontSize: 13,
        marginTop: 2,
    },
    time: {
        top: -15,
        right: 5,
        color: primaryOrange,
        fontSize: 12,
    },
    iconAvatar: {
        backgroundColor: "#222", // looks better on dark themes
        justifyContent: "center",
        alignItems: "center",
    },
    unreadBadge: {
        top: 10,
        backgroundColor: '#ff3b30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    unreadBadgeText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    }
});
