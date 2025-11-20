import { primaryOrange } from '@/constants/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const videos = [
    { id: 2, uri: 'file:///data/user/0/host.exp.exponent/cache/ImagePicker/e0c7c24c-e37a-49f6-bc85-69a352deb0a2.mp4' },
    { id: 3, uri: 'file:///data/user/0/host.exp.exponent/cache/ImagePicker/58da32bd-0ae7-452e-b23a-5e08f2246f00.mp4' },
    { id: 4, uri: 'file:///data/user/0/host.exp.exponent/cache/ImagePicker/ddacbfc2-17a4-413d-bb61-d243a00a9fde.mp4' },
    { id: 5, uri: 'file:///data/user/0/host.exp.exponent/cache/ImagePicker/c6581454-eb70-49df-a548-54287f83efc1.mp4' },
];

export default function StoriesPlayer() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoProgress, setVideoProgress] = useState(0);
    const { type } = useLocalSearchParams<{ type?: string }>();
    const router = useRouter(); // ✅ get router instance

    const player = useVideoPlayer(videos[currentIndex].uri, (player) => {
        player.loop = false;
        player.play();
    });

    const opacity = useSharedValue(1);
    const translateXAnim = useSharedValue(0);

    useEffect(() => {
        player.replaceAsync(videos[currentIndex].uri).then(() => {
            player.play();
            setVideoProgress(0);

            // Add smooth fade + slide animation
            opacity.value = 0;
            translateXAnim.value = width;
            opacity.value = withTiming(1, { duration: 400 });
            translateXAnim.value = withTiming(0, { duration: 400 });
        });
    }, [currentIndex]);

    // ⏱ Track playback progress
    useEffect(() => {
        const interval = setInterval(async () => {
            const pos = await player.currentTime;
            const dur = await player.duration;

            if (dur) {
                setVideoProgress(pos / dur);

                // ⏭️ When video completes
                if (pos >= dur - 0.3) handleNext();
            }
        }, 300);

        return () => clearInterval(interval);
    }, [player, currentIndex]);

    const handleNext = () => {
        if (currentIndex < videos.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            console.log('Stories ended!');
            // ✅ Navigate to the page with "type" param after last video
            if (type) {
                router.push(`/${type}` as any); // Example: /home or /profile
            } else {
                router.back(); // fallback if type not given
            }
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handlePress = (event: any) => {
        const x = event.nativeEvent.locationX;
        if (x < width / 2) handlePrev();
        else handleNext();
    };

    return (
        <Animated.View style={styles.container}>
            <Animated.View
                style={[
                    styles.videoWrapper,
                    {
                        opacity,
                    },
                ]}
            >
                <VideoView
                    player={player}
                    style={styles.video}
                    contentFit="cover"
                    nativeControls={false}
                />

                <Pressable onPress={handlePress} style={styles.touchOverlay} />
            </Animated.View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                {videos.map((_, i) => {
                    const progressWidth =
                        i < currentIndex
                            ? '100%'
                            : i === currentIndex
                                ? `${videoProgress * 100}%`
                                : '0%';
                    return (
                        <View key={i} style={styles.progressBackground}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: progressWidth as any },
                                ]}
                            />
                        </View>
                    );
                })}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    videoWrapper: {
        position: 'absolute',
        width,
        height,
    },
    container: {
        width,
        height,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width,
        height,
    },
    touchOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        backgroundColor: 'transparent',
    },
    progressContainer: {
        position: 'absolute',
        top: 10,
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 10,
    },
    progressBackground: {
        flex: 1,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 3,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: primaryOrange,
    },
});
