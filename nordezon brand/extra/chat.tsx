import BackgroundContainer from '@/components/common/BackgroundContainer'
import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import Loading from '@/components/common/Loading'
import ChatBox from '@/components/messages/ChatBox'
import ChatProductPicker from '@/components/messages/ChatProductPicker'
import { primaryOrange } from '@/constants/colors'
import { useSocket } from '@/socket/SocketProvider'
import { useUploadFileMutation } from '@/store/api/v1/files'
import { setChatMessages, setNewChatMessage, setRoomHeader } from '@/store/slices/chat'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, Image, StyleSheet, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'brand';
    time: string;
}

const { width } = Dimensions.get('window')
const chat = () => {
    const [newMessage, setNewMessage] = useState('');
    const [inputHeight, setInputHeight] = useState(40);
    const [messages, setMessages] = useState<Message[]>();
    const [selectedImage, setSelectedImage] = useState<any>()
    const { roomId } = useLocalSearchParams<any>();
    const { user } = useSelector((state: any) => state.user)
    const { chatMessages } = useSelector((state: any) => state.chat)
    const flatListRef = useRef<FlatList>(null);

    const [uploadFile] = useUploadFileMutation();

    // Loading state for initial fetch
    const [loading, setLoading] = useState(true);

    // Open image picker for gallery
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const fileName = uri.split("/").pop() || "image.jpg";
            const fileType = fileName.split(".").pop();
            const formData = new FormData();
            formData.append("files", {
                uri,
                name: fileName,
                type: `image/${fileType}`,
            } as any);
            // console.log("uri", uri);
            const response: any = await uploadFile(formData).unwrap();
            const { data } = response;
            setSelectedImage(data[0])
        }
    };

    // Open camera to take a new photo
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to take photos!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const fileName = uri.split("/").pop() || "photo.jpg";
            const fileType = fileName.split(".").pop();
            const formData = new FormData();
            formData.append("files", {
                uri,
                name: fileName,
                type: `image/${fileType}`,
            } as any);
            // console.log("Taken photo uri", uri);
            const response: any = await uploadFile(formData).unwrap();
            const { data } = response;
            setSelectedImage(data[0])
        }
    };

    const [productModalVisible, setProductModalVisible] = useState(false);
    const dispatch = useDispatch();
    const socket = useSocket();

    // Always fetch messages when the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (!socket) return;
            let payload = {
                roomId: roomId,
            };
            socket.emit("open_chat_window", payload);

            // Show loading whenever refetch
            setLoading(true);

        }, [socket, roomId])
    );

    useEffect(() => {
        if (!socket) return;

        const handleChatsResponse = (response: any) => {
            if (response?.status === "success") {
                dispatch(setChatMessages(response.data || []));
                const openChatUser = response.data.find((msg: any) => msg?.messages?.user?.id !== user.id)?.messages?.user || null;

                let chatRoomHeader = {
                    roomId: roomId,
                    openChatUser: openChatUser
                }
                dispatch(setRoomHeader(chatRoomHeader))
                setLoading(false);


            } else {
                console.warn("⚠️ Chat fetch failed:", response?.message);
                setLoading(false);
            }
        };

        const handleLastLatestMessageResponse = (response: any) => {
            if (response?.status === "success") {
                dispatch(setNewChatMessage(response.data));
                setLoading(false);
            } else {
                console.warn("⚠️ Chat fetch failed:", response?.message);
                setLoading(false);
            }
        }

        socket.on("get_all_messages", handleChatsResponse);
        socket.on("get_last_latest_message", handleLastLatestMessageResponse);

        return () => {
            socket.off("get_all_messages", handleChatsResponse);
            socket.off("get_last_latest_message", handleLastLatestMessageResponse);
            socket.off("receive_message");
        };
    }, [socket, user?.id, dispatch, roomId]);

    const handleSentMessage = () => {
        if (newMessage.trim() == "" && !selectedImage) return;
        let payload = {
            roomId: roomId,
            messageBody: newMessage,
            url: selectedImage ? selectedImage : "",
        }
        setInputHeight(45)
        setNewMessage("")
        setSelectedImage("")
        socket.emit("send_message", payload)
    }

    const handleSelectProduct = (post: any) => {
        let payload = {
            roomId: roomId,
            postId: post.id,
            url: "",
            messageBody: "",
        }
        socket.emit("send_message", payload)
        setProductModalVisible(false);
    }

    if (loading) {
        // Always show Loading when landing until data loaded
        return (
            <BackgroundContainer>
                <View style={[styles.chatContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Loading />
                </View>
            </BackgroundContainer>
        );
    }

    return (
        <BackgroundContainer>
            <View style={styles.chatContainer}>
                <FlatList
                    inverted
                    ref={flatListRef}
                    data={[...chatMessages].reverse()}
                    renderItem={({ item }) => <ChatBox message={item} />}
                    keyExtractor={(item, index: number) => index.toString()}
                />

                {/* Input */}
                {selectedImage && (
                    <View style={styles.imagePreview}>
                        <Image source={{ uri: selectedImage }} style={styles.imagePreviewImage} />
                        <CTouchableOpacity onPress={() => setSelectedImage(null)} style={styles.imagePreviewClose}>
                            <Ionicons name="close-circle" size={30} color="red" />
                        </CTouchableOpacity>
                    </View>
                )}
                <View style={styles.inputContainer}>
                    <View style={[styles.inputWrapper, { height: Math.max(52, inputHeight + 12) }]}>
                        {/* File / attachment icon */}
                        <CTouchableOpacity onPress={() => setProductModalVisible(true)} style={{ marginRight: 8 }}>
                            <Ionicons name="pricetag" size={24} color="#999" />
                        </CTouchableOpacity>
                        
                        {/* Camera icon for taking a photo */}
                        <CTouchableOpacity onPress={takePhoto} style={{ marginRight: 8 }}>
                            <Ionicons name="camera" size={24} color="#999" />
                        </CTouchableOpacity>

                        {/* Gallery (attach) icon */}
                        <CTouchableOpacity onPress={() => pickImage()} style={styles.attachIcon}>
                            <Ionicons name="attach" size={24} color="#999" style={{ marginRight: 8 }} />
                        </CTouchableOpacity>

                        {/* Text Input */}
                        <TextInput
                            style={[styles.input, { height: Math.max(40, inputHeight) }]}
                            placeholder="Type a message..."
                            placeholderTextColor="#999"
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline={true} // Allow multiple lines
                            onContentSizeChange={(e) => {
                                const newHeight = e.nativeEvent.contentSize.height;
                                setInputHeight(Math.min(newHeight, 120));
                            }}
                        />
                    </View>

                    {/* Send button */}
                    <CTouchableOpacity style={styles.sendBtn} onPress={handleSentMessage}>
                        <Ionicons name="send" size={24} color="#fff" />
                    </CTouchableOpacity>
                </View>
            </View>
            <ChatProductPicker
                visible={productModalVisible}
                onClose={() => setProductModalVisible(false)}
                products={""}
                onSelectProduct={handleSelectProduct}
            />
        </BackgroundContainer >
    )
}

const styles = StyleSheet.create({
    imagePreview: {
        flexDirection: 'row',      // horizontal layout
        alignItems: 'center',      // vertically center the image and close button
        marginBottom: 6,           // space from input field
        padding: 4,
        // backgroundColor: '#f2f2f2', // light gray background
        borderRadius: 8,
        width: width,
    },

    imagePreviewImage: {
        height: 400,
        width: width * 0.9,

        borderRadius: 8,
        marginRight: 6,
    },

    imagePreviewClose: {
        top: 10,
        right: 45,
        position: "absolute",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
        borderRadius: 20,
    },

    attachIcon: {
    },

    chatContainer: {
        flex: 1,
    },
    sendText: {
        color: '#fff',
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center', // changed from 'flex-end' to 'center'
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },

    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center', // changed from 'flex-end' to 'center'
        backgroundColor: '#fff',
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 6,
        minHeight: 40,       // minimum height
        maxHeight: 120,      // maximum height
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },

    input: {
        flex: 1,
        fontSize: 14,
        color: '#000',
    },
    sendBtn: {
        marginLeft: 8,
        backgroundColor: primaryOrange,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },

})

export default chat