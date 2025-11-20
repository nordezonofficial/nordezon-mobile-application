import CButton from '@/components/common/CButton'
import ColorList from '@/components/common/ColorList'
import CText from '@/components/common/CText'
import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import FullScreenPopup from '@/components/common/FullScreen'
import HRLineFullWidth from '@/components/common/HRLineFullWidth'
import ProductVariantSelectionModal from '@/components/common/product/ProductVariantSelectionModal'
import { primaryGreen, primaryOrange } from '@/constants/colors'
import { sizeOrder } from '@/constants/common'
import { currencySymbol } from '@/constants/keys'
import { isAllOptionsSelected, isOptionAvailable } from '@/helpers'
import { useAddToCartMutation } from '@/store/api/v1/cart'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
    Animated, Dimensions,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { useSelector } from 'react-redux'

// Skeleton Loader Component
const Skeleton = ({ style }: { style?: any }) => (
    <View
        style={[
            {
                backgroundColor: '#e0e0e0',
                borderRadius: 8,
                overflow: 'hidden',
            },
            style
        ]}
    />
)

const { width, height } = Dimensions.get('window')

const HEADER_HEIGHT = height * 0.7;
const MIN_BANNER_HEIGHT = 120;

const ProductDetail = ({
    children,
    loading
}: {
    children?: React.ReactNode,
    loading: boolean,
}) => {
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [selectedSize, setSelectedSize] = useState<string>("")
    const [fullImageVisible, setFullImageVisible] = useState(false);
    const [color, setSelectedColors] = useState<string[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState<'add' | 'buy'>('add');

    /* ----- Api function ad to cart ---*/
    const [addToCart] = useAddToCartMutation();

    const { selectedEntity } = useSelector((state: any) => state.post)

    // Preselect unique size/color if only one available
    useEffect(() => {
        if (!loading && selectedEntity?.item) {
            // Sizes
            if (Array.isArray(selectedEntity.item.size) && selectedEntity.item.size.length === 1) {
                setSelectedSize(selectedEntity.item.size[0]);
            } else if (!Array.isArray(selectedEntity.item.size) || selectedEntity.item.size.length === 0) {
                setSelectedSize("");
            }

            // Colors
            if (Array.isArray(selectedEntity.item.color) && selectedEntity.item.color.length === 1) {
                setSelectedColors([selectedEntity.item.color[0]]);
            } else if (!Array.isArray(selectedEntity.item.color) || selectedEntity.item.color.length === 0) {
                setSelectedColors([]);
            }
        }
    }, [loading, selectedEntity]);

    const sortedSizes = Array.isArray(selectedEntity?.item?.size)
        ? [...selectedEntity.item.size].sort(
            (a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
        )
        : [];


    /* --- make the payload ---*/
    const makeAddToCartOrByPayload = () => {
        let payload = {
            color: color.length > 0 ? color[0] : "",
            quantity: quantity,
            size: selectedSize,
            postId: selectedEntity?.item?.id,
        }

        return payload;
    }


    const callApiAddToCartOrOrder = async () => {
        let getPayload = makeAddToCartOrByPayload();
        if (modalAction == "add") {
            let response = await addToCart(getPayload);
        }
    }

    // Open modal for add to cart or buy actions
    const openOptionsModal = async (action: 'add' | 'buy') => {
        if (
            (isOptionAvailable('size', selectedEntity) && !selectedSize) ||
            (isOptionAvailable('color', selectedEntity) && color.length !== 1) ||
            !quantity || quantity < 1
        ) {
            setModalAction(action);
            setModalVisible(true);
        } else {
            setModalVisible(false);
            if (action === 'add') {
                await callApiAddToCartOrOrder();
                router.push('/(home)/cart');
            } else if (action === 'buy') {
                // router.push('/(home)/cart');
            }
        }
    };

    // Handler for modal action button
    const handleModalAction = async () => {

        if (isAllOptionsSelected(selectedSize, color, quantity, selectedEntity)) {
            setModalVisible(false);
            if (modalAction === 'add') {
                await callApiAddToCartOrOrder();
                router.push('/(home)/cart');


            } else if (modalAction === 'buy') {
                // router.push('/(home)/cart');
            }
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* Top image skeleton */}
                <Skeleton style={{ width: width, height: HEADER_HEIGHT }} />
                <View style={[styles.sheetContainer, {
                    position: "relative",
                    top: 0,
                    marginTop: -28,
                    shadowOpacity: 0,
                    elevation: 0,
                }]}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                        <Skeleton style={{ width: 36, height: 36, borderRadius: 18 }} />
                        <Skeleton style={{ width: 90, height: 18, borderRadius: 6, marginLeft: 10 }} />
                    </View>
                    <Skeleton style={{ width: '70%', height: 26, borderRadius: 5, marginBottom: 10 }} />
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                        <Skeleton style={{ width: 65, height: 20, borderRadius: 5, marginRight: 10 }} />
                        <Skeleton style={{ width: 45, height: 14, borderRadius: 5 }} />
                    </View>
                    <Skeleton style={{ width: 110, height: 14, borderRadius: 5, marginBottom: 10 }} />
                    <View style={{ flexDirection: "row", marginBottom: 7 }}>
                        {Array.from(Array(4)).map((_, idx) => (
                            <Skeleton
                                key={idx}
                                style={{ width: 55, height: 33, borderRadius: 6, marginRight: 9 }}
                            />
                        ))}
                    </View>
                    <Skeleton style={{ width: 120, height: 20, borderRadius: 6, marginBottom: 6 }} />
                    <Skeleton style={{ width: 100, height: 14, borderRadius: 5, marginTop: 20, marginBottom: 7 }} />
                    <Skeleton style={{ width: '90%', height: 16, borderRadius: 4, marginBottom: 6 }} />
                    <Skeleton style={{ width: '75%', height: 16, borderRadius: 4, marginBottom: 6 }} />
                    <Skeleton style={{ width: 75, height: 14, borderRadius: 5, marginTop: 18 }} />
                    <View style={{ flexDirection: 'column', marginTop: 7 }}>
                        {Array.from(Array(2)).map((_, idx) => (
                            <View key={idx} style={{ flexDirection: "row", alignItems: "center", marginBottom: 13 }}>
                                <Skeleton style={{ width: 34, height: 34, borderRadius: 17, marginRight: 13 }} />
                                <View>
                                    <Skeleton style={{ width: 95, height: 10, borderRadius: 5, marginBottom: 5 }} />
                                    <Skeleton style={{ width: 160, height: 12, borderRadius: 5 }} />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={{ height: 75 }} />
                <View style={[
                    styles.footerActions,
                    {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "#fff",
                        borderTopColor: "#eaeaea",
                        borderTopWidth: 1,
                        zIndex: 99,
                        gap: 0,
                    }
                ]}>
                    <Skeleton style={{ width: 38, height: 40, borderRadius: 6, marginRight: 10 }} />
                    <Skeleton style={{ width: 110, height: 40, borderRadius: 6, marginRight: 10 }} />
                    <Skeleton style={{ width: "55%", height: 40, borderRadius: 6 }} />
                </View>
            </View>
        )
    }

    const flatListData = [
        { key: 'header' },
        { key: 'details' },
        { key: 'bottom-pad' },
    ];

    const renderFlatListItem = ({ item }: { item: { key: string } }) => {
        if (item.key === 'header') {
            return (
                <Animated.View style={{
                    width: "100%",
                    height: scrollY.interpolate({
                        inputRange: [0, HEADER_HEIGHT - MIN_BANNER_HEIGHT],
                        outputRange: [HEADER_HEIGHT, MIN_BANNER_HEIGHT],
                        extrapolate: 'clamp',
                    }),
                    overflow: 'hidden'
                }}>
                    <ImageBackground
                        imageStyle={styles.productImageStyle}
                        source={{
                            uri: selectedEntity?.item?.url
                        }}
                        style={styles.fullImage}
                        resizeMode="cover"
                    />
                    {/* Back button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.fixedBackIcon}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"} size={28} color="#fff" />
                    </TouchableOpacity>
                    {/* Full image icon on top-right */}
                    <TouchableOpacity
                        style={styles.fullImageIconBtn}
                        activeOpacity={0.8}
                        onPress={() => setFullImageVisible(true)}
                    >
                        <MaterialCommunityIcons
                            name="fullscreen"
                            size={27}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </Animated.View>
            )
        }
        if (item.key === 'details') {
            return (
                <View style={[styles.sheetContainer, {
                    position: "relative",
                    top: 0,
                    marginTop: -28,
                    shadowOpacity: 0,
                    elevation: 0,
                }]}>
                    <CText style={styles.title}>{selectedEntity?.item?.title}</CText>
                    <View style={styles.priceRow}>
                        <CText style={styles.discountPrice}>{currencySymbol} {selectedEntity?.item?.discountedPrice}</CText>
                        <CText style={styles.originalPrice}>{currencySymbol} {selectedEntity?.item?.price}</CText>
                    </View>
                    {/* Only show the size/color selectors if available */}
                    {isOptionAvailable('size', selectedEntity) && sortedSizes.length > 0 && (
                        <View style={{ marginTop: 14 }}>
                            <CText style={styles.sectionLabel}>Available Sizes</CText>
                            <ScrollView
                                horizontal
                                scrollEventThrottle={16}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.sizesSlider}
                            >
                                {sortedSizes.map((size: string) => (
                                    <TouchableOpacity
                                        key={size}
                                        style={[
                                            styles.sizeButton,
                                            selectedSize === size && styles.sizeButtonSelected
                                        ]}
                                        onPress={() => setSelectedSize(size)}
                                    >
                                        <CText style={[
                                            styles.sizeButtonText,
                                            selectedSize === size && { color: '#fff' }
                                        ]}>{size}</CText>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                    {isOptionAvailable('color', selectedEntity) && selectedEntity?.item?.color.length > 0 && (
                        <ColorList
                            selectedColors={color}
                            hasSelectedFeature={true}
                            setSelectedColors={setSelectedColors}
                            multiSelect={false}
                            colorList={selectedEntity?.item?.color}
                        />
                    )}
                    {/* Quantity selector, ALWAYS shown here */}
                    <View>
                        <CText style={styles.sectionLabel}>Quantity</CText>
                        <View style={styles.quantityRow}>
                            <TouchableOpacity
                                style={[
                                    styles.qtyBtn,
                                    quantity <= 1 && { backgroundColor: '#e0e0e0', borderColor: '#ccc' }
                                ]}
                                onPress={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                            >
                                <Ionicons name="remove" size={20} color="#181818" />
                            </TouchableOpacity>
                            <TextInput
                                value={quantity.toString()}
                                onChangeText={v => {
                                    let val = parseInt(v.replace(/[^0-9]/g, ''), 10)
                                    setQuantity(isNaN(val) || val < 1 ? 1 : val)
                                }}
                                keyboardType="numeric"
                                style={styles.qtyInput}
                                maxLength={4}
                            />
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => setQuantity(q => q + 1)}
                            >
                                <Ionicons name="add" size={20} color="#181818" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Description */}
                    <CText style={styles.sectionLabel}>Description</CText>
                    <CText style={styles.descriptionText}>{selectedEntity?.item?.description}</CText>
                    <HRLineFullWidth></HRLineFullWidth>
                    <CText style={styles.sectionLabel}>Rating & Reviews ({selectedEntity?.item?.ratingCount ?? 0})</CText>
                    {children}
                </View>
            );
        }
        if (item.key === 'bottom-pad') {
            return <View style={{ height: 75 }} />;
        }
        return null;
    }



    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <FullScreenPopup
                brand={false}
                title={selectedEntity?.item?.title}
                oneLineDescription={selectedEntity?.item?.description}
                fullImageVisible={fullImageVisible}
                setFullImageVisible={setFullImageVisible}
                image={{
                    uri: selectedEntity?.item?.url
                }}
            ></FullScreenPopup>
            <Animated.FlatList
                data={flatListData}
                keyExtractor={item => item.key}
                renderItem={renderFlatListItem}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                contentContainerStyle={{ paddingBottom: 0, backgroundColor: "#fff" }}
            />

            {/* Modal for add to cart or buy now */}
            <ProductVariantSelectionModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                sortedSizes={sortedSizes}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedEntity={selectedEntity}
                setSelectedColors={setSelectedColors}
                color={color}
                quantity={quantity}
                setQuantity={setQuantity}

                CText={CText}
                CButton={CButton}
                ColorList={ColorList}
                modalAction={modalAction}
                handleModalAction={handleModalAction}
            ></ProductVariantSelectionModal>



            {/* Bottom Buttons - fixed at screen bottom */}
            <View style={[
                styles.footerActions,
                {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "#fff",
                    borderTopColor: "#eaeaea",
                    borderTopWidth: 1,
                    zIndex: 99,
                    gap: 0,
                }
            ]}>
                {/* Chat Icon Button */}
                <CTouchableOpacity style={styles.chatBtn} activeOpacity={0.8} onPress={() => { }}>
                    <Ionicons name="chatbubble-ellipses-outline" color={primaryOrange} size={23} />
                </CTouchableOpacity>
                {/* Add to cart button */}
                <CTouchableOpacity
                    style={styles.addToCartBtn}
                    activeOpacity={0.8}
                    onPress={() => openOptionsModal('add')}
                >
                    <Ionicons name="cart-outline" color="#fff" size={20} />
                    <CText style={styles.addToCartText}>Add to cart</CText>
                </CTouchableOpacity>
                <CTouchableOpacity
                    style={styles.buyNowBtn}
                    activeOpacity={0.9}
                    onPress={() => openOptionsModal('buy')}
                >
                    <CText style={styles.buyNowText}>Buy Now</CText>
                </CTouchableOpacity>
            </View>
        </View>
    )
}

const modalStyles = StyleSheet.create({
    safeAreaModalOuter: {
        flex: 1,
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    flexFull: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.32)',
    },
    sheetWrapper: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 18,
        paddingBottom: 0,
        minHeight: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.13,
        shadowRadius: 10,
        elevation: 6,
        width: '100%',
    },
    sheetScrollView: {
        flexGrow: 0,
        maxHeight: height * 0.6,
        minHeight: 0,
    },
    sheetScrollContent: {
        paddingBottom: 0,
        flexGrow: 1,
    },
})

const styles = StyleSheet.create({
    button: {
        backgroundColor: primaryGreen,
        borderRadius: 5,
        paddingVertical: 10,
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 14,
    },
    fullImage: {
        width: width,
        aspectRatio: 0.7,
        justifyContent: 'flex-end',
    },
    productImageStyle: {
        resizeMode: 'contain',
    },
    fixedBackIcon: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 44 : 22,
        left: 16,
        backgroundColor: 'rgba(0,0,0,0.46)',
        borderRadius: 24,
        padding: 6,
        zIndex: 10,
    },

    fullImageIconBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 44 : 22,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.41)',
        borderRadius: 22,
        padding: 6,
        zIndex: 11,
        justifyContent: "center",
        alignItems: "center"
    },

    backIcon: {
        marginTop: 12,
        marginLeft: 16,
        backgroundColor: 'rgba(0,0,0,0.46)',
        borderRadius: 24,
        padding: 6,
        alignSelf: "flex-start",
    },
    sheetContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 22,
        paddingTop: 18,
        elevation: 0,
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
    },
    title: {
        fontSize: 20,
        color: "#1a1a1a",
        fontFamily: 'PoppinsSemiBold',
        marginTop: 3,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    discountPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: primaryOrange,
        marginRight: 9,
    },
    originalPrice: {
        fontSize: 13,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 8,
        marginTop: 2
    },
    sectionLabel: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 13,
        marginBottom: 7,
        marginTop: 12,
        color: '#1a1a1a'
    },
    sizesRow: {
        flexDirection: "row",
        gap: 7,
        marginBottom: 7,
    },
    sizesSlider: {
        flexDirection: "row",
        gap: 7,
        marginBottom: 7,
        paddingRight: 14,
    },
    sizeButton: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 25,
        marginRight: 8,
        backgroundColor: "#fff",
    },
    sizeButtonSelected: {
        borderColor: primaryGreen,
        backgroundColor: primaryGreen,
    },
    sizeButtonText: {
        fontSize: 15,
        color: "#111",
        fontWeight: '600'
    },
    descriptionText: {
        color: "#232323",
        fontSize: 12,
        marginBottom: 2,
        lineHeight: 21,
        marginRight: 4,
    },
    brandRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 9,
    },
    brandLogo: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: primaryOrange
    },
    brandName: {
        fontSize: 15,
        fontWeight: '700',
        color: primaryOrange,
    },
    ratingText: {
        fontWeight: '700',
        color: "#352b18",
        fontSize: 13,
        marginLeft: 2,
    },
    reviewText: {
        color: "#777",
        marginLeft: 6,
        fontSize: 12
    },
    visitBrandBtn: {
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor: '#fef5f3',
        borderRadius: 5,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: '#ffd9cc',
        shadowColor: '#e8744a',
    },
    visitBrandBtnText: {
        color: primaryOrange,
        fontWeight: "700",
        fontSize: 13,
        marginLeft: 6,
        letterSpacing: 0.3,
    },

    footerActions: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        backgroundColor: "#fff",
        borderTopColor: "#eaeaea",
        borderTopWidth: 1,
        marginHorizontal: 0,
        marginBottom: 0,
        paddingHorizontal: 22,
    },
    chatBtn: {
        backgroundColor: "#FFF6EC",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFDABF",
    },
    addToCartBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: primaryGreen,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 8,
        marginRight: 10,
    },
    addToCartBtnSheet: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: primaryGreen,
        borderRadius: 5,
        paddingVertical: 13,
        paddingHorizontal: 10,
        marginTop: 35,
        marginHorizontal: 0,
        justifyContent: "center",
    },
    addToCartText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        marginLeft: 7,
    },
    buyNowBtn: {
        backgroundColor: primaryOrange,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 8,
        flex: 1,
        alignItems: 'center'
    },
    buyNowText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    },
    bottomSheetContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    addToCartSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 18,
        paddingBottom: 32,
        minHeight: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.13,
        shadowRadius: 10,
        elevation: 5,
    },
    modalAbsoluteFill: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
    },

    closeBtn: {
        padding: 5,
        backgroundColor: '#efefef',
        borderRadius: 18,
    },
    sheetBackdrop: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.25)",
    },

    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
        marginBottom: 12,
        gap: 0,
        height: 39,
    },
    qtyBtn: {
        width: 35,
        height: 35,
        borderRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: "#dadada",
        justifyContent: "center",
        alignItems: "center",
    },
    qtyInput: {
        width: 50,
        height: 40,
        borderWidth: 1.1,
        borderColor: "#dadada",
        borderRadius: 6,
        marginHorizontal: 8,
        textAlign: 'center',
        fontSize: 16,
        color: "#181818",
        backgroundColor: "#f8f8f8",
    },
})
export default ProductDetail