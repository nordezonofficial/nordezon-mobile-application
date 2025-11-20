import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import CTouchableOpacity from '../common/CTouchableOpacity';
import FullScreenPopup from '../common/FullScreen';

const { width } = Dimensions.get('window');

// Dummy image data
const IMAGES = [
    require('@/assets/images/bazar/1.png'),
    require('@/assets/images/bazar/2.jpg'),
    require('@/assets/images/bazar/3.jpeg'),
    require('@/assets/images/bazar/4.jpeg'),
    require('@/assets/images/bazar/4.jpeg'),
    require('@/assets/images/bazar/5.jpeg'),
    require('@/assets/images/bazar/2.jpg'),
    require('@/assets/images/bazar/3.jpeg'),
    require('@/assets/images/bazar/4.jpeg'),
    require('@/assets/images/bazar/4.jpeg'),
    require('@/assets/images/bazar/5.jpeg'),
    require('@/assets/images/bazar/6.jpg'),
    require('@/assets/images/bazar/7.jpeg'),
    require('@/assets/images/bazar/8.jpg'),
    require('@/assets/images/bazar/9.jpg'),
    require('@/assets/images/bazar/10.jpg'),
    require('@/assets/images/bazar/5.jpeg'),
    require('@/assets/images/bazar/6.jpg'),
    require('@/assets/images/bazar/7.jpeg'),
    require('@/assets/images/bazar/8.jpg'),
    require('@/assets/images/bazar/9.jpg'),
    require('@/assets/images/bazar/8.jpg'),
    require('@/assets/images/bazar/10.jpg'),
    require('@/assets/images/bazar/9.jpg'),
    require('@/assets/images/bazar/5.jpeg'),
    require('@/assets/images/bazar/6.jpg'),
    require('@/assets/images/bazar/10.jpg'),
    require('@/assets/images/bazar/5.jpeg'),
    require('@/assets/images/bazar/7.jpeg'),
    require('@/assets/images/bazar/6.jpg'),
    require('@/assets/images/bazar/7.jpeg'),
    require('@/assets/images/bazar/8.jpg'),
    require('@/assets/images/bazar/9.jpg'),
    require('@/assets/images/bazar/10.jpg'),
    require('@/assets/images/bazar/10.jpg'),
    require('@/assets/images/bazar/7.jpeg'),
    require('@/assets/images/bazar/8.jpg'),
    require('@/assets/images/bazar/9.jpg'),
    require('@/assets/images/bazar/10.jpg'),
    require('@/assets/images/bazar/8.jpg'),
    require('@/assets/images/bazar/9.jpg'),
    require('@/assets/images/bazar/10.jpg'),
];

// Split images into groups of 6 (3 per row × 2 rows)
const chunkArray = (arr: any[], size: number) =>
    arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

const groupedImages = chunkArray(IMAGES, 6);

// Example bazar titles for each slide
const BAZAR_TITLES = [
    'Karachi Bazar',
    'Lahore Bazar',
    'Islamabad Bazar',
    'Rawalpindi Bazar',
    'Multan Bazar',
];

const Bazar = () => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const [fullImageVisible, setFullImageVisible] = useState(false);

    // Auto-scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % groupedImages.length;
            flatListRef.current?.scrollToOffset({
                offset: nextIndex * width,
                animated: true,
            });
            setCurrentIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const renderSlide = ({ item, index }: { item: any[]; index: number }) => (
        <View style={styles.slideContainer}>
            {/* Header section with title and "See All" */}
            <View style={styles.header}>
                <Text style={styles.title}>Farokht Bazar {BAZAR_TITLES[index % BAZAR_TITLES.length]}</Text>
                <CTouchableOpacity onPress={() => {
                    router.push('/(home)/bazarList')
                }}>
                    <Text style={styles.viewAll}>See All</Text>
                </CTouchableOpacity>
            </View>

            {/* Image grid */}
            <View style={styles.row}>
                {item.slice(0, 3).map((img, i) => (
                    <CTouchableOpacity key={i} onPress={() => {
                        setFullImageVisible(true)

                    }}>
                        <Image source={img} style={styles.image} resizeMode="cover" />
                    </CTouchableOpacity>

                ))}
            </View>
            <View style={styles.row}>
                {item.slice(3, 6).map((img, i) => (
                    <CTouchableOpacity key={i} onPress={() => {
                        setFullImageVisible(true)
                    }}>
                        <Image key={i} source={img} style={styles.image} resizeMode="cover" />
                    </CTouchableOpacity>
                ))}
            </View>
        </View>

    );

    return (
        <View style={styles.wrapper}>
            <FlatList
                ref={flatListRef}
                data={groupedImages}
                renderItem={renderSlide}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            />


            <FullScreenPopup
                brand={true}
                title={"Track Your Order"}
                oneLineDescription={"Stay updated with real-time order status from each vendor."}
                fullImageVisible={fullImageVisible}
                setFullImageVisible={setFullImageVisible}
                image={require('@/assets/images/post.jpg')}
            ></FullScreenPopup>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: "98%",
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 15,
        fontFamily: "PoppinsSemiBold",

        color: '#000',
    },
    viewAll: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    slideContainer: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    image: {
        width: (width - 60) / 3, // adds more space between images
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        marginHorizontal: 5, // little gap between images
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
});

export default Bazar;
