import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import { primaryGreen } from '@/constants/colors';
import { currencySymbol } from '@/constants/keys';
import { capitalizeFirstLetter, getStatusColor } from '@/helpers';
import { setOrderId } from '@/store/slices/orders';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

const { width } = Dimensions.get('window');

const initialOrder = {
    orderId: 'ORD-12345',
    totalAmount: 4500,
    date: '2025-11-08',
    status: 'DELIVERED',
    images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    ],
};

function statusToObj(status: string) {
    switch ((status || '').toUpperCase()) {
        case 'PENDING':
            return {
                key: 'PENDING',
                label: 'Pending',
                color: getStatusColor(status),
                icon: 'time-outline',
            };
        case 'PROCESSING':
            return {
                key: 'PROCESSING',
                label: 'Processing',
                color: getStatusColor(status),
                icon: 'settings-outline',
            };
        case 'SHIPPED':
            return {
                key: 'SHIPPED',
                label: 'Shipped',
                color: getStatusColor(status),
                icon: 'car-outline',
            };
        case 'DELIVERED':
            return {
                key: 'DELIVERED',
                label: 'Delivered',
                color: getStatusColor(status),
                icon: 'checkmark-done-circle-outline',
            };
        case 'CANCELLED':
            return {
                key: 'CANCELLED',
                label: 'Cancelled',
                color: getStatusColor(status),
                icon: 'close-circle-outline',
            };
        default:
            return {
                key: status || 'PENDING',
                label: status || 'Pending',
                color: getStatusColor(status),
                icon: 'time-outline',
            };
    }
}

// Format date utility
function formatDate(date: any) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate()}`.padStart(2, '0') +
        '/' +
        `${d.getMonth() + 1}`.padStart(2, '0') +
        '/' +
        d.getFullYear();
}

// Clamp aspect ratio between 6/8 and 8/6
const clampImageRatio = (aspectRatio: number) => {
    const minRatio = 6 / 8;
    const maxRatio = 8 / 6;
    if (aspectRatio < minRatio) return minRatio;
    if (aspectRatio > maxRatio) return maxRatio;
    return aspectRatio;
};

const SLIDER_RATIO = { width: 8, height: 6 };

const ImageSlider = ({ images }: { images: string[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageAspectRatios, setImageAspectRatios] = useState<number[]>([]);

    useEffect(() => {
        let isMounted = true;
        Promise.all(
            images.map(
                uri =>
                    new Promise<number>(resolve => {
                        Image.getSize(
                            uri,
                            (w, h) => {
                                if (w > 0 && h > 0) {
                                    resolve(clampImageRatio(w / h));
                                } else {
                                    resolve(clampImageRatio(SLIDER_RATIO.width / SLIDER_RATIO.height));
                                }
                            },
                            () => resolve(clampImageRatio(SLIDER_RATIO.width / SLIDER_RATIO.height)) // fallback
                        );
                    })
            )
        ).then(ratios => {
            if (isMounted) setImageAspectRatios(ratios);
        });
        return () => {
            isMounted = false;
        };
    }, [images]);

    // Always use slider area with exact 8:6 ratio (constrained by width)
    const sliderWidth = width;
    const sliderHeight = Math.round(sliderWidth * SLIDER_RATIO.height / SLIDER_RATIO.width);

    // Manual navigation arrows only, no swiping
    const scrollToIndex = (idx: number) => {
        if (idx >= 0 && idx < images.length) {
            setActiveIndex(idx);
        }
    };

    const aspectRatio = imageAspectRatios[activeIndex] ?? clampImageRatio(SLIDER_RATIO.width / SLIDER_RATIO.height);
    let imgW = sliderWidth * 0.95;
    let imgH = imgW / aspectRatio;
    if (imgH > sliderHeight) {
        imgH = sliderHeight * 0.95;
        imgW = imgH * aspectRatio;
    }

    return (
        <View style={[styles.sliderContainer, { height: sliderHeight }]}>
            <View
                style={{
                    height: sliderHeight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#eee',
                }}
            >
                <Image
                    source={{ uri: images[activeIndex] }}
                    style={{
                        width: imgW,
                        height: imgH,
                    }}
                    resizeMode="contain"
                />
            </View>

            {/* Left Arrow */}
            {/* {activeIndex > 0 && ( */}
            <TouchableOpacity style={styles.leftArrow} onPress={() => scrollToIndex(activeIndex - 1)}>
                <Ionicons name="chevron-back" size={23} color="#fff" />
            </TouchableOpacity>
            {/* )} */}
            {/* Right Arrow */}
            {/* {activeIndex < images.length - 1 && ( */}
            <TouchableOpacity style={styles.rightArrow} onPress={() => scrollToIndex(activeIndex + 1)}>
                <Ionicons name="chevron-forward" size={23} color="#fff" />
            </TouchableOpacity>
            {/* )} */}

            {/* Dots */}
            <View style={styles.dots}>
                {images.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            i === activeIndex ? styles.activeDot : null
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const OrderGroup = ({ item, hasShowImages = true }: {
    item: any,
    hasShowImages?: boolean

}) => {
    const order = initialOrder;
    const statusObj = statusToObj(order.status);
    const [showSlider, setShowSlider] = useState(false);
    const [postImages, setPostImages] = useState([])
    const handleToggleSlider = () => setShowSlider((s) => !s);
     
    useEffect(() => {
        if (hasShowImages) {
            let images = item.orders.flatMap((order: any) =>
                order.items.map((it: any) => it.post.url)
            );
    
            setPostImages(images);
        }
    }, [hasShowImages, item]);

    
    const dispatch = useDispatch()
    return (
        <CTouchableOpacity style={styles.cardShadow} onPress={() => {
            dispatch(setOrderId(item.id))
            router.push('/(home)/orderDetail')
        }}>
            <View style={styles.orderInfoCard}>
                {/* Status Badge at Top-Left */}
                <View style={[styles.statusTopLeftWrapper, {
                    right: !hasShowImages ? 10 : undefined,
                    left: hasShowImages ? 14 : undefined,
                }]}>
                    <View style={[styles.overallStatusBadge, { borderColor: '#eaeaea', marginLeft: 0 }]}>
                        <Ionicons name={statusObj.icon as any} size={16} color={getStatusColor(item.status)} style={{ marginRight: 5 }} />
                        <CText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {capitalizeFirstLetter(item.status)}
                        </CText>
                    </View>
                </View>

                {/* Show/Hide image slider toggle */}
                {
                    hasShowImages && (
                        <CTouchableOpacity
                            onPress={handleToggleSlider}
                            activeOpacity={0.7}
                            style={styles.toggleSliderBtn}
                        >
                            <Text style={styles.toggleSliderBtnText}>
                                {showSlider ? 'Hide Images' : 'Show Images'}
                            </Text>
                            <Ionicons
                                name={showSlider ? "chevron-up-outline" : "chevron-down-outline"}
                                size={17}
                                color={primaryGreen}
                                style={{ marginLeft: 4 }}
                            />
                        </CTouchableOpacity>
                    )
                }


                {hasShowImages && showSlider && <ImageSlider images={postImages} />}

                {/* Order header information */}
                <View style={styles.headerRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Ionicons name="receipt-outline" size={21} color={primaryGreen} style={{ marginRight: 6 }} />
                        <Text style={styles.orderIdText}>Order #{item?.orderId}</Text>
                    </View>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={15} color="#bbb" style={{ marginRight: 3 }} />
                    <Text style={styles.orderInfoDetail}>{formatDate(item.createdAt)}</Text>
                    <Ionicons name="cash-outline" size={16} color={primaryGreen}
                        style={{ marginRight: 3, marginLeft: 15 }} />
                    <Text style={[styles.orderInfoDetail, styles.priceText]}>
                        {currencySymbol} {item?.totalAmount}
                    </Text>
                </View>
            </View>
        </CTouchableOpacity >
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        borderRadius: 13,
        marginVertical: 4,
        marginHorizontal: 2,
    },
    orderInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 13,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1.2,
        borderColor: '#f3e8e0',
        minHeight: 60,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    sliderContainer: {
        width: '100%',
        height: Math.round(Dimensions.get('window').width * 6 / 8),  // for fallback, but it's controlled inline as well
        borderRadius: 11,
        overflow: 'hidden',
        marginBottom: 10,
        backgroundColor: '#eee',
        position: 'relative',
    },
    // sliderImage style is kept for compatibility but not directly used here
    sliderImage: {
        width: width,
        height: 200,
        borderRadius: 11,
    },
    leftArrow: {
        position: 'absolute',
        top: '45%',
        left: 12,
        backgroundColor: 'rgba(40,40,50,0.6)',
        borderRadius: 24,
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    rightArrow: {
        position: 'absolute',
        top: '45%',
        right: 12,
        backgroundColor: 'rgba(40,40,50,0.6)',
        borderRadius: 24,
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    dots: {
        position: 'absolute',
        bottom: 14,
        left: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#bbb',
        marginHorizontal: 3,
        opacity: 0.6,
    },
    activeDot: {
        backgroundColor: primaryGreen,
        opacity: 1,
        width: 14,
        height: 8,
        borderRadius: 5,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    orderIdText: {
        color: primaryGreen,
        fontSize: 17,
        fontFamily: 'PoppinsSemiBold',
        letterSpacing: 0.1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 1,
        justifyContent: 'flex-start'
    },
    orderInfoDetail: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
    },
    priceText: {
        fontWeight: 'bold',
        fontSize: 15.4,
        color: '#111',
        marginLeft: 1,
    },
    overallStatusBadge: {
        flexDirection: 'row',

        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 8,
        minWidth: 70,
        minHeight: 22,
        marginLeft: 5
    },
    statusText: {
        fontFamily: 'PoppinsMedium',
        fontSize: 13,
        letterSpacing: 0.13,
    },
    toggleSliderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginBottom: 2,
        marginTop: 0,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 7,
        backgroundColor: '#E9F6F7',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 2,
    },
    toggleSliderBtnText: {
        color: primaryGreen,
        fontFamily: 'PoppinsMedium',
        fontSize: 13.4
    },
    statusTopLeftWrapper: {
        position: 'absolute',
        top: 10,
        zIndex: 10,
    },
});

export default OrderGroup;