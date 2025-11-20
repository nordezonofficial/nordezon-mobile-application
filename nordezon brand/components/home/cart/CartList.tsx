import BackgroundContainer from '@/components/common/BackgroundContainer'
import CButton from '@/components/common/CButton'
import CText from '@/components/common/CText'
import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import { primaryOrange } from '@/constants/colors'
import { useAddToCartMutation, useDeleteCartMutation, useGetCartListQuery } from '@/store/api/v1/cart'
import { removeCartItem, setCartList, updateCartQuantity } from '@/store/slices/cart'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CartProduct from './CartProduct'

/**
 * Skeleton loader for cart items.
 */
const CartProductSkeleton = () => (
    <View style={[styles.cartProductSkeleton, { marginBottom: 14 }]}>
        <View style={styles.skeletonImage} />
        <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.skeletonLine1} />
            <View style={styles.skeletonLine2} />
            <View style={styles.skeletonLine3} />
        </View>
    </View>
)

const MIN_LOADING_DURATION = 800; // ms

const CartList = ({
    title = "My Cart",
    hasCheckoutButton = true,
    isEditing = true,
    isFromOrderDetail = false,
    hasBackButton = true,
    onBackPress,
    children,
    loading = false,
}: {
    title?: any,
    hasCheckoutButton?: boolean
    isFromOrderDetail?: boolean
    isEditing?: boolean
    hasBackButton?: boolean
    onBackPress?: () => void
    children?: React.ReactNode
    loading?: boolean
}) => {
    // If isFromOrderDetail is true, we do NOT want to call or refetch the cart API.
    const { data: cartData, refetch, isLoading } = useGetCartListQuery(undefined, {
        skip: isFromOrderDetail
    });
    const dispatch = useDispatch();
    const [deleteCartApi] = useDeleteCartMutation()
    const { cartList } = useSelector((state: any) => state.cart)
    const { orderItems } = useSelector((state: any) => state.order)

    /* ----- Api function ad to cart ---*/
    const [addToCart] = useAddToCartMutation();

    // --- Custom loading delay logic
    const [showLoading, setShowLoading] = useState(true);
    const loadingTimeout = useRef<any>(null);

    // Show skeleton for at least MIN_LOADING_DURATION, or until fetch completes
    useEffect(() => {
        setShowLoading(true);
        if (!isFromOrderDetail) {
            // Only apply the "at least for X ms" logic if data is being fetched
            loadingTimeout.current = setTimeout(() => {
                // After timeout, will only hide if not loading
                if (!isLoading && !loading) {
                    setShowLoading(false);
                }
            }, MIN_LOADING_DURATION);
        } else {
            // for order detail, never loading
            setShowLoading(false);
        }
        return () => {
            if (loadingTimeout.current) {
                clearTimeout(loadingTimeout.current);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFromOrderDetail]);

    // Observe state to end the skeleton after min loading and loading finished
    useEffect(() => {
        if (isFromOrderDetail) {
            setShowLoading(false);
            return;
        }
        if (!isLoading && !loading) {
            // Wait for at least the minimum loading time to be finished...
            if (loadingTimeout.current) {
                setTimeout(() => setShowLoading(false), 0); // setTimeout ensures ordering
            } else {
                setShowLoading(false);
            }
        } else {
            setShowLoading(true);
        }
    }, [isLoading, loading, isFromOrderDetail]);

    // Only refetch when not isFromOrderDetail
    useFocusEffect(
        useCallback(() => {
            if (!isFromOrderDetail) {
                refetch();
            }
        }, [refetch, isFromOrderDetail])
    );

    useEffect(() => {
        if (!isFromOrderDetail) {
            refetch();
        }
        // --- eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFromOrderDetail, refetch]);

    useEffect(() => {
        if (!isFromOrderDetail && cartData && cartData.status === "success") {
            dispatch(setCartList(cartData.data))
        }
    }, [cartData, dispatch, isFromOrderDetail])

    // --- DELETE item from cart using API
    const deleteItemFromCart = async ({ cartId }: { cartId: number }) => {
        try {
            dispatch(removeCartItem(cartId))
            await deleteCartApi({ cartId: cartId })
        } catch (e) {
            console.log("Error for delete cart", e);
        }
    }

    /* --- make the payload ---*/
    const makeAddToCartOrByPayload = (item: any, newQty: number) => {
        let payload = {
            color: item.color,
            quantity: newQty,
            size: item.size,
            postId: item?.postId,
            makeIncreaseDecrease: true
        }
        return payload;
    }
    // --- INCREASE/DECREASE QUANTITY logic using redux
    const handleIncreaseQuantity = async (item: any) => {
        const newQty = (item.quantity ?? 1) + 1
        let getPayload = makeAddToCartOrByPayload(item, newQty);
        dispatch(updateCartQuantity({ id: item.id, quantity: newQty }))
        await addToCart(getPayload);
    }

    const handleDecreaseQuantity = async (item: any) => {
        const minQty = 1
        const currentQty = item.quantity ?? 1
        const newQty = Math.max(minQty, currentQty - 1)
        let getPayload = makeAddToCartOrByPayload(item, newQty);
        dispatch(updateCartQuantity({ id: item.id, quantity: newQty }))
        await addToCart(getPayload);
    }

    // Calc total from redux cartList (always use redux for true cart)
    const computedTotalItems = Array.isArray(cartList) && cartList.length > 0 ? cartList : []
    const computedOrderTotalItems = Array.isArray(orderItems) && orderItems.length > 0 ? orderItems : []
    const total = computedTotalItems.reduce(
        (acc, item) => acc + ((item.discountedPrice || item?.post?.discountedPrice || 0) * (item.quantity ?? item.quantity ?? 1)),
        0
    );
    const orderItemTotal = computedOrderTotalItems.reduce(
        (acc, item) => acc + ((item.discountedPrice || item?.post?.discountedPrice || 0) * (item.quantity ?? item.quantity ?? 1)),
        0
    );

    // Header rendering: with (Back button | optional), Title centered when back button is present
    const renderHeader = () => {
        if (!hasBackButton && title != '') {
            return <CText style={styles.heading}>{title}</CText>
        }
        return (
            <>
                {title != '' && (
                    <>
                        <View style={styles.headerBarWithBack}>
                            <CTouchableOpacity style={styles.backBtn} onPress={onBackPress || (() => router.back())}>
                                <Ionicons name="chevron-back" size={26} color="#212" />
                            </CTouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <CText style={[styles.heading, styles.headingCentered]} >
                                    {title}
                                </CText>
                            </View>
                            <View style={{ width: 32 }} />
                        </View>
                    </>
                )}
            </>
        );
    };

    // Skeleton loading UI
    const renderSkeletonLoading = () => (
        <View style={{ paddingHorizontal: 4, marginTop: 22 }}>
            {Array.from({ length: 3 }).map((_, idx) => (
                <CartProductSkeleton key={idx} />
            ))}
        </View>
    );

    // Render Cart Product Row; color/size props are handled inside CartProduct
    const renderCartItem = ({ item }: { item: any }) => (
        <CartProduct
            item={item}
            onIncrease={() => handleIncreaseQuantity(item)}
            onDecrease={() => handleDecreaseQuantity(item)}
            onRemove={() => deleteItemFromCart({ cartId: item.id })}
            isEditing={isEditing}
            color={item.color}
            size={item.size}
        />
    )

    return (
        <BackgroundContainer paddingVertical={0}>
            {renderHeader()}
            {(isFromOrderDetail ? false : showLoading) ? (
                renderSkeletonLoading()
            ) : ((Array.isArray(isFromOrderDetail ? computedOrderTotalItems : computedTotalItems) &&
                (isFromOrderDetail ? computedOrderTotalItems.length === 0 : computedTotalItems.length === 0))) ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={60} color="#ccc" />
                    <CText style={styles.emptyText}>
                        {!isFromOrderDetail ? 'Your cart is empty' : 'No Order Items Found'}
                    </CText>
                </View>
            ) : (
                <>
                    <FlatList
                        data={isFromOrderDetail ? computedOrderTotalItems : computedTotalItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item, index: number) => item.id ? String(item.id) : String(index)}
                        contentContainerStyle={{ paddingTop: 14 }}
                    />
                    {
                        hasCheckoutButton && (
                            <>
                                <View style={styles.totalBar}>
                                    <CText style={styles.totalLabel}>Total</CText>
                                    <CText style={styles.totalValue}>Rs. {!isFromOrderDetail ? total : orderItemTotal}</CText>
                                </View>
                                <CButton
                                    text={"Proceed to Checkout"}
                                    style={styles.button}
                                    loading={false}
                                    afterIcon={
                                        <Ionicons name="arrow-forward-circle" size={22} color="#fff" style={{ marginLeft: 8 }} />
                                    }
                                    textStyle={styles.buttonText}
                                    onPress={() => {
                                        router.push('/(home)/checkout')
                                    }}
                                />
                            </>
                        )
                    }
                </>
            )}
        </BackgroundContainer>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: primaryOrange,
        borderRadius: 5,
        paddingVertical: 15,
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16,
    },
    heading: {
        fontSize: 17,
        fontFamily: 'PoppinsSemiBold',
        marginTop: 10,
        color: "#222",
        marginLeft: 5,
    },
    headingCentered: {
        textAlign: 'center',
        marginLeft: 0,
    },
    headerBarWithBack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        width: 32,
        height: 32,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        backgroundColor: '#f5f5f5'
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 65
    },
    emptyText: {
        marginTop: 24,
        color: "#bbb",
        fontSize: 17,
        fontFamily: 'PoppinsSemiBold'
    },
    totalBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 10,
        paddingHorizontal: 9,
        paddingVertical: 12,
        borderRadius: 9,
        backgroundColor: "#FAFAFC",
        borderWidth: 1,
        borderColor: "#EEEFF1"
    },
    totalLabel: {
        fontSize: 16,
        color: "#888",
        fontFamily: 'PoppinsSemiBold'
    },
    totalValue: {
        fontSize: 17,
        fontFamily: 'PoppinsSemiBold',
        color: "#e8744a"
    },
    checkoutBtn: {
        backgroundColor: "#e8744a",
        paddingVertical: 15,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 6,
        elevation: 1
    },
    checkoutText: {
        color: "#fff",
        fontFamily: 'PoppinsSemiBold',
        fontSize: 15
    },



    // Skeleton styles
    cartProductSkeleton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 11,
        marginHorizontal: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#F3F3F6",
    },
    skeletonImage: {
        width: 100,
        height: 100,
        backgroundColor: "#ececec",
        borderRadius: 8,
    },
    skeletonLine1: {
        width: '60%',
        height: 15,
        backgroundColor: "#ececec",
        borderRadius: 5,
        marginBottom: 8,
        marginTop: 7,
    },
    skeletonLine2: {
        width: '80%',
        height: 13,
        backgroundColor: "#ececec",
        borderRadius: 5,
        marginBottom: 6,
    },
    skeletonLine3: {
        width: '50%',
        height: 13,
        backgroundColor: "#ececec",
        borderRadius: 5,
        marginBottom: 0,
    },

    // ColorCircle for cart item
    colorCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'transparent', // Will be replaced dynamically
        borderWidth: 1,
        borderColor: "#ddd",
    },
})

export default CartList