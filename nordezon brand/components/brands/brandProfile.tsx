import Banner from '@/components/brands/Banner';
import BrandHeader from '@/components/brands/BrandHeader';
import BrandTabs from '@/components/brands/BrandTabs';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { height, width } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.25;
const MIN_BANNER_HEIGHT = 120; // Increased minimum height to keep banner more visible

const BrandProfile = () => {
    const scrollY = useRef(new Animated.Value(0)).current;

    const bannerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT - MIN_BANNER_HEIGHT],
        outputRange: [HEADER_HEIGHT, MIN_BANNER_HEIGHT],
        extrapolate: 'clamp',
    });

    const headerTop = Animated.subtract(bannerHeight, 50)

    const bioOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const [bioVisibleValue, setBioVisibleValue] = useState(1);

    const bioVisible = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        const listenerId = bioVisible.addListener(({ value }) => {
            setBioVisibleValue(value);
        });

        console.log("listenerId", listenerId);
        return () => {
            bioVisible.removeListener(listenerId);
        };
    }, [bioVisible]);



    return (
        <BackgroundContainer paddingVertical={0}>

            {/* Fixed Banner - stays visible during scroll */}
            <Animated.View style={[styles.bannerContainer, { height: bannerHeight }]}>
                <Banner
                    logoSlider={scrollY.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, -20], // how much BrandTabs should move up
                        extrapolate: 'clamp',
                    })}
                />
            </Animated.View>

            {/* Fixed Brand Header - positioned below banner and stays visible */}
            <Animated.View style={[
                styles.fixedBrandHeader,
                {
                    top: bannerHeight,
                    height: scrollY.interpolate({
                        inputRange: [0, 150],
                        outputRange: [70, 120],
                        extrapolate: 'clamp',
                    }),
                },
            ]}>
                <Animated.View
                    style={{
                        height: scrollY.interpolate({
                            inputRange: [0, 80],
                            outputRange: [120, 110],
                            extrapolate: 'clamp',
                        }),

                    }}
                >
                    <BrandHeader
                        bioVisible={scrollY.interpolate({
                            inputRange: [0, 80],
                            outputRange: [1, 0],
                            extrapolate: 'clamp',
                        })}
                        name="Denka Official Store"
                        bio="Bringing you the finest quality and design — explore our premium collections crafted to elevate your style every day."
                        bioOpacity={bioOpacity}
                        onMessagePress={() => console.log('Message button pressed')}
                    />

                </Animated.View>

                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY: scrollY.interpolate({
                                    inputRange: [0, 150],
                                    outputRange: [0, -70], // how much BrandTabs should move up
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],

                    }}
                >
                    <BrandTabs />

                </Animated.View>
            </Animated.View>

            {/* Scrollable Content */}
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

                {/* Catalog Banner */}
                {/* <CatelogBanner /> */}

                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <CText style={styles.sectionTitle}>New Arrivals</CText>
                    <CTouchableOpacity onPress={() => { }}>
                        <CText style={styles.viewAll}>view all</CText>
                    </CTouchableOpacity>

                </View>

                {/* Product Grid */}
            </Animated.ScrollView>

        </BackgroundContainer>

    );
};

const styles = StyleSheet.create({
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
        zIndex: 2,
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
        height: HEADER_HEIGHT + 200,
    },
});

export default BrandProfile;
