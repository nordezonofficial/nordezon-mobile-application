import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type InstagramPostProps = {
    username: string
    userAvatar: any
    postImage: any
    likes: number
    caption: string
    timeAgo: string
    price: string | number
    discountPrice?: string | number
}

const HomePost = ({
    username = 'johndoe',
    userAvatar = require('@/assets/images/stories/1.jpg'),
    postImage = require('@/assets/images/bazar/1.png'),
    likes = 122,
    caption = "Loving the vibe today! 🌞 #sunnyday",
    timeAgo = '2 hours ago',
    price = 'Rs. 999',
    discountPrice = 'Rs. 749',
}: Partial<InstagramPostProps>) => {
    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={userAvatar} style={styles.avatar} />
                <Text style={styles.username}>{username}</Text>
                <View style={{ flex: 1 }} />
                <Ionicons name="ellipsis-horizontal" size={20} color="#222" />
            </View>

            {/* Main Image */}
            <Image source={postImage} style={styles.postImage} resizeMode="cover" />

            {/* Actions */}
            <View style={styles.actionsRow}>
                <TouchableOpacity>
                    <Ionicons name="heart-outline" size={26} color="#222" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons
                        name="chatbubble-outline"
                        size={26}
                        color="#222"
                        style={styles.actionIconSpacing}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons
                        name="paper-plane-outline"
                        size={26}
                        color="#222"
                        style={styles.actionIconSpacing}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={26} color="#222" />
                </TouchableOpacity>
            </View>

            {/* Likes */}
            <Text style={styles.likes}>{likes} likes</Text>

            {/* Caption */}
            <Text style={styles.caption}>
                <Text style={styles.username}>{username} </Text>
                {caption}
            </Text>

            {/* 💰 Price Section */}
            <View style={styles.priceContainer}>
                <Text style={styles.discountPrice}>{discountPrice}</Text>
                <Text style={styles.originalPrice}>{price}</Text>
            </View>

            {/* Time Ago */}
            <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginBottom: 18,
        borderRadius: 14,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingBottom: 6,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1.5,
        borderColor: '#eee',
        marginRight: 9,
    },
    username: {
        fontWeight: '700',
        color: '#222',
        fontSize: 15,
    },
    postImage: {
        width: '100%',
        height: 330,
        backgroundColor: '#ededed',
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    actionIconSpacing: {
        marginLeft: 19,
    },
    likes: {
        fontWeight: '700',
        marginLeft: 12,
        marginBottom: 2,
        fontSize: 15,
        color: '#111',
    },
    caption: {
        marginLeft: 12,
        marginBottom: 6,
        color: '#222',
        fontSize: 14,
    },
    /** 💰 Price styles */
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
        marginBottom: 4,
    },
    discountPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0b8457',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 14,
        color: '#888',
        textDecorationLine: 'line-through',
    },
    timeAgo: {
        marginLeft: 12,
        marginBottom: 9,
        color: '#888',
        fontSize: 12,
        letterSpacing: 0.5,
    },
})

export default HomePost
