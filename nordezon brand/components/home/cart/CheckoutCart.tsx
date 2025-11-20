import CSnackbar from '@/components/common/CSnackbar'
import OrderDetailBottomSheet from '@/components/common/order/OrderDetailBottomSheet'
import { usePlaceOrderByUserMutation } from '@/store/api/v1/orders'
import { setOrderId } from '@/store/slices/orders'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CartList from './CartList'

const CheckoutCart = () => {
    const { cartList } = useSelector((state: any) => state.cart)
    const { user } = useSelector((state: any) => state.user)
    const [placeOrder, { isLoading }] = usePlaceOrderByUserMutation()
    const [orderMessage, setOrderMessage] = useState("")
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');

    const dispatch = useDispatch();
    // Compute cart totals
    const computedCartList = Array.isArray(cartList) && cartList.length > 0 ? cartList : []
    const total = computedCartList.reduce(
        (acc, item) =>
            acc +
            ((item.discountedPrice || item?.post?.discountedPrice || 0) *
                (item.quantity ?? 1)),
        0
    )
    const totalQuantity = computedCartList.reduce(
        (acc, item) => acc + (item.quantity ?? 1), 0
    )

    const handlePlaceOrder = async () => {
        let payload = {
            cartItemIds: cartList.map((item: any) => item.id),
            userId: user.id,
        }

        try {
            let response = await placeOrder(payload).unwrap();
          
            
            // Check for the expected success structure
            if (
                response &&
                response?.status === "success"
            ) {

                dispatch(setOrderId(response.data))
                setOrderMessage(response.message || "Your order has been placed successfully");
                setSnackbarMessage(response.message || "Your order has been placed successfully");
                setSnackbarType('success');
                setSnackbarVisible(true);
                setTimeout(() => {
                    router.push('/(home)/successOrder')
                }, 1000);
            } else {
                setOrderMessage("Could not place order, please try again.");
                setSnackbarMessage("Could not place order, please try again.");
                setSnackbarType('error');
                setSnackbarVisible(true);
            }
        } catch (e) {
            setOrderMessage("An error occurred while placing your order.");
            setSnackbarMessage("An error occurred while placing your order.");
            setSnackbarType('error');
            setSnackbarVisible(true);
        }
    }

    return (
        <View style={styles.container}>
            <CSnackbar
                visible={snackbarVisible}
                message={snackbarMessage}
                onClose={() => setSnackbarVisible(false)}
                type={snackbarType}
            />
            {/* CartList will always be visible above the bottom sheet; it scrolls if needed */}
            <View style={styles.cartListContainer}>
                <CartList title="Your Cart Items" hasCheckoutButton={false} />
            </View>
            {/* Optionally you could show a message above or in the bottom sheet */}
            {/* orderMessage && <Text style={{ color: 'green', alignSelf: 'center', marginBottom: 8 }}>{orderMessage}</Text> */}
            {/* Bottom Sheet sits at bottom as regular child, never overlays above CartList */}
            <OrderDetailBottomSheet
                mode="checkout"
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
                    method: "Cash on Delivery",
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
                onChangeAddress={() => console.log("Change delivery address")}
                onChangeBillingAddress={() => console.log("Change billing address")}
                onChangePayment={() => console.log("Change payment method")}
                onApplyPromo={async (code) => {
                    if (code.toUpperCase() === "SAVE10") {
                        return { success: true, discount: 500 }
                    } else {
                        return { success: false, error: "Invalid promo code" }
                    }
                }}
                onPress={handlePlaceOrder}
                loading={isLoading}
                payLoading={isLoading}
            // Pass order message as a prop if OrderDetailBottomSheet supports showing user messages,
            // or handle message showing globally/modally as above with Alert.
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    cartListContainer: {
        flex: 1,
    },
})

export default CheckoutCart