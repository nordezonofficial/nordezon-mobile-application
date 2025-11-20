import { primaryOrange } from '@/constants/colors';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import CTouchableOpacity from '../common/CTouchableOpacity';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 140;
const CARD_MARGIN = 18;
const VISIBLE_CARDS = Math.floor(SCREEN_WIDTH / (CARD_WIDTH + CARD_MARGIN)) + 1;
const AUTO_SCROLL_INTERVAL = 15;
const BASE_AUTO_SCROLL_SPEED = 0.7;

type BrandsLogoSliderProps = {
    list: any;
    onLoadMore?: () => void;
    poppedOut?: boolean;
};

const BrandsLogoSlider = ({
    list,
    onLoadMore,
    poppedOut = false,
}: BrandsLogoSliderProps) => {
    const flatListRef = useRef<FlatList>(null);
    const [scrollX] = useState(new Animated.Value(0));
    const scrollPos = useRef(0);
    const prevListLength = useRef<number>(list.length); // Used to detect data changes
    const [autoScroll, setAutoScroll] = useState(true);

    // Detect loading state
    const isLoading = list == null || (Array.isArray(list) && list.length === 0);

    const startAutoScroll = useCallback(() => setAutoScroll(true), []);
    const stopAutoScroll = useCallback(() => setAutoScroll(false), []);

    const autoScrollSpeed = poppedOut ? BASE_AUTO_SCROLL_SPEED * 1.60 : BASE_AUTO_SCROLL_SPEED;

    // --- Core Change: Smart auto-scroll with data fetch handling ---
    useEffect(() => {
        if (!autoScroll || isLoading) return;
        let timer: any;
        let isUnmounting = false;
        let handledEnd = false; // avoid double-firing

        const tick = () => {
            if (!flatListRef.current || isUnmounting || !autoScroll || isLoading) return;

            scrollPos.current += autoScrollSpeed;
            flatListRef.current.scrollToOffset({
                offset: scrollPos.current,
                animated: false,
            });

            // Calculate the end threshold
            const maxScroll =
                (list.length - VISIBLE_CARDS) * (CARD_WIDTH + CARD_MARGIN);

            // If we've reached the end threshold:
            if (
                scrollPos.current >= maxScroll &&
                list.length > 0
            ) {
                // Only fire handleEnd logic once per "end hit"
                if (!handledEnd) {
                    handledEnd = true;
                    // Fire parent fetch
                    if (typeof onLoadMore === 'function') {
                        onLoadMore();
                    }
                }

                // Give the parent time to load more; after a slight delay, check if more data came in:
                setTimeout(() => {
                    if (isUnmounting) return;

                    // If list length changed, let scroll continue forward
                    if (prevListLength.current !== list.length) {
                        prevListLength.current = list.length;
                        // let scrolling proceed, do not reset position
                        handledEnd = false;
                    } else {
                        // No new data: reset back to start for infinite loop
                        scrollPos.current = 0;
                        flatListRef.current?.scrollToOffset({
                            offset: 0,
                            animated: false,
                        });
                        handledEnd = false; // so onLoadMore will fire next loop too
                    }
                    // Continue scrolling
                    timer = setTimeout(tick, AUTO_SCROLL_INTERVAL);
                }, 400); // enough time to let parent/Redux update (may tune as needed)
                return; // wait for this timeout, don't schedule next tick yet!
            } else {
                handledEnd = false;
            }

            timer = setTimeout(tick, AUTO_SCROLL_INTERVAL);
        };

        timer = setTimeout(tick, AUTO_SCROLL_INTERVAL);

        return () => {
            isUnmounting = true;
            clearTimeout(timer);
        };
    }, [autoScroll, list.length, autoScrollSpeed, onLoadMore, isLoading]);

    useEffect(() => {
        // If list data changes, update prevListLength
        prevListLength.current = list.length;
    }, [list.length]);

    const onUserScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollPos.current = event.nativeEvent.contentOffset.x;
    };

    // Keep handleEndReached for manual user scrolls (not used in auto but kept for consistency)
    const handleEndReached = useCallback(() => {
        if (typeof onLoadMore === 'function') {
            onLoadMore();
        }
    }, [onLoadMore]);

    const wrapperStyle = [
        styles.wrapper,
    ];

    return (
        <View style={wrapperStyle}>
            <View style={styles.container}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={primaryOrange} />
                    </View>
                ) : (
                    <Animated.FlatList
                        ref={flatListRef}
                        data={list}
                        keyExtractor={(_, idx) => 'brand-' + idx}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        scrollEnabled={true}
                        renderItem={({ item }) => (
                            <CTouchableOpacity
                                onPress={() => {
                                    router.push('/(home)/brandProfileVisit');
                                }}
                                onLongPress={stopAutoScroll}
                                onPressOut={startAutoScroll}
                            >
                                <View style={styles.cardShadow}>
                                    <View style={styles.card}>
                                        <Image
                                            source={{ uri: item.logoUrl }}
                                            style={styles.image}
                                            resizeMode="contain"
                                            accessibilityIgnoresInvertColors
                                        />
                                        <Text style={styles.brandName}>{item.brandName}</Text>
                                    </View>
                                </View>
                            </CTouchableOpacity>
                        )}
                        contentContainerStyle={styles.flatListPadding}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            {
                                useNativeDriver: false,
                                listener: onUserScroll,
                            }
                        )}
                        scrollEventThrottle={16}
                        onTouchStart={stopAutoScroll}
                        onMomentumScrollEnd={startAutoScroll}
                        onScrollBeginDrag={stopAutoScroll}
                        onScrollEndDrag={startAutoScroll}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.3}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        // alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#000',
        marginBottom: 10,
        letterSpacing: 0.8,
        paddingHorizontal: 15,
   
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        overflow: 'hidden',
    },
    flatListPadding: {
        paddingHorizontal: 7,
    },
    cardShadow: {
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: 100,
        height: 32,
        borderColor: primaryOrange,
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        backgroundColor: '#fff',
    },
    image: {
        height: 30,
        borderRadius: 50,
        width: 30,
        resizeMode: "cover",
        left: -5,
    },
    brandName: {
        fontSize: 10,
        fontWeight: '500',
        color: '#383838',
        marginLeft: 2,
        fontFamily: 'PoppinsRegular',
        flexShrink: 1,
    },
    loadingContainer: {
        width: 120,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
});

export default BrandsLogoSlider;
