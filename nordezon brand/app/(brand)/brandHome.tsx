import Banner from '@/components/brands/Banner';
import MetricsCard from '@/components/brands/MetricsCard';
import MetricsGraphs from '@/components/brands/MetricsGraphs';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import { primaryGreen, primaryOrange } from '@/constants/colors';
import { useGetDashboardAnalyticsQuery } from '@/store/api/v1/dashboard';
import { setDashboard } from '@/store/slices/user';
import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { useDispatch, useSelector } from 'react-redux';

const { height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.25;
const MIN_BANNER_HEIGHT = 120; // Increased minimum height to keep banner more visible

const BrandProfile = () => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const imageRef = useRef<any>(null);
    const [video, setVideo] = useState("")
    const [duration, setDuration] = useState<number>(0)
    const { user, dashboard } = useSelector((state: any) => state.user)
    const player = useVideoPlayer(video, player => {
        player.loop = false;
        player.pause();
    });

    const { status } = useEvent(player, 'statusChange', { status: player.status });
    const { data } = useGetDashboardAnalyticsQuery({})
    const dispatch = useDispatch();
    const [metrics, setMetrics] = useState([
        { label: 'Total Catalogs', value: 0, color: '#1E90FF' },
        { label: 'Total Products', value: 0, color: '#28A745' },
        { label: 'Current Orders', value: 0, color: '#FF8C00' },
        { label: 'Pending Orders', value: 0, color: '#FF3B30' },
    ]);

    useEffect(() => {
        if (data) {
            const dashboard = data.data;
            dispatch(setDashboard(dashboard));
            const counts = dashboard.order?.totalCounts || {};
            const postCount = counts.postCount || 0;
            const pending = counts.pendingOrders || 0;
            const processing = counts.processingOrders || 0;
            const completed = counts.completedOrders || 0;
            const cancelled = counts.cancelledOrders || 0;

            // Update metrics
            setMetrics([
                { label: 'Total Catalogue', value: postCount, color: primaryGreen },
                { label: 'Pending Orders', value: pending, color: '#FF8C00' },
                { label: 'Processing Orders', value: processing, color: '#1E90FF' },
                { label: 'Completed Orders', value: completed, color: '#28A745' },
                { label: 'Cancelled Orders', value: cancelled, color: '#FF3B30' },
            ]);
        }
    }, [data]);


    /* --- banner Height adjusting ---*/
    const bannerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT - MIN_BANNER_HEIGHT],
        outputRange: [HEADER_HEIGHT, MIN_BANNER_HEIGHT],
        extrapolate: 'clamp',
    });


    /* -- handle Add Story ----*/
    const handleAddStory = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow access to your gallery.');
            return;
        }

        /* ---- Getting the library ---*/
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [9, 16],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;

            console.log("uri", uri);
            setVideo(uri)
            let duration: any = result.assets[0].duration; // in seconds
            duration = duration / 1000;
            console.log("duration (seconds)", duration);
            setDuration(duration)
            if (duration && duration > 50) {
                Alert.alert('Video too long', 'Please select a video shorter than 50 seconds.');
                return;
            }

        }

    }


    const handlePress = async () => {
        const uri = await captureRef(imageRef, {
            format: 'png',
            quality: 1,
        });
        console.log("uri", uri);

    }

    useEffect(() => {
        if (status == 'readyToPlay') {
            const generateThumbnail = async () => {
                try {
                    const thumbnails = await player.generateThumbnailsAsync([1]);
                    if (thumbnails && thumbnails.length > 0) {
                        const thumbnailUri = thumbnails[0]

                        setThumbnail(thumbnailUri as any)
                        console.log("thumbnailUri", thumbnailUri, "uri");
                        setTimeout(() => {
                            if (duration > 0) {

                                handlePress()
                            }
                        }, 1500);
                    }
                } catch (e) {
                    console.log("Thumbnail generation failed:", e);
                }
            };
            generateThumbnail();
        }
    }, [status]);


    const handleGetToken = async () => {

    }



    return (
        <BackgroundContainer paddingVertical={0}>
            {thumbnail && (
                <ExpoImage
                    ref={imageRef}
                    source={thumbnail}
                    style={{ width: 200, height: 120, borderRadius: 10, position: 'absolute', top: -500, }}
                    contentFit="cover"
                />
            )}
            {/* Fixed Banner - stays visible during scroll */}
            <Animated.View style={[styles.bannerContainer, { height: bannerHeight }]}>
                <Banner
                    hasAddStoryBtn={false}
                    onPressStoryBtn={() => handleAddStory()}
                    onPressLogo={() => {
                        // router.push({
                        //     pathname: "/(stories)/storyView",
                        //     params: { type: "(brand)/brandHome" },
                        // })
                    }}
                    hasNotificationIcon={false}
                    hasBackButton={false}
                    hasLogo={true}
                    logoSlider={scrollY.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, -20], // how much BrandTabs should move up
                        extrapolate: 'clamp',
                    })}
                />
            </Animated.View>


            {/* Scrollable Content */}
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                {/* Spacer to account for fixed header */}
                <View style={styles.headerSpacer} />
                <View style={styles.titleRow}>
                    <CTouchableOpacity onPress={handleGetToken}>
                        <CText style={styles.brandName}>{user.brandName}</CText>
                    </CTouchableOpacity>
                    {
                        user.isLawyerApproved && (
                            <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={primaryOrange}
                                style={styles.verifiedIcon}
                            />
                        )
                    }

                </View>
                <MetricsCard
                    title="Store Overview"
                    subtitle="Your store metrics at a glance"
                    metrics={metrics}
                />


                <MetricsGraphs></MetricsGraphs>

            </Animated.ScrollView>

        </BackgroundContainer>

    );
};

const styles = StyleSheet.create({
    video: {
        width: 500,
        height: 275,
    },
    brandNameOverlay: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    brandName: {
        fontSize: 24,
        fontFamily: 'PoppinsSemiBold',
        color: '#000',
    },

    brandNameContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    verifiedIcon: {
        marginTop: -12,
    },
    sectionHeader: {
        top: 30,
        left: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    viewAll: {
        fontSize: 14,
        right: 25,
        fontFamily: 'PoppinsMedium',
        color: '#FF8C00', // you can use your primary orange or brand color
        textDecorationLine: 'underline',
    },

    sectionTitle: {
        fontSize: 15,
        fontFamily: 'PoppinsSemiBold',
        color: '#333',
    },

    bannerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        zIndex: 1,
    },
    productContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap"
    },
    fixedBrandHeader: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 7,
    },
    headerSpacer: {
        height: HEADER_HEIGHT + 10,
    },
});

export default BrandProfile;
