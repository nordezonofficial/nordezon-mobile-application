import BackgroundContainer from '@/components/common/BackgroundContainer'
import CText from '@/components/common/CText'
import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import OrderDetailBottomSheet from '@/components/common/order/OrderDetailBottomSheet'
import { primaryOrange } from '@/constants/colors'
import { useGetOrderGroupByIdQuery } from '@/store/api/v1/orders'
import { setOrder, setOrderItemsList, setOrderTracking } from '@/store/slices/orders'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CartList from '../cart/CartList'
const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const OrderDetail = () => {
    // Example summary values (replace with real data as needed)
    const totalItems = 4
    const subTotal = 4598
    const shipping = 200
    const [promoCode, setPromoCode] = useState('')
    const [promoApplied, setPromoApplied] = useState(false)
    const [promoError, setPromoError] = useState('')
    // Example promo effect
    const promoDiscount = promoApplied ? 300 : 0
    const grandTotal = subTotal + shipping - promoDiscount
    const { orderId, order, orderItems } = useSelector((state: any) => state.order)
    const { data, isLoading } = useGetOrderGroupByIdQuery({
        orderId: orderId
    });

    const { cartList } = useSelector((state: any) => state.cart)

    const { user } = useSelector((state: any) => state.user)


    const dispatch = useDispatch();

    const computedOrderItemList = Array.isArray(orderItems) && orderItems.length > 0 ? orderItems : []
    const total = computedOrderItemList.reduce(
        (acc, item) =>
            acc +
            ((item.discountedPrice || item?.post?.discountedPrice || 0) *
                (item.quantity ?? 1)),
        0
    )
    const totalQuantity = computedOrderItemList.reduce(
        (acc, item) => acc + (item.quantity ?? 1), 0
    )

    useEffect(() => {
        if (data && data.status == "success") {
            const orderData = data.data;

            const allItems = orderData?.orders?.flatMap((order: any) => order.items) || [];
            let payload = allItems.map((item: any) => ({
                ...item,
                post: item.post,
            }));

            dispatch(setOrderItemsList(payload))
            dispatch(setOrder(data.data))
        }
    }, [data])

    return (
        <BackgroundContainer paddingHorizontal={0} paddingVertical={0}>
            {/* Top Order info */}

            <View style={styles.headerBarWithBack}>
                <CTouchableOpacity style={styles.backBtn} onPress={() => {
                    router.back()
                }}>
                    <Ionicons name="chevron-back" size={26} color="#212" />
                </CTouchableOpacity>
                <View style={{ flex: 1 }}>
                    <CText style={[styles.heading, styles.headingCentered]} >
                        Order Detail
                    </CText>
                </View>
                {/* Placeholder for spacing, to keep title centered */}
                <View style={{ width: 32 }} />
            </View>
            <CartList
                loading={isLoading}
                hasCheckoutButton={false}
                title={''}
                hasBackButton={false}
                isEditing={false}
                isFromOrderDetail={true}
            >
            </CartList>

            <OrderDetailBottomSheet
                loading={isLoading}
                orderStatus={order.status}
                orderId={order.orderId}
                btnText={'Track Order'}
                mode="orderDetail"
                deliveryAddress={{
                    name: user.fullName,
                    phone: user.phoneNumber,
                    address: user.address
                }}
                billingAddress={{
                    name: user?.billingName,
                    phone: user?.billingPhone,
                    address: user?.billingAddress
                }}
                paymentSummary={{
                    method: "Paid via JazzCash",
                    icon: "cash-outline"
                }}
                summary={{
                    totalItems: totalQuantity,
                    subTotal: total,
                    shipping: 200,
                    promoCode: "",
                    promoDiscount: 0,
                    grandTotal: total, // subtotal + shipping - promo
                }}
                btnIcon={
                    <Ionicons name="cube-outline" size={22} color="#fff" style={{ marginLeft: 8 }} />
                }
                onPress={() => {
                    router.push('/(home)/trackOrder')
                    dispatch(setOrderTracking(orderId))
                }}
            />

        </BackgroundContainer>
    )
}

const styles = StyleSheet.create({
    headerBarWithBack: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,

    },
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
    backBtn: {
        width: 32,
        height: 32,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        backgroundColor: '#f5f5f5'
    },
    headingCentered: {
        textAlign: 'center',
        marginLeft: 0,
    },
    heading: {
        fontSize: 20,
        fontFamily: 'PoppinsSemiBold',
        color: "#222",
        marginLeft: 5,
    },
});

export default OrderDetail