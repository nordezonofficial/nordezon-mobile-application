import CButton from '@/components/common/CButton';
import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import FullScreenPopup from '@/components/common/FullScreen';
import { primaryGreen, primaryOrange } from '@/constants/colors';
import { sizeOrder } from '@/constants/common';
import { currencySymbol } from '@/constants/keys';
import { useAddToCartMutation } from '@/store/api/v1/cart';
import { useGetOriginalsByIdQuery } from '@/store/api/v1/originals';
import { setOriginals } from '@/store/slices/originals';
import { setSelectedEntity } from '@/store/slices/post';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated, Dimensions,
    Image,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BrandProfileProductDetail from '../common/BrandProfileProductDetail';
import CartProduct from './cart/CartProduct';

import { isAllOptionsSelected, isOptionAvailable } from '@/helpers';
import { View as RnView } from 'react-native';
import CSnackbar from '../common/CSnackbar';
import MultipleProductsVariantSelectionModal from '../common/product/MultipleProductsVariantSelectionModal';
import ProductVariantSelectionModal from '../common/product/ProductVariantSelectionModal';

// Debug: top-level loaded
console.log('[ShopTheWholeLook] Render Start');

const Skeleton = ({ width = '100%', height = 20, borderRadius = 8, style = {} }: any) => {
    console.log('[ShopTheWholeLook] Skeleton Render');
    return (
        <RnView
            style={[
                {
                    backgroundColor: '#F2F2F2',
                    width,
                    height,
                    borderRadius,
                    marginBottom: 8,
                    overflow: 'hidden'
                },
                style
            ]}
        />
    );
};

const { width, height } = Dimensions.get('window');

const HEADER_HEIGHT = height * 0.7;
const MIN_BANNER_HEIGHT = 120; // Increased minimum height to keep banner more visible

const ShopTheWholeLook = ({
    children
}: {
    children?: React.ReactNode
}) => {
    console.log('[ShopTheWholeLook] Function Render');
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [fullImageVisible, setFullImageVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<any>('info');

    console.log('[ShopTheWholeLook] Hooks (top):', { selectedSize, fullImageVisible, snackbarVisible, snackbarMessage, snackbarType });

    /* --- Product Variant ---*/
    /* ----- Api function ad to cart ---*/
    const [addToCart] = useAddToCartMutation();
    console.log('[ShopTheWholeLook] useAddToCartMutation');

    const [modalVisible, setModalVisible] = useState(false);

    // Store hooks
    const { selectedEntity } = useSelector((state: any) => state.post);
    const { originalsId, originals } = useSelector((state: any) => state.originals);

    const [color, setSelectedColors] = useState<string[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [modalAction, setModalAction] = useState<'add' | 'buy'>('add');
    const [isFeatured, setFeatured] = useState(false);

    console.log('[ShopTheWholeLook] More hooks (modal etc):', { modalVisible, color, quantity, modalAction, isFeatured });

    // Duplicated for multiples modal only, use 'multiples' suffix
    const [multiplesModalVisible, setMultiplesModalVisible] = useState(false);
    const [multiplesModalAction, setMultiplesModalAction] = useState<'add' | 'buy'>('add');
    const [multiplesPostToCart, setMultiplesPostToCart] = useState<any[]>([
        {
            post: {},
            postId: 0,
            size: "",
            quantity: 1,
            color: "",
        }
    ]);
    console.log('[ShopTheWholeLook] Multiples modal hooks:', { multiplesModalVisible, multiplesModalAction, multiplesPostToCart });

    // Sorted sizes (must always be defined at render)
    const sortedSizes = Array.isArray(selectedEntity?.item?.size)
        ? [...selectedEntity.item.size].sort(
            (a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
        )
        : [];
    console.log('[ShopTheWholeLook] sortedSizes:', sortedSizes);

    // -------------- DATA QUERY ---------------
    // NB: useGetOriginalsByIdQuery must be called unconditionally, before any conditional or early return.
    const { data, isLoading } = useGetOriginalsByIdQuery({
        id: originalsId,
        skip: originalsId == 0
    });
    console.log('[ShopTheWholeLook] useSelector/post:', selectedEntity);
    console.log('[ShopTheWholeLook] useSelector/originals:', { originalsId, originals });
    console.log('[ShopTheWholeLook] useGetOriginalsByIdQuery:', { data, isLoading });

    // --- Always declare hooks in order ---
    // Main product and Other products with quantity state (make sure it's in sync with data updates)
    const [mainProduct, setMainProduct] = useState<any>({});
    const [otherProduct, setOtherProduct] = useState<any[]>([]);
    const [addToCartLoading, setAddToCartLoading] = useState(false);
    const [readyToCallAPI, setReadyToCallAPI] = useState(false);

    console.log('[ShopTheWholeLook] mainProduct:', mainProduct, 'otherProduct:', otherProduct);
    console.log('[ShopTheWholeLook] addToCartLoading:', addToCartLoading);
    console.log('[ShopTheWholeLook] readyToCallAPI:', readyToCallAPI);

    // --- Video hook must be called on every render
    const player = useVideoPlayer(originals?.videoUrl, player => {
        console.log('[ShopTheWholeLook] useVideoPlayer mount');
        player.loop = true;
        player.play();
    });

    // ------------ useEffect: Set Data After Query --------------
    const dispatch = useDispatch();
    useEffect(() => {
        console.log('[ShopTheWholeLook] useEffect (data):', data && data.status);
        if (data && data.status === "success") {
            let findMainProductAndUser = data.data.postOriginals.find((item: any) => item.featured === true);
            let findOtherProduct = data.data.postOriginals
                .filter((item: any) => item.featured === false)
                .map((item: any) => ({
                    ...item,
                    quantity: 1
                }));
            let mainProductPayload = {
                ...findMainProductAndUser,
                quantity: 1,
            }

            setOtherProduct(findOtherProduct)
            setMainProduct(mainProductPayload)
            dispatch(setOriginals(data.data))
            let payload = {
                id: originalsId,
                requestType: "ORIGINALS",
                item: {
                    ...findMainProductAndUser,
                    ...findMainProductAndUser.post,
                    user: findMainProductAndUser?.post.user
                }
            }
            dispatch(setSelectedEntity(payload))
        }
    }, [data, originalsId, dispatch]);

    useEffect(() => {
        console.log('[ShopTheWholeLook] useEffect (originals):', originals);
        if (originals && originals.videoUrl) {
            // Recreate player when video changes
            player.replaceAsync(`${originals.videoUrl}`);
        } else {
            player.pause();
        }
    }, [originals]);

    // Keep only effects at top-level, before conditionals.
    useEffect(() => {
        // Call API when readyToCallAPI is set
        console.log('[ShopTheWholeLook] useEffect readyToCallAPI', readyToCallAPI, selectedEntity);
        if (readyToCallAPI && selectedEntity) {
            console.log("FIRED th api call", readyToCallAPI);
            callApiAddToCartOrOrder();
            setReadyToCallAPI(false);
        };
    }, [readyToCallAPI, selectedEntity]);

    //-------------------------------------
    // -------- Code continues ------------
    //-------------------------------------

    // Quantity Handlers
    const increaseQty = (item: any, featured?: boolean) => {
        console.log('[ShopTheWholeLook] increaseQty', item, featured);
        if (featured) {
            setMainProduct((prev: any) => ({
                ...prev,
                quantity: (prev.quantity || 1) + 1
            }));
        } else {
            setOtherProduct((prevList: any[]) =>
                prevList.map((p: any) =>
                    p.id === item.id
                        ? { ...p, quantity: (p.quantity || 1) + 1 }
                        : p
                )
            );
        }
    };

    const decreaseQty = (item: any, featured?: boolean) => {
        console.log('[ShopTheWholeLook] decreaseQty', item, featured);
        if (featured) {
            setMainProduct((prev: any) => ({
                ...prev,
                quantity: Math.max(1, (prev.quantity || 1) - 1)
            }));
        } else {
            setOtherProduct((prevList: any[]) =>
                prevList.map((p: any) =>
                    p.id === item.id
                        ? { ...p, quantity: Math.max(1, (p.quantity || 1) - 1) }
                        : p
                )
            );
        }
    };

    const removeItem = (id: string) => {
        console.log('[ShopTheWholeLook] removeItem', id);
        setOtherProduct((prevList: any[]) => prevList.filter((p: any) => p.id !== id));
    };

    // Handler for modal action button
    const handleModalAction = async () => {
        console.log('[ShopTheWholeLook] handleModalAction fired');
        if (isAllOptionsSelected(selectedSize, color, quantity, selectedEntity)) {
            setModalVisible(false);
            if (modalAction === 'add') {
                setReadyToCallAPI(true);  // <-- NEW FLAG
            } else if (modalAction === 'buy') {
                // router.push('/(home)/cart');
            }
        }
    };

    // Duplicated handler for multiples modal
    const handleMultiplesModalAction = async (param: any) => {
        console.log('[ShopTheWholeLook] handleMultiplesModalAction fired');
        setAddToCartLoading(true)
        let makePayload = param.map((item: any) => {
            return {
                postId: item.postId,
                color: item.color[0] || "",
                size: item.size || "",
                quantity: item.quantity || 1,
            };
        });
        console.log("makePayload", JSON.stringify(makePayload));

        let response = await addToCart({
            multiplePost: makePayload
        })
        setAddToCartLoading(false)
        setMultiplesModalVisible(false)
        setSnackbarVisible(true)
        setSnackbarType(response?.data?.status)
        setSnackbarMessage(response.data.message)
        setTimeout(() => {
            router.push('/(home)/cart')
        }, 1000);
    };

    // Make the payload for single add to cart / order
    const makeAddToCartOrByPayload = () => {
        let newQTY = 1;
        if (
            (isOptionAvailable('size', selectedEntity)) ||
            (isOptionAvailable('color', selectedEntity))
        ) {
            newQTY = quantity;
        } else {
            if (isFeatured) {
                newQTY = mainProduct.quantity;
            } else {
                let findProduct = otherProduct.find((item) => item.id == selectedEntity?.item?.id)
                if (findProduct) {
                    newQTY = findProduct.quantity
                }
            }
        }
        let payload = {
            color: color.length > 0 ? color[0] : "",
            quantity: newQTY,
            size: selectedSize,
            postId: selectedEntity?.item?.id,
        }
        console.log('[ShopTheWholeLook] makeAddToCartOrByPayload:', payload);

        return payload;
    }

    // Call API for add to cart or order
    const callApiAddToCartOrOrder = async () => {
        let getPayload = makeAddToCartOrByPayload();
        if (modalAction == "add") {
            let response: any = await addToCart(getPayload);
            console.log("response", response);
            setSnackbarVisible(true)
            setSnackbarType(response?.data?.status)
            setSnackbarMessage(response.data.message)
            setFeatured(false)
        }
    }

    // Modal open handler
    const handleOpenModalAddToCart = async (item: any, featured: boolean) => {
        console.log('[ShopTheWholeLook] handleOpenModalAddToCart', item, featured);
        setSelectedColors([]);
        setSelectedSize("");

        let findProduct: any = {};
        if (!featured) {
            findProduct = otherProduct.find((itm) => itm.id == item.id)
        } else {
            findProduct = mainProduct
        }
        let payload = {
            id: originalsId,
            requestType: "ORIGINALS",
            item: {
                ...findProduct,
                ...findProduct.post,
                user: mainProduct?.post?.user
            }
        }
        dispatch(setSelectedEntity(payload))
        setFeatured(featured)

        if (
            (isOptionAvailable('size', payload)) ||
            (isOptionAvailable('color', payload))
        ) {
            setModalAction("add");
            setModalVisible(true);
        } else {
            setReadyToCallAPI(true);
        }
    }

    const handleToAddToCard = () => {
        console.log('[ShopTheWholeLook] handleToAddToCard');
        let mainProductPayload = {
            ...mainProduct,
            post: mainProduct.post,
            postId: mainProduct?.post?.id,
            user: mainProduct?.post?.user,
            size: mainProduct?.post?.size || [],
            color: mainProduct.post?.color || [],
        }
        let payload = otherProduct.map((item) => {
            return {
                postId: item?.post?.id,
                post: item?.post,
                user: item?.post?.user,
                quantity: item?.quantity,
                size: item?.post?.size || [],
                color: item.post?.color || [],
            }
        });
        payload.unshift(mainProductPayload)
        setMultiplesPostToCart(payload)
        setMultiplesModalVisible(true)
    }

    // Skeleton UI component
    const HighlightedCartProduct = ({
        item,
        onRemove,
        onDecrease,
        onIncrease,
        onAddToCart,
        showAddToCart = false,
        isEditing = true,
        marginBottom = 14,
        showBrandProfileImage = false,
        color,
        size,
        loading
    }: any) => {
        console.log('[ShopTheWholeLook] HighlightedCartProduct Render', { item, loading });
        if (loading) {
            return (
                <View style={styles.highlightContainer}>
                    <Skeleton width={150} height={22} style={{ marginLeft: 19, marginTop: -16, marginBottom: 8 }} />
                    <RnView style={{ padding: 12 }}>
                        <Skeleton width="100%" height={84} borderRadius={12} style={{ marginBottom: 12 }} />
                    </RnView>
                </View>
            )
        }
        return (
            <View style={styles.highlightContainer}>
                <View style={styles.actualProductBadge}>
                    <Ionicons name="star" color="#fff" size={17} style={{ marginRight: 3 }} />
                    <CText style={styles.actualProductBadgeText}>Main Product in This Look</CText>
                </View>
                <CartProduct
                    showAddToCart={true}
                    isMainProduct={true}
                    isEditing={isEditing}
                    showBrandProfileImage={showBrandProfileImage}
                    marginBottom={0}
                    item={{
                        ...item,
                        user: item?.post?.user
                    }}
                    size=''
                    color=''
                    onAddToCart={() => {
                        handleOpenModalAddToCart({}, true)
                    }}
                    onIncrease={onIncrease}
                    onDecrease={onDecrease}
                    onRemove={onRemove}
                />
            </View>
        )
    };

    const SkeletonShopTheWholeLook = () => {
        console.log('[ShopTheWholeLook] SkeletonShopTheWholeLook Render');
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* Full screen image modal placeholder */}
                <FullScreenPopup
                    brand={false}
                    title={"Track Your Order"}
                    oneLineDescription={"Stay updated with real-time order status from each vendor."}
                    fullImageVisible={fullImageVisible}
                    setFullImageVisible={setFullImageVisible}
                    image={""}
                />
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingBottom: 25, backgroundColor: "#fff" }}
                >
                    {/* Top skeleton "banner" */}
                    <Animated.View style={{
                        width: "100%",
                        height: HEADER_HEIGHT,
                        overflow: 'hidden',
                        backgroundColor: "#eee"
                    }}>
                        <Skeleton width="100%" height={HEADER_HEIGHT} borderRadius={0} />
                    </Animated.View>
                    {/* Bottom sheet skeleton */}
                    <View style={[styles.sheetContainer, {
                        position: "relative",
                        top: 0,
                        marginTop: -28,
                        shadowOpacity: 0,
                        elevation: 0,
                    }]}>
                        {/* Brand section skeleton */}
                        <RnView style={{ flexDirection: "row", alignItems: 'center', marginBottom: 11 }}>
                            <Skeleton width={36} height={36} borderRadius={18} style={{ marginRight: 10 }} />
                            <Skeleton width={110} height={16} />
                        </RnView>
                        {/* Title */}
                        <Skeleton width={180} height={24} style={{ marginBottom: 9 }} />
                        {/* Price row */}
                        <RnView style={{ flexDirection: "row", alignItems: 'center', marginBottom: 8 }}>
                            <Skeleton width={72} height={20} style={{ marginRight: 9 }} />
                            <Skeleton width={46} height={15} />
                        </RnView>
                        <Skeleton width={'80%'} height={15} style={{ marginBottom: 10 }} />
                        {/* Desc skeleton - simulates text lines */}
                        <Skeleton width={'95%'} height={15} />
                        <Skeleton width={'90%'} height={15} />
                        <Skeleton width={'88%'} height={15} />
                    </View>
                    {/* Highlighted main product skeleton */}
                    <HighlightedCartProduct loading={true} />
                    {/* List skeleton for other products */}
                    <View style={{ marginTop: 18, marginHorizontal: 16 }}>
                        <Skeleton width={230} height={20} style={{ marginBottom: 10 }} />
                        {[1, 2].map((_, idx) => (
                            <RnView key={idx} style={{
                                borderWidth: 1,
                                borderColor: "#eee",
                                borderRadius: 12,
                                marginBottom: 10,
                                padding: 8,
                                backgroundColor: "#FCFCFC"
                            }}>
                                <Skeleton width={"100%"} height={68} borderRadius={12} />
                            </RnView>
                        ))}
                    </View>
                    <View style={{ height: 75 }} />
                </Animated.ScrollView>
                {/* Footer skeleton actions */}
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
                    <Skeleton width={40} height={40} borderRadius={8} style={{ marginRight: 10 }} />
                    <Skeleton width={95} height={40} borderRadius={8} style={{ marginRight: 10 }} />
                    <Skeleton width={160} height={40} borderRadius={8} />
                </View>
            </View>
        )
    };

    // EARLY RETURN: SKELETON (must be after all hooks)
    if (isLoading || !data || data.status !== 'success') {
        console.log('[ShopTheWholeLook] isLoading/data not ready, Skeleton UI shown');
        return <SkeletonShopTheWholeLook />;
    }

    console.log('[ShopTheWholeLook] About to return JSX');

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Full screen image modal */}
            <FullScreenPopup
                brand={false}
                title={"Track Your Order"}
                oneLineDescription={"Stay updated with real-time order status from each vendor."}
                fullImageVisible={fullImageVisible}
                setFullImageVisible={setFullImageVisible}
                image={originals.banner}
            />
            <CSnackbar
                bottom={100}
                visible={snackbarVisible}
                message={snackbarMessage}
                onClose={() => setSnackbarVisible(false)}
                type={snackbarType}
            />
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                contentContainerStyle={{ paddingBottom: 25, backgroundColor: "#fff" }}
            >
                {/* Top Section - Full Screen Image with Back Icon */}
                <Animated.View style={{
                    width: "100%",
                    height: scrollY.interpolate({
                        inputRange: [0, HEADER_HEIGHT - MIN_BANNER_HEIGHT],
                        outputRange: [HEADER_HEIGHT, MIN_BANNER_HEIGHT],
                        extrapolate: 'clamp',
                    }),
                    overflow: 'hidden'
                }}>
                    {
                        originals.videoUrl ? (
                            <VideoView
                                player={player}
                                style={styles.video}
                                contentFit="cover"
                                nativeControls={true}
                            />
                        ) : (
                            <Image
                                style={styles.mainProductImage}
                                source={{ uri: originals.banner }}
                            />
                        )
                    }

                    {/* Back button */}
                    <CTouchableOpacity
                        onPress={() => router.back()}
                        style={styles.fixedBackIcon}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"} size={28} color="#fff" />
                    </CTouchableOpacity>
                    {/* Full image icon on top-right */}
                    {
                        originals.videoUrl && (
                            <CTouchableOpacity
                                style={styles.fullImageIconBtn}
                                activeOpacity={0.8}
                                onPress={() => setFullImageVisible(true)}
                            >
                                <MaterialCommunityIcons
                                    name="fullscreen"
                                    size={27}
                                    color="#fff"
                                />
                            </CTouchableOpacity>
                        )
                    }
                </Animated.View>

                {/* Bottom Sheet-Like Detail - now just Content */}
                <View style={[styles.sheetContainer, {
                    position: "relative",
                    top: 0,
                    marginTop: -28,
                    shadowOpacity: 0,
                    elevation: 0,
                }]}>

                    <BrandProfileProductDetail showRatingReviews={false} />
                    {/* Product Name and Price */}
                    <CText style={styles.title}>{mainProduct?.post?.title}</CText>
                    <View style={styles.priceRow}>
                        {
                            mainProduct?.post?.discountedPrice > 0 ? (
                                <>
                                    <CText style={styles.discountPrice}>{currencySymbol} {mainProduct?.post?.discountedPrice}</CText>
                                    <CText style={styles.originalPrice}>{currencySymbol} {mainProduct?.post.price}</CText>
                                </>
                            ) : (
                                <CText style={styles.discountPrice}>{currencySymbol} {mainProduct?.post?.price}</CText>
                            )
                        }
                    </View>
                    {children}
                </View>

                {/* Highlighted & labeled actual product */}
                <HighlightedCartProduct
                    showBrandProfileImage={true}
                    item={mainProduct}
                    onIncrease={() => increaseQty(mainProduct, true)}
                    onDecrease={() => decreaseQty(mainProduct, true)}
                    onRemove={() => removeItem(mainProduct?.id)}
                    showAddToCart={true}
                    isEditing={true}
                />
                {/* CartList with title about more items from this look */}
                <View style={{ marginTop: 18, marginHorizontal: 16 }}>
                    <CText style={{
                        fontSize: 17,
                        fontWeight: '700',
                        color: "#222",
                        marginBottom: 10,
                        fontFamily: 'PoppinsSemiBold'
                    }}>
                        There are more items from this Look
                    </CText>
                    {
                        otherProduct.map((item: any, index: number) => {
                            return (
                                <CartProduct
                                    size=''
                                    color=''
                                    showBrandProfileImage={true}
                                    key={index}
                                    item={{
                                        ...item,
                                        user: item.post.user
                                    }}
                                    onIncrease={() => increaseQty(item, false)}
                                    onDecrease={() => decreaseQty(item, false)}
                                    onRemove={() => removeItem(item.id)}
                                    isEditing={true}
                                    onAddToCart={() => {
                                        handleOpenModalAddToCart(item, false)
                                    }}
                                    showAddToCart={true}
                                />
                            );
                        })
                    }
                </View>

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
                    modalAction={modalAction}
                    handleModalAction={handleModalAction}
                />

                {/* Duplicated - ONLY for multiples - with props named with 'multiples' prefix */}
                <MultipleProductsVariantSelectionModal
                    addToCartLoading={addToCartLoading}
                    multiplesPostToCart={multiplesPostToCart}
                    setMultiplesPostToCart={setMultiplesPostToCart}
                    modalVisible={multiplesModalVisible}
                    setModalVisible={setMultiplesModalVisible}
                    CText={CText}
                    CButton={CButton}
                    modalAction={multiplesModalAction}
                    handleModalAction={handleMultiplesModalAction}
                />

                {/* Pad bottom for floating buttons */}
                <View style={{ height: 75 }} />
            </Animated.ScrollView>
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

                <CTouchableOpacity style={styles.addToCartBtn} activeOpacity={0.8} onPress={handleToAddToCard}>
                    <Ionicons name="cart-outline" color="#fff" size={20} />
                    <CText style={styles.addToCartText}>Add to cart</CText>
                </CTouchableOpacity>
                <CTouchableOpacity style={styles.buyNowBtn} activeOpacity={0.9} onPress={() => { }}>
                    <CText style={styles.buyNowText}>Buy Now</CText>
                </CTouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainProductImage: {
        width: width,
        height: height * 0.68,
        borderWidth: 1,
    },
    playPauseButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 50,
        zIndex: 10,
    },
    skipButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -10 }, { translateY: -20 }],
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 50,
        zIndex: 10,
    },
    fullImage: {
        width: width,
        aspectRatio: 0.7,
        justifyContent: 'flex-end',
    },
    video: {
        width,
        height: height * 0.68,
    },
    productImageStyle: {
        resizeMode: 'contain',
    },
    fixedBackIcon: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 44 : 22,
        left: 16,
        backgroundColor: 'rgba(30, 13, 13, 0.46)',
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
        fontSize: 15,
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
    highlightContainer: {
        marginTop: 28,
        marginHorizontal: 12,
        borderWidth: 2,
        borderColor: primaryOrange,
        borderRadius: 14,
        backgroundColor: '#FFF7F0',
        shadowColor: primaryOrange,
    },
    actualProductBadge: {
        position: 'absolute',
        top: -16,
        left: 19,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: primaryOrange,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 3,
        zIndex: 20,
        shadowColor: primaryOrange,
        shadowOpacity: 0.13,
        shadowRadius: 11,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    actualProductBadgeText: {
        color: "#fff",
        fontWeight: 'bold',
        fontSize: 13,
        fontFamily: 'PoppinsMedium',
        letterSpacing: 0.2,
        marginLeft: 1,
    },
    cartProductHighlighted: {
        backgroundColor: '#FFE2CA',
        borderRadius: 12,
        marginTop: 25,
        borderWidth: 1,
        borderColor: "#FFDABF",
        paddingVertical: 2
    },
    cartProductPriceHighlighted: {
        color: primaryOrange,
        fontWeight: '700'
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
    }
});
console.log('[ShopTheWholeLook] File Loaded');
export default ShopTheWholeLook