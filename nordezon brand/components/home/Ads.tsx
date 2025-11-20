import { primaryGreen } from '@/constants/colors';
import { useGetAdsListQuery } from '@/store/api/v1/ads';
import { setAdsList } from '@/store/slices/ads';
import { setSelectedEntity } from '@/store/slices/post';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CText from '../common/CText';
import CTouchableOpacity from '../common/CTouchableOpacity';

// Skeleton Loader component for loading state
const SkeletonCard = () => {
    const { width } = Dimensions.get('window');
    return (
        <View style={[styles.slide, { overflow: 'hidden' }]}>
            <View
                style={[
                    styles.skeletonImage,
                    {
                        width: width * 0.92,
                        height: 140,
                        backgroundColor: '#ececec',
                        borderRadius: 12,
                        marginBottom: 10
                    }
                ]}
            />
            <View
                style={[
                    styles.skeletonButton,
                    {
                        width: 100,
                        height: 32,
                        backgroundColor: '#e2e2e2',
                        borderRadius: 5
                    }
                ]}
            />
        </View>
    );
};

const { width } = Dimensions.get('window');
const SLIDE_INTERVAL = 3500;

const Ads = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList | null>(null);
    const { data, isLoading } = useGetAdsListQuery({});
    const dispatch = useDispatch();
    const { ads } = useSelector((state: any) => state.ads);

    useEffect(() => {
        if (data && data.status === 'success') {
            dispatch(setAdsList(data.data));
        }
    }, [data, dispatch]);

    // Only setup the interval slider if there are ads
    useEffect(() => {
        if (!ads || ads.length === 0) return;

        const interval = setInterval(() => {
            if (ads.length === 0) return;

            let nextIndex = (activeIndex + 1) % ads.length;
            setActiveIndex(nextIndex);
            if (
                flatListRef.current &&
                typeof nextIndex === 'number' &&
                !isNaN(nextIndex)
            ) {
                flatListRef.current.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            }
        }, SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, [activeIndex, ads.length]);

    const onMomentumScrollEnd = (event: any) => {
        const current =
            Math.round(event.nativeEvent.contentOffset.x / width) || 0;
        setActiveIndex(current);
    };

    // Shared function for both card and button
    const handleAdPress = (item: any) => {
        console.log("item.postId", item.postId);

        dispatch(setSelectedEntity({
            id: item.postId,
            requestType: "POST"
        }))
        router.push({
            pathname: '/(home)/productDetail',
            params: {
                id: item.postId
            }
        });
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.slide}>
            <CTouchableOpacity
                style={{ width: width * 0.92, borderRadius: 12, overflow: 'hidden' }}
                onPress={() => handleAdPress(item)}
                activeOpacity={0.8}
            >
                <Image
                    source={{ uri: item.banner }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </CTouchableOpacity>
            <CTouchableOpacity
                style={styles.shopNowButton}
                onPress={() => handleAdPress(item)}
                activeOpacity={0.85}
            >
                <Ionicons
                    name="cart-outline"
                    size={19}
                    color={'#fff'}
                    style={{ marginRight: 5 }}
                />
                <Text style={styles.shopNowText}>Shop now</Text>
            </CTouchableOpacity>
        </View>
    );

    const keyExtractor = (item: any, index: number) =>
        (item.id || '') + '-' + index;

    // Show skeleton loading cards instead of ActivityIndicator
    return (
        <View style={styles.sliderContainer}>
            <CText style={styles.title}>Featured Brand Promotions</CText>
            {isLoading ? (
                <FlatList
                    data={[1, 2, 3]}
                    horizontal
                    renderItem={() => <SkeletonCard />}
                    keyExtractor={(_, idx) => `skeleton-${idx}`}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollView}
                />
            ) : ads && ads.length > 0 ? (
                <>
                    <FlatList
                        ref={flatListRef}
                        data={ads}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        scrollEventThrottle={16}
                        style={styles.scrollView}
                        getItemLayout={(_, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        initialScrollIndex={activeIndex}
                    />
                    <View style={styles.dotsContainer}>
                        {ads.map((_: any, idx: number) => (
                            <View
                                key={idx}
                                style={[
                                    styles.dot,
                                    activeIndex === idx
                                        ? styles.activeDot
                                        : styles.inactiveDot,
                                ]}
                            />
                        ))}
                    </View>
                </>
            ) : (
                !isLoading && (
                    <View
                        style={{
                            height: 150,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text>No Promotions Available</Text>
                    </View>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        fontFamily: 'PoppinsSemiBold',
        color: '#000',
        marginBottom: 5,
        letterSpacing: 0.8,
        // textTransform: 'uppercase',
        // textAlign: 'center',
        paddingHorizontal: 15,
    },
    sliderContainer: {
        width: '100%',
        height: 200,
        marginTop: 10,
        // alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        width: width,
        height: 150,
    },
    slide: {
        width: width,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: width * 0.92,
        height: 140,
        borderRadius: 12,
        alignSelf: 'center',
    },
    shopNowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 15,
        left: 28,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    shopNowText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    dot: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: primaryGreen,
    },
    inactiveDot: {
        backgroundColor: '#ebebeb',
    },
    skeletonImage: {
        marginTop: 0,
        marginBottom: 0,
    },
    skeletonButton: {
        marginTop: 10,
    },
});

export default Ads;