import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import CText from '../common/CText'
import CTouchableOpacity from '../common/CTouchableOpacity'
const ChatHeader = () => {
    const router = useRouter();
    const { roomHeader } = useSelector((state: any) => state.chat)
    return (
        <View style={styles.header}>
            <CTouchableOpacity onPress={() => {
                router.back()
            }} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </CTouchableOpacity>
            <Image source={{
                uri: roomHeader?.openChatUser?.url
            }} style={styles.avatar} />
            <CText style={styles.chatName}>
                {roomHeader?.openChatUser?.fullName}
            </CText>
        </View>

    )
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        zIndex: 10,
    },
    backBtn: {
        marginRight: 10,
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
})
export default ChatHeader