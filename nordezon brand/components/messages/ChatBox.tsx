import CText from '@/components/common/CText';
import { primaryOrange } from '@/constants/colors';
import { formatDate } from '@/helpers';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Product from '../brands/Product';
import CTouchableOpacity from '../common/CTouchableOpacity';

// We'll use Ionicons for tick marks (blue/gray)
import { Ionicons } from '@expo/vector-icons';

interface ChatBoxProps {
    message: any;
}

const ChatBox = ({ message }: ChatBoxProps) => {
    const { user } = useSelector((state: any) => state.user);
    const isUser = user.id === message?.messages?.userId;

    // State for modal visibility
    const [modalVisible, setModalVisible] = useState(false);

    // Message status component for user messages
    const renderStatusTicks = () => {
        // Only show tick(s) if current user sent this message
        if (!isUser) return null;

        // Your backend provides message.status === "SEEN" | "NOTSEEN"
        const status = message?.status;
        // Blue double tick for SEEN, gray double tick for NOTSEEN
        if (status === 'SEEN') {
            return (
                <View style={styles.statusTicks}>
                    <Ionicons name="checkmark-done" size={14} color="#2787F5" />
                </View>
            );
        }
        if (status === 'NOTSEEN') {
            return (
                <View style={styles.statusTicks}>
                    <Ionicons name="checkmark-done" size={14} color="#b0b0b0" />
                </View>
            );
        }
        // Default fallback: nothing (or optionally single gray check)
        return null;
    };

    return (
        <View
            style={[
                styles.messageContainer,
                isUser ? styles.userMessage : styles.brandMessage,
                {
                    backgroundColor: message?.messages?.postId
                        ? '#f3f7f9' // product message (neutral)
                        : isUser
                            ? primaryOrange // normal user message
                            : '#e6e5e4', // brand message
                },
            ]}
        >
            {/* Image Message with fullscreen viewer */}
            {message.messages.url && (
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setModalVisible(true)}
                    >
                        <Image
                            source={{ uri: message.messages.url }}
                            style={styles.messageImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <CTouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
                            <View style={styles.modalImageWrapper}>
                                <Image
                                    source={{ uri: message.messages.url }}
                                    style={styles.fullScreenImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </CTouchableOpacity>
                    </Modal>
                </>
            )}
            {/* Text Message */}
            {message?.messages?.messageBody && (
                <CText style={[styles.messageText, { color: isUser ? '#fff' : '#000' }]}>
                    {message.messages.messageBody}
                </CText>
            )}

            {/* Product Message */}
            {message.messages.postId && <Product item={message.messages.post} overlayButtons={false} />}

            {/* Time & Status */}
            <View style={styles.timeStatusRow}>
                <CText
                    style={[
                        styles.timeText,
                        {
                            color: message?.messages?.postId
                                ? '#555' // dark gray for product messages (light background)
                                : isUser
                                    ? '#fff' // white for orange user bubbles
                                    : '#555', // dark for brand bubbles
                        },
                    ]}
                >
                    {formatDate(message.sentAt)}
                </CText>
                {/* {renderStatusTicks()} */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 12,
        marginVertical: 4,
    },
    userMessage: {
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    brandMessage: {
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    messageText: {
        fontSize: 14,
    },
    messageImage: {
        width: 150,
        height: 150,
        borderRadius: 8,
        marginTop: 6,
        marginBottom: 4,
    },
    // Row for time and status ticks (align horizontally)
    timeStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 2,
    },
    timeText: {
        fontSize: 10,
        textAlign: 'right',
    },
    statusTicks: {
        marginLeft: 6,
        flexDirection: 'row',
    },
    // Modal styles
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 10,
    },
    modalImageWrapper: {
        width: '90%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
});

export default ChatBox;
