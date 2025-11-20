import Banner from '@/components/brands/Banner';
import BrandHeader from '@/components/brands/BrandHeader';
import BrandTabs from '@/components/brands/BrandTabs';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import { posts, products } from '@/constants/common';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import BrandAboutUs from '../brands/BrandAboutUs';
import Post from '../brands/posts/Post';
import Product from '../brands/Product';
type TabType = 'POSTS' | 'CATALOGUE' | 'ABOUT US' | 'REELS' | 'STORIES';

const { height, width } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.25;
const MIN_BANNER_HEIGHT = 120;

const BrandProfileVisit = () => {
    const scrollY = useRef(new Animated.Value(0)).current;

    const bannerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT - MIN_BANNER_HEIGHT],
        outputRange: [HEADER_HEIGHT, MIN_BANNER_HEIGHT],
        extrapolate: 'clamp',
    });

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

        // console.log("listenerId", listenerId);
        return () => {
            bioVisible.removeListener(listenerId);
        };
    }, [bioVisible]);

    const [activeTab, setAactiveTab] = useState<TabType>("POSTS");

    // Prepare data for FlatList (show POSTS, CATALOGUE, REELS, STORIES)
    const data =
        activeTab === "POSTS"
            ? posts
            : activeTab === "CATALOGUE"
                ? products as any
                : activeTab === "REELS"
                    ? products as any
                    : activeTab === "STORIES"
                        ? products as any
                        : [];

    // Used to render the right component for each tab
    const renderListItem = ({ item }: any) => {
        if (activeTab === "POSTS") {
            return (
                <Post
                    hasActionButtons={false}
                    item={item}
                    overlayButtons={false}
                    hasEyes
                    isReel={item.title?.includes('Reel')}
                    isStory={item.title?.includes('Story')}
                    handlePressOverLay={(type, post) => console.log(type, post)}
                    onPressPost={(post) => console.log('Open Post:', post)}
                    setSnackbarVisible={() => { }}
                    setSnackbarMessage={() => { }}
                    setSnackbarType={() => { }}
                />
            );
        } else if (activeTab === "CATALOGUE") {
            return (
                <Product
                    overlayButtons={false}
                    hasEyes
                    item={item}
                    onPress={() => { }}
                    handlePressOverLay={() => { }}
                    setSnackbarVisible={() => { }}
                    setSnackbarMessage={() => { }}
                    setSnackbarType={() => { }}
                />
            );
        } else if (activeTab == "REELS") {
            return (
                <Post
                    hasActionButtons={false}
                    item={item}
                    overlayButtons={false}
                    hasEyes
                    isReel={item.title?.includes('Reel')}
                    isStory={item.title?.includes('Story')}
                    handlePressOverLay={(type, post) => console.log(type, post)}
                    onPressPost={(post) => console.log('Open Post:', post)}
                    setSnackbarVisible={() => { }}
                    setSnackbarMessage={() => { }}
                    setSnackbarType={() => { }}
                />
            );
        } else if (activeTab == "STORIES") {
            return (
                <Post
                    hasActionButtons={false}
                    item={item}
                    overlayButtons={false}
                    hasEyes
                    isReel={item.title?.includes('Reel')}
                    isStory={item.title?.includes('Story')}
                    handlePressOverLay={(type, post) => console.log(type, post)}
                    onPressPost={(post) => console.log('Open Post:', post)}
                    setSnackbarVisible={() => { }}
                    setSnackbarMessage={() => { }}
                    setSnackbarType={() => { }}
                />
            );
        }
        // Remove ListItem rendering for ABOUT US:
        return null;
    };

    return (
        <BackgroundContainer paddingVertical={0} paddingHorizontal={0}>
            {/* Fixed Banner - stays visible during scroll */}
            <Animated.View style={[styles.bannerContainer, { height: bannerHeight }]}>
                <Banner
                    logoSlider={scrollY.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, -20],
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
                                    outputRange: [0, -40],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    <BrandTabs
                        activeTab={activeTab}
                        onTabChange={setAactiveTab}
                    />
                </Animated.View>
            </Animated.View>

            {/* Scrollable Content */}
            {activeTab === "ABOUT US" ? (
                <Animated.ScrollView
                    style={styles.aboutUsContainer}
                    contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 170, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                >
                    <BrandAboutUs />
                </Animated.ScrollView>
            ) : (
                <Animated.FlatList
                    data={data}
                    contentContainerStyle={styles.flatList}
                    keyExtractor={(item, index: number) => index.toString()}
                    key={
                        activeTab === "POSTS"
                            ? 'POSTS'
                            : activeTab === "CATALOGUE"
                                ? 'CATALOGUE'
                                : activeTab === "REELS"
                                    ? 'REELS'
                                    : activeTab === "STORIES"
                                        ? 'STORIES'
                                        : 'DEFAULT'
                    }
                    numColumns={
                        activeTab === "CATALOGUE"
                            ? 2
                            : 3
                    }
                    renderItem={renderListItem}
                    ListHeaderComponent={<View style={styles.headerSpacer} />}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false }
                    )}
                    ListEmptyComponent={null}
                />
            )}
        </BackgroundContainer>
    );
};

const styles = StyleSheet.create({
    flatList: {
        marginBottom: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    aboutUsContainer: {
        flex: 1,
        backgroundColor: 'white',
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
        color: '#FF8C00',
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
        height: HEADER_HEIGHT + 170,
    },
});

export default BrandProfileVisit;
