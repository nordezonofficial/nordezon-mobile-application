interface Reel {
    id: string;
    title: string;
    url: string;
    videoThumbnail: string;
    likes?: number;
    comments?: number;
}
import { primaryGreen, primaryOrange } from '@/constants/colors';
import { isVideoFile } from '@/helpers';
import { useLikePostMutation } from '@/store/api/v1/likes';
import { setCommentList, setLikePost } from '@/store/slices/post';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import CommentsBottomSheet from '../common/CommentsBottomSheet';
import Description from '../common/Description';
const { height, width } = Dimensions.get('window');

export default function ReelItem({ item, isActive, preloadedPlayer, isFromBrand, isFromStory }: any) {

    const player = preloadedPlayer
        ? preloadedPlayer
        : useVideoPlayer(
            { uri: item.url, useCaching: true, },
            (playerInstance) => {
                playerInstance.loop = true;
            }
        );

    const [isLongPaused, setIsLongPaused] = React.useState(false);
    const prevIsActiveRef = React.useRef(false);
    const { user } = useSelector((state: any) => state.user)
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [likePost] = useLikePostMutation();
    const { postLikesComments } = useSelector((state: any) => state.post)

    const currentPostLikesComments = postLikesComments.find(
        (post: any) => post.postId === item.id
    );

    const dispatch = useDispatch();
    const navigation = useNavigation();

    React.useEffect(() => {
        if (isActive && !isLongPaused) {
            if (!prevIsActiveRef.current) {
                player.currentTime = 0;
            }
            player.play();
        } else {
            player.pause();
        }
        prevIsActiveRef.current = isActive;
    }, [isActive, player, isLongPaused]);

    const handleLongPress = () => {
        setIsLongPaused(true);
        player.pause();
    };

    const handlePressIn = () => { };

    const handlePressOut = () => {
        setIsLongPaused(false);
        if (isActive) {
            player.play();
        }
    };

    // Double tap detection for like
    const lastTap = useRef(0);
    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap.current && (now - lastTap.current) < 300) {
            // Double tap detected
            handleLike();
        }
        lastTap.current = now;
    };

    const handleLike = () => {
        const newIsLiked = !currentPostLikesComments?.isLiked;

        dispatch(setLikePost({
            postId: item.id,
            isLiked: newIsLiked,
            key: isFromStory ? "STORY" : "REEL"
        }));

        likePost({
            postId: item.id,
            isLiked: newIsLiked ? "LIKED" : "UNLIKED",
            key: isFromStory ? "STORY" : "REEL"
        }).unwrap();
    };

    const [showComments, setShowComments] = useState(false);

    const handleComment = () => {
        setShowComments(true)
        dispatch(setCommentList([]))
        console.log('Comment pressed');
    };

    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    const video = useRef(null);
    const [status, setStatus] = useState({});
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(prev => !prev);
    };

    const handleBack = () => {
        if (navigation && typeof navigation.goBack === 'function') {
            navigation.goBack();
        }
    };

    return (
        <>
            <Pressable
                style={styles.reelContainer}
                onPress={handleDoubleTap}
                onLongPress={handleLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                delayLongPress={300}
            >
                {/* Back Button on Top Left */}
                <View style={styles.topLeft}>
                    <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={28} color="white" style={styles.iconShadow} />
                    </TouchableOpacity>
                </View>
                {isVideoFile(item.url) ? (
                    <>
                        {item.videoThumbnail && (
                            <Image
                                resizeMode="contain"
                                source={{ uri: item.videoThumbnail }}
                                style={[
                                    styles.video,
                                    {
                                        opacity: isVideoReady ? 0 : 1,
                                        zIndex: isVideoReady ? -1 : 1,
                                        position: 'absolute'
                                    },
                                ]}
                            />
                        )}
                        <VideoView
                            player={player}
                            style={styles.video}
                            contentFit="contain"
                            nativeControls={false}
                            onFirstFrameRender={() => setIsVideoReady(true)}
                        />
                    </>
                ) : (
                    <Image
                        source={{ uri: item.url }}
                        style={styles.video}
                        resizeMode="contain"
                    />
                )}



                {/* Overlay Controls */}
                <Animated.View style={styles.overlay}>
                    <View style={styles.rightControls}>
                        {/* Like Button */}
                        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                            <Ionicons
                                name={currentPostLikesComments?.isLiked ? "heart" : "heart-outline"}
                                size={35}
                                color={currentPostLikesComments?.isLiked ? "#ff3040" : "white"}
                                style={styles.iconShadow}
                            />
                            <Text style={styles.actionText}>{currentPostLikesComments?.likesCount || 0}</Text>
                        </TouchableOpacity>

                        {/* Comment Button */}
                        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
                            <Ionicons
                                name="chatbubble-outline"
                                size={35}
                                color="white"
                                style={styles.iconShadow}
                            />
                            <Text style={styles.actionText}>{item?._count?.comments || 0}</Text>
                        </TouchableOpacity>

                        {/* Save / Bookmark Button */}
                        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                            <Ionicons
                                name={isSaved ? "bookmark" : "bookmark-outline"}
                                size={35}
                                color={isSaved ? "#FFD700" : "white"}
                                style={styles.iconShadow}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Make the text and info occupy the full bottom left */}
                    <View style={styles.fullBottomInfo}>
                        <View style={styles.creatorBottomRow}>
                            <View style={styles.creatorAvatar}>
                                <Image
                                    source={{
                                        uri: isFromBrand ? user.logoUrl : item.user.logoUrl
                                    }}
                                    style={styles.avatarImage}
                                />
                            </View>
                            <View style={styles.creatorInfoContainer}>
                                <Text style={styles.creatorName}>
                                    {isFromBrand ? user.brandName : item.user.brandName}
                                </Text>
                                {/* Optionally, you can place follow button here */}
                                {/* <TouchableOpacity style={styles.followButton}>
                                    <Text style={styles.followButtonText}>Follow</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                        <View style={styles.descriptionWrapper}>
                            <Description style={styles.audioText} text={item.title} />
                        </View>
                    </View>
                </Animated.View>
            </Pressable>
            {
                showComments && (
                    <CommentsBottomSheet
                        post={item}
                        visible={showComments}
                        onClose={() => setShowComments(false)}
                    />
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    reelContainer: {
        width: width,
        height: height,
    },
    video: {
        width: width,
        height: height,
    },
    progressContainer: {
        position: 'absolute',
        top: 40,
        left: 10,
        right: 10,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
        backgroundColor: primaryGreen,
    },
    overlay: {
        position: 'absolute',
        width,
        height,
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    rightControls: {
        position: 'absolute',
        right: 16,
        bottom: 150,
        alignItems: 'center',
    },
    actionButton: {
        alignItems: 'center',
        marginBottom: 25,
    },
    actionText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
    iconButton: {
        marginVertical: 30,
    },
    fullBottomInfo: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingBottom: 24,
        backgroundColor: 'rgba(0,0,0,0)', // transparent, or set opacity if needed
    },
    creatorBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    creatorAvatar: {
        marginRight: 10,
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 1,
        resizeMode: "cover",
        borderColor: 'white',
    },
    creatorInfoContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    creatorName: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    descriptionWrapper: {
        width: '100%',
    },
    audioText: {
        color: 'white',
        fontSize: 13,
        width: '100%',
        top: 5,
    },
    followButton: {
        backgroundColor: '#fff',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginLeft: 8,
    },
    followButtonText: {
        color: primaryOrange,
        fontWeight: '600',
        fontSize: 12,
    },
    // New styles for shadow and top left back button
    topLeft: {
        position: 'absolute',
        top: 5,
        left: 5,
        zIndex: 200,
    },
    backBtn: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 22,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconShadow: {
        textShadowColor: 'rgba(0,0,0,0.85)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
        elevation: 7,
    }
});
