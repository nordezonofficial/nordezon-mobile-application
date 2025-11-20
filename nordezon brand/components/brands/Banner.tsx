import { primaryOrange } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import CText from '../common/CText';
import CTouchableOpacity from '../common/CTouchableOpacity';
import NotificationBox from '../common/NotificationBox';
const { width, height } = Dimensions.get('window');

interface BannerProps {
    onBackPress?: () => void;
    onPressLogo?: () => void;
    onPressStoryBtn?: () => void;
    logoUri?: string;
    logoSlider?: any;
    hasBackButton?: boolean
    hasAddStoryBtn?: boolean
    hasLogo?: boolean
    hasNotificationIcon?: boolean
    backgroundImages?: any[]; // New prop for custom images
    autoSlideInterval?: number; // New prop for slide interval

}

const Banner: React.FC<BannerProps> = ({
    onBackPress,
    onPressLogo,
    logoUri,
    logoSlider,
    hasBackButton = true,
    hasAddStoryBtn = false,
    hasLogo = true,
    hasNotificationIcon = false,
    onPressStoryBtn,
    backgroundImages = [],
    autoSlideInterval = 4000 // Default 4 seconds
}) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const { user } = useSelector((state: any) => state.user)

    const images = user?.bannerUrls?.length > 0 ? user.bannerUrls : backgroundImages || [];
    
    
    const logo = user.logoUrl ? user.logoUrl : logoUri;

    // Auto-slide effect
    useEffect(() => {
        if (images && images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % images.length;

                // Scroll to the next image
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({
                        x: nextIndex * width,
                        animated: true,
                    });
                }

                return nextIndex;
            });
        }, autoSlideInterval);

        return () => clearInterval(interval);
    }, [images.length, autoSlideInterval]);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setCurrentImageIndex(index);
    };

    const renderDots = () => {
        if (images && images.length <= 1) return null;

        return (
            <View style={styles.dotsContainer}>
                {images.map((_: any, index: number) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentImageIndex === index ? styles.activeDot : styles.inactiveDot
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <>
            <NotificationBox
                visible={showNotifications}
                onClose={() => setShowNotifications(false)}
            />

            <View style={styles.bannerContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll}
                    scrollEventThrottle={16}
                >
                    {images.map((imageSource: any, index: number) => (
                        <ImageBackground
                            key={index}
                            source={{ uri: imageSource }}
                            style={styles.backgroundImage}
                            resizeMode="cover"
                        >
                            {/* Overlay for content - only show on current image */}
                            {index === currentImageIndex && (
                                <View style={styles.overlay}>
                                    {/* Back Button */}
                                    {hasBackButton && (
                                        <CTouchableOpacity style={styles.backButton} onPress={() => onBackPress && onBackPress()}>
                                            <Ionicons name="arrow-back" size={24} color="#000" />
                                        </CTouchableOpacity>
                                    )}

                                    {hasNotificationIcon && (
                                        <CTouchableOpacity style={styles.notificationButton} onPress={() => {
                                            setShowNotifications(true)
                                        }}>
                                            <Ionicons name="notifications-outline" size={24} color="#000" />
                                            {/* Optional: badge for unread notifications */}
                                            <View style={styles.badge}>
                                                <CText style={styles.badgeText}>3</CText>
                                            </View>
                                        </CTouchableOpacity>
                                    )}

                                    {/* Logo */}
                                    {hasLogo && (
                                        <Animated.View
                                            style={{
                                                transform: [{ translateY: logoSlider }],
                                            }}
                                        >
                                            <View style={styles.logoContainer}>
                                                <CTouchableOpacity onPress={() => onPressLogo && onPressLogo()}>
                                                    <Image
                                                        source={{ uri: logo }}
                                                        style={styles.logo}
                                                    />
                                                </CTouchableOpacity>

                                                {/* ➕ Add Story Button */}
                                                {hasAddStoryBtn && (
                                                    <CTouchableOpacity
                                                        onPress={() => onPressStoryBtn && onPressStoryBtn()}
                                                        style={styles.addButton}
                                                    >
                                                        <Ionicons name="add" size={10} color="#000" />
                                                    </CTouchableOpacity>
                                                )}
                                            </View>
                                        </Animated.View>
                                    )}
                                </View>
                            )}
                        </ImageBackground>
                    ))}
                </ScrollView>

                {/* Dots Indicator */}
                {renderDots()}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        width: width,
        height: height * 0.25,
    },
    backgroundImage: {
        width: width,
        height: height * 0.25,
        justifyContent: 'flex-end',
    },
    overlay: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    backButton: {
        position: 'absolute',
        top: 5,
        left: 10,
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: 25,
        padding: 6,
    },
    logoContainer: {
        left: 0,
        alignSelf: 'flex-end',
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: primaryOrange,
    },
    notificationButton: {
        position: 'absolute',
        top: 5,
        left: 10,
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: 25,
        padding: 6,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'PoppinsSemiBold',
    },
    addButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 12,
        padding: 4,
        borderWidth: 2,
        borderColor: primaryOrange, // white border like Instagram
        elevation: 3,
        backgroundColor: '#fff',
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: primaryOrange,
    },
    inactiveDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});

export default Banner;
