import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CTouchableOpacity from '../common/CTouchableOpacity'

type InstagramPostProps = {
    onPress: () => void,
    username: string
    userAvatar: any
    postImage: any
    likes: number
    caption: string
    timeAgo: string
    price: string | number
    discountPrice?: string | number
    title?: string
    shortDescription?: string
    comments?: number
}

const HomePost = ({
    username = 'johndoe',
    userAvatar = require('@/assets/images/stories/1.jpg'),
    postImage = require('@/assets/images/post.jpg'),
    likes = 122,
    caption = "Loving the vibe today! 🌞 #sunnyday",
    timeAgo = '2 hours ago',
    price = 'Rs. 999',
    discountPrice = 'Rs. 749',
    title = 'Stylish Handbag',
    shortDescription = 'Perfect for daily use, elegant & spacious.',
    comments = 16,
    onPress
}: Partial<InstagramPostProps>) => {
    return (
        <CTouchableOpacity style={styles.card} onPress={() => onPress && onPress()}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={userAvatar} style={styles.avatar} />
                <Text style={styles.username}>{username}</Text>
                <View style={{ flex: 1 }} />
                {/* <Ionicons name="ellipsis-horizontal" size={20} color="#222" /> */}
                <TouchableOpacity style={styles.saveIcon}>
                    <Ionicons name="bookmark-outline" size={26} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Image with Save icon (top right) and Actions (bottom over image) */}
            <View style={styles.imageContainer}>
                <ImageBackground imageStyle={styles.productImageStyle}
                    source={{ uri: postImage }} style={styles.postImage} resizeMode="cover" />
                {/* Save icon on top right */}

                {/* Action icons at bottom of image */}
                <View style={styles.overlayActionsRow}>
                    <View style={styles.iconWithCount}>
                        <TouchableOpacity>
                            <Ionicons name="heart-outline" size={26} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.actionCountText}>{likes}</Text>
                    </View>
                    <View style={[styles.iconWithCount, styles.iconSpacing]}>
                        <TouchableOpacity>
                            <Ionicons name="chatbubble-outline" size={26} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.actionCountText}>{comments}</Text>
                    </View>
                    {/* Cart removed from action bar, now on price side */}
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={styles.iconSpacing}>
                        <Ionicons name="paper-plane-outline" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content Row: Title/Short Description (left), Price (right, now with Add to Cart button) */}
            <View style={styles.infoRow}>
                <View style={styles.infoTextSection}>
                    <Text numberOfLines={1} style={styles.title}>{title}</Text>
                    <Text numberOfLines={2} style={styles.shortDescription}>{shortDescription}</Text>
                </View>
                <View style={styles.priceSection}>
                    <Text style={styles.discountPrice}>{discountPrice}</Text>
                    <Text style={styles.originalPrice}>{price}</Text>
                    <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.75}>
                        <Ionicons name="cart-outline" size={20} color="#fff" />
                        <Text style={styles.addToCartText}>Add to cart</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Time Ago */}
            <Text style={styles.timeAgo}>{timeAgo}</Text>
        </CTouchableOpacity>
    )
}

const styles = StyleSheet.create({
    productImageStyle: {
        height: 450,

    },
    postImage: {
        width: '100%',
        height: 450,
        backgroundColor: '#ededed',
        borderRadius: 0,
    },
    card: {
        backgroundColor: '#fff',
        marginBottom: 130,
        borderRadius: 14,

        // Light shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,

        // Light elevation for Android
        elevation: 2,

        // Optional subtle border
        borderWidth: 0.5,
        borderColor: '#eee',
    },
    header: {
        zIndex: 99,
        position: "absolute",
        top: -120,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
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
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 330,
        backgroundColor: '#ededed',
        justifyContent: 'flex-end',
    },

    saveIcon: {
        position: 'absolute',
        top: 10,
        right: 5,
        zIndex: 2,
        backgroundColor: 'rgba(0,0,0,0.40)',
        borderRadius: 25,
        padding: 6,
    },
    overlayActionsRow: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 9,
        paddingHorizontal: 18,
        backgroundColor: 'rgba(0,0,0,0.22)',
        zIndex: 1,
    },
    iconSpacing: {
        marginLeft: 16,
    },
    iconWithCount: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionCountText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
        marginRight: 2,
        marginBottom: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 4,
    },
    infoTextSection: {
        flex: 3,
        top: -20,
        paddingRight: 8,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#1a1a1a',
        marginBottom: 2,
    },
    shortDescription: {
        fontSize: 13,
        color: '#586069',
        marginBottom: 0,
    },
    priceSection: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        flex: 1.2,
        minWidth: 80,
    },
    discountPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0b8457',
        marginRight: 0,
    },
    originalPrice: {
        fontSize: 14,
        color: '#888',
        textDecorationLine: 'line-through',
    },
    addToCartBtn: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff8600',
        borderRadius: 18,
        paddingVertical: 5,
        paddingHorizontal: 12,
        minWidth: 100,
    },
    addToCartText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 7,
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
    timeAgo: {
        marginLeft: 12,
        top: -20,
        color: '#888',
        fontSize: 12,
        letterSpacing: 0.5,
    },
})

export default HomePost
