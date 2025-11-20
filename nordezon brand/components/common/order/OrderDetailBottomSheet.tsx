import { primaryOrange } from '@/constants/colors'
import { currencySymbol } from '@/constants/keys'
import { capitalizeFirstLetter, getStatusColor } from '@/helpers'
import { useUpdateUserAddressMutation } from '@/store/api/v1/user'
import { setUserAdditionalFields } from '@/store/slices/user'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import CButton from '../CButton'
import CText from '../CText'
import CTextField from '../CTextField'
import CTouchableOpacity from '../CTouchableOpacity'

// --- Skeleton component for loading state ---
const Skeleton = ({ style }: { style?: any }) => (
    <View style={[{
        backgroundColor: '#e8e9ec',
        borderRadius: 6,
        minHeight: 16,
        minWidth: 60,
        overflow: 'hidden',
    }, style]}>
        {/* This is a basic placeholder. For shimmer effect, use a library or Animated if needed */}
    </View>
)

/* ------ Reusable text field component for editing addresses ------*/

type Address = {
    name: string,
    phone: string,       /* ------ phone is always a string ------*/
    address: string
}
type PaymentSummary = {
    method: string,
    icon: string
}
type OrderSummary = {
    totalItems: number,
    subTotal: number,
    shipping: number,
    promoCode?: string,
    promoDiscount?: number,
    grandTotal: number,
}

type OrderDetailBottomSheetProps = {
    mode: 'checkout' | 'orderDetail',
    btnText?: string,
    orderId?: string,
    orderStatus?: string,
    btnIcon?: any,
    loading?: boolean,
    deliveryAddress: Address,
    billingAddress: Address,
    paymentSummary: PaymentSummary,
    summary: OrderSummary,
    onChangeAddress?: () => void,
    onChangeBillingAddress?: () => void,
    onChangePayment?: () => void,
    onApplyPromo?: (code: string) => Promise<{ success: boolean, discount?: number, error?: string }>,
    promoLoading?: boolean,
    onRemovePromo?: () => void,
    onPress?: () => void,
    payLoading?: boolean,
    promoApplied?: boolean,
    promoError?: string,
    setPromoError?: (val: string) => void,
    setPromoCodeExternal?: (val: string) => void,
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window')


export default function OrderDetailBottomSheet(props: OrderDetailBottomSheetProps) {
    const {
        mode,
        deliveryAddress,
        billingAddress,
        paymentSummary,
        summary,
        orderId = "",
        orderStatus = "",
        /* ------ onChangeAddress, ------*/
        /* ------ onChangeBillingAddress, ------*/
        onChangePayment,
        onApplyPromo,
        promoLoading = false,
        loading = false,
        onRemovePromo,
        onPress,
        payLoading = false,
        promoApplied = false,
        promoError = "",
        setPromoError,
        setPromoCodeExternal,
        btnText = "Pay Now",
        btnIcon = <Ionicons name="arrow-forward-circle" size={22} color="#fff" style={{ marginLeft: 8 }} />
    } = props

    /* ------ Only needed for checkout mode ------*/
    const [promoCode, setPromoCode] = useState(summary.promoCode ?? "")
    const [saveAddress,] = useUpdateUserAddressMutation()

    const isCheckout = mode === "checkout"

    const dispatch = useDispatch();

    /* ------ Manage local state for delivery and billing address fields (for editing UI) ------*/
    const [editingDelivery, setEditingDelivery] = useState(false);
    const [editingBilling, setEditingBilling] = useState(false);

    const [editDeliveryValues, setEditDeliveryValues] = useState(() => ({
        name: deliveryAddress?.name || "",
        phone: deliveryAddress?.phone || "", /* ------ always string ------*/
        address: deliveryAddress?.address || ""
    }));
    const [editBillingValues, setEditBillingValues] = useState(() => ({
        name: billingAddress?.name || "",
        phone: billingAddress?.phone || "", /* ------ always string ------*/
        address: billingAddress?.address || ""
    }));

    /* ------ State for local loading for address saving ------*/
    const [savingDelivery, setSavingDelivery] = useState(false);
    const [savingBilling, setSavingBilling] = useState(false);

    /* ------ State for local validation error messages ------*/
    const [deliveryError, setDeliveryError] = useState("");
    const [billingError, setBillingError] = useState("");

    /* ------ Optionally sync promo code up ------*/
    const handlePromoInput = (code: string) => {
        setPromoCode(code)
        if (setPromoCodeExternal) setPromoCodeExternal(code)
        if (setPromoError) setPromoError("")
    }

    const handleApplyPromo = async () => {
        if (!onApplyPromo) return
        if (!promoCode.trim()) return

        if (setPromoError) setPromoError("")
        const res = await onApplyPromo(promoCode.trim())
        if (!res.success) {
            if (setPromoError) setPromoError(res.error || "Failed to apply promo code")
        }
    }

    /* ------ Helper function to check if an address object has any empty fields (name, phone, address) ------*/
    const hasEmptyAddressFields = (obj: { name: string; phone: string; address: string }) => {
        return !obj.name.trim() || !obj.phone.trim() || !obj.address.trim();
    }

    /* ------ Use saveAddress mutation to persist delivery address ------*/
    const handleSaveDelivery = async () => {
        /* ------ Validate fields as needed ------*/
        if (hasEmptyAddressFields(editDeliveryValues)) {
            setDeliveryError("Cannot save empty fields.")
            return
        }
        setDeliveryError("")
        setSavingDelivery(true)
        try {
            let payload = {
                fullName: editDeliveryValues.name,
                address: editDeliveryValues.address,
                phoneNumber: editDeliveryValues.phone ? editDeliveryValues.phone : undefined,
            }
            await saveAddress(payload);
            dispatch(setUserAdditionalFields(payload))
            setEditingDelivery(false)
            /* ------ Optionally call props.onChangeAddress with editDeliveryValues if needed ------*/
        } catch (e) {
            /* ------ You can add failed toast/alert here if needed ------*/
        } finally {
            setSavingDelivery(false)
        }
    }

    /* ------ Use saveAddress mutation to persist billing address ------*/
    const handleSaveBilling = async () => {
        /* ------ Validate fields as needed ------*/
        if (hasEmptyAddressFields(editBillingValues)) {
            setBillingError("Cannot save empty fields.")
            return
        }
        setBillingError("")
        setSavingBilling(true)
        try {
            let payload = {
                billingName: editBillingValues.name,
                billingAddress: editBillingValues.address,
                billingPhone: editBillingValues.phone ? editBillingValues.phone : undefined,
            }
            await saveAddress(payload)
            dispatch(setUserAdditionalFields(payload))
            setEditingBilling(false)
            /* ------ Optionally call props.onChangeBillingAddress with editBillingValues if needed ------*/
        } catch (e) {
            /* ------ You can add failed toast/alert here if needed ------*/
        } finally {
            setSavingBilling(false)
        }
    }

    const handleCancelDelivery = () => {
        setEditDeliveryValues({
            name: deliveryAddress?.name || "",
            phone: deliveryAddress?.phone || "",
            address: deliveryAddress?.address || ""
        });
        setDeliveryError("");
        setEditingDelivery(false)
    }
    const handleCancelBilling = () => {
        setEditBillingValues({
            name: billingAddress?.name || "",
            phone: billingAddress?.phone || "",
            address: billingAddress?.address || ""
        });
        setBillingError("");
        setEditingBilling(false)
    }

    // --- SKELETONS ---

    const SkeletonOrderInfo = () => (
        <View style={styles.orderInfoContainer}>
            <Skeleton style={{ width: 140, height: 18, marginBottom: 8 }} />
            <Skeleton style={{ width: 90, height: 14, marginBottom: 2 }} />
        </View>
    );

    const SkeletonSection = ({ labelIconColor = "#e8744a", label = "Label" }) => (
        <View style={styles.section}>
            <View style={styles.sectionRow}>
                <Skeleton style={{ width: 26, height: 22, borderRadius: 13, marginRight: 8, backgroundColor: labelIconColor }} />
                <Skeleton style={{ width: 120, height: 19, borderRadius: 4 }} />
            </View>
            <View style={styles.addrBlock}>
                <Skeleton style={{ height: 14, width: 100, marginBottom: 7 }} />
                <Skeleton style={{ height: 14, width: 160, marginBottom: 7 }} />
                <Skeleton style={{ height: 12, width: 75, marginBottom: 4 }} />
            </View>
        </View>
    );

    const SkeletonPayment = () => (
        <View style={styles.section}>
            <View style={styles.sectionRow}>
                <Skeleton style={{ width: 26, height: 22, borderRadius: 13, marginRight: 8, backgroundColor: "#5a79e8" }} />
                <Skeleton style={{ width: 80, height: 19, borderRadius: 4 }} />
            </View>
            <View style={styles.paymentBlock}>
                <Skeleton style={{ width: 25, height: 19, borderRadius: 10, marginRight: 10 }} />
                <Skeleton style={{ width: 90, height: 14, borderRadius: 5 }} />
                <Skeleton style={{ width: 50, height: 20, borderRadius: 5, marginLeft: 10 }} />
            </View>
        </View>
    );

    const SkeletonSummary = () => (
        <View style={styles.summaryContainer}>
            <Skeleton style={{ width: 170, height: 22, borderRadius: 7, marginBottom: 17 }} />
            <View style={styles.row}>
                <Skeleton style={{ width: 110, height: 14 }} />
                <Skeleton style={{ width: 44, height: 14 }} />
            </View>
            <View style={styles.row}>
                <Skeleton style={{ width: 66, height: 14 }} />
                <Skeleton style={{ width: 60, height: 14 }} />
            </View>
            <View style={styles.rowTotal}>
                <Skeleton style={{ width: 120, height: 17 }} />
                <Skeleton style={{ width: 70, height: 19 }} />
            </View>
            <Skeleton style={{ width: "100%", height: 42, borderRadius: 5, marginTop: 5 }} />
        </View>
    );

    return (
        <View style={styles.bottomSheetContainer}>
            <View style={styles.dragHandleContainer}>
                <View style={styles.dragHandle} />
            </View>
            {loading ? (
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                    persistentScrollbar={true}
                >
                    {/* Skeleton Scroll hint */}
                    <View style={styles.scrollHintContainer}>
                        <Skeleton style={{ width: 24, height: 17, borderRadius: 8, marginRight: 8 }} />
                        <Skeleton style={{ width: 120, height: 13, borderRadius: 5 }} />
                    </View>
                    {/* Skeleton order info */}
                    {mode != "checkout" && <SkeletonOrderInfo />}
                    {/* Delivery */}
                    <SkeletonSection labelIconColor="#e8744a" />
                    {/* Billing */}
                    {mode == "checkout" && <SkeletonSection labelIconColor="#37b56c" />}
                    {/* Payment */}
                    <SkeletonPayment />
                    {/* Add promo code skeleton here if desired */}
                    <SkeletonSummary />
                </ScrollView>
            ) : (
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                    persistentScrollbar={true}
                >
                    {/* /* ------ Highlighted Banner to hint scrollability ------*/}
                    <View style={styles.scrollHintContainer}>
                        <Ionicons name="chevron-down" size={18} color="#bbb" />
                        <CText style={styles.scrollHintText}>
                            Swipe up for more details
                        </CText>
                    </View>

                    {
                        mode != "checkout" && (
                            <View style={styles.orderInfoContainer}>
                                <CText style={styles.orderIdText}>Order ID: <CText style={styles.bold}>{orderId}</CText></CText>
                                <CText style={styles.statusLabel}>
                                    Status:{' '}
                                    <CText style={[
                                        styles.statusValue,
                                        {
                                            color: getStatusColor(orderStatus)
                                        }
                                    ]}>
                                        {capitalizeFirstLetter(orderStatus)}
                                    </CText>
                                </CText>
                            </View>
                        )
                    }

                    {/* ------ Delivery Address ---- */}
                    <View style={styles.section}>
                        <View style={styles.sectionRow}>
                            <Ionicons name="location-outline" color="#e8744a" size={22} style={{ marginRight: 8 }} />
                            <CText style={styles.sectionHeading}>Delivery Address</CText>
                        </View>
                        <View style={styles.addrBlock}>
                            {editingDelivery ? (
                                <>
                                    <CTextField
                                        label="Name"
                                        value={editDeliveryValues.name}
                                        onChangeText={(val: any) => setEditDeliveryValues({ ...editDeliveryValues, name: val })}
                                        autoCapitalize="words"
                                        editable={!savingDelivery}
                                    />
                                    <CTextField
                                        label="Phone"
                                        value={editDeliveryValues.phone}
                                        onChangeText={(val: any) => setEditDeliveryValues({ ...editDeliveryValues, phone: val })}
                                        keyboardType="phone-pad"
                                        editable={!savingDelivery}
                                    />
                                    <CTextField
                                        label="Address"
                                        value={editDeliveryValues.address}
                                        onChangeText={(val: any) => setEditDeliveryValues({ ...editDeliveryValues, address: val })}
                                        multiline
                                        editable={!savingDelivery}
                                    />
                                    {deliveryError ? (
                                        <CText style={styles.fieldErrorText}>{deliveryError}</CText>
                                    ) : null}
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <CTouchableOpacity style={[styles.changeBtn, { marginRight: 10 }]} onPress={handleCancelDelivery} disabled={savingDelivery}>
                                            {!savingDelivery && (
                                                <CText style={[styles.changeBtnText, { color: '#7c7c7c' }]}>Cancel</CText>
                                            )}
                                        </CTouchableOpacity>
                                        <CTouchableOpacity style={styles.changeBtn} onPress={handleSaveDelivery} disabled={savingDelivery}>
                                            {savingDelivery ? (
                                                <ActivityIndicator size="small" color={primaryOrange} style={{ marginRight: 4 }} />
                                            ) :
                                                <CText style={[styles.changeBtnText, { color: primaryOrange }]}>Save</CText>
                                            }
                                        </CTouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <CText style={styles.addrName}>{editDeliveryValues.name} ({editDeliveryValues.phone})</CText>
                                    <CText style={styles.addrText}>{editDeliveryValues.address}</CText>
                                    {isCheckout ? (
                                        <CTouchableOpacity style={styles.changeBtn} onPress={() => setEditingDelivery(true)}>
                                            <CText style={styles.changeBtnText}>Change</CText>
                                        </CTouchableOpacity>
                                    ) : null}
                                </>
                            )}
                        </View>
                    </View>

                    {/* ------ Billing Address ------ */}
                    {
                        mode == "checkout" && (
                            <View style={styles.section}>
                                <View style={styles.sectionRow}>
                                    <Ionicons name="person-circle-outline" color="#37b56c" size={22} style={{ marginRight: 8 }} />
                                    <CText style={styles.sectionHeading}>Billing Address</CText>
                                </View>
                                <View style={styles.addrBlock}>
                                    {editingBilling ? (
                                        <>
                                            <CTextField
                                                label="Name"
                                                value={editBillingValues.name}
                                                onChangeText={(val: any) => setEditBillingValues({ ...editBillingValues, name: val })}
                                                autoCapitalize="words"
                                                editable={!savingBilling}
                                            />
                                            <CTextField
                                                label="Phone"
                                                value={editBillingValues.phone}
                                                onChangeText={(val: any) => setEditBillingValues({ ...editBillingValues, phone: val })}
                                                keyboardType="phone-pad"
                                                editable={!savingBilling}
                                            />
                                            <CTextField
                                                label="Address"
                                                value={editBillingValues.address}
                                                onChangeText={(val: any) => setEditBillingValues({ ...editBillingValues, address: val })}
                                                multiline
                                                editable={!savingBilling}
                                            />
                                            {billingError ? (
                                                <CText style={styles.fieldErrorText}>{billingError}</CText>
                                            ) : null}
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <CTouchableOpacity style={[styles.changeBtn, { marginRight: 10 }]} onPress={handleCancelBilling} disabled={savingBilling}>
                                                    {!savingDelivery && (
                                                        <CText style={[styles.changeBtnText, { color: '#7c7c7c' }]}>Cancel</CText>
                                                    )}
                                                </CTouchableOpacity>
                                                <CTouchableOpacity style={styles.changeBtn} onPress={handleSaveBilling} disabled={savingBilling}>
                                                    {savingBilling ? (
                                                        <ActivityIndicator size="small" color={primaryOrange} style={{ marginRight: 4 }} />
                                                    ) :
                                                        <CText style={[styles.changeBtnText, { color: primaryOrange }]}>Save</CText>
                                                    }
                                                </CTouchableOpacity>
                                            </View>
                                        </>
                                    ) : (
                                        <>
                                            <CText style={styles.addrName}>{editBillingValues.name} ({editBillingValues.phone})</CText>
                                            <CText style={styles.addrText}>{editBillingValues.address}</CText>
                                            {isCheckout ? (
                                                <CTouchableOpacity style={styles.changeBtn} onPress={() => setEditingBilling(true)}>
                                                    <CText style={styles.changeBtnText}>Change</CText>
                                                </CTouchableOpacity>
                                            ) : null}
                                        </>
                                    )}
                                </View>
                            </View>
                        )
                    }

                    {/* ----- Payment ----- */}
                    <View style={styles.section}>
                        <View style={styles.sectionRow}>
                            <Ionicons name="card-outline" color="#5a79e8" size={22} style={{ marginRight: 8 }} />
                            <CText style={styles.sectionHeading}>Payment</CText>
                        </View>
                        <View style={styles.paymentBlock}>
                            <Ionicons name={paymentSummary.icon as any} color="#37b56c" size={19} style={{ marginRight: 7 }} />
                            <CText style={styles.paymentText}>{paymentSummary.method}</CText>
                            {isCheckout && onChangePayment ? (
                                <CTouchableOpacity style={styles.changeBtnSmall} onPress={onChangePayment}>
                                    <CText style={styles.changeBtnTextSmall}>Change</CText>
                                </CTouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                    {/* 
                        ------ Promo Code - Only in checkout ------
                        */}
                    {/* {isCheckout ? (
                        <View style={styles.section}>
                            <CText style={styles.sectionHeading}>Promo Code</CText>
                            {!promoApplied ? (
                                <>
                                    <View style={styles.promoRow}>
                                        <TextInput
                                            style={styles.promoInput}
                                            placeholder="Enter code"
                                            placeholderTextColor="#bbb"
                                            value={promoCode}
                                            onChangeText={handlePromoInput}
                                            autoCapitalize="characters"
                                            autoCorrect={false}
                                            editable={!promoLoading}
                                        />
                                        <CTouchableOpacity
                                            style={[
                                                styles.promoBtn,
                                                !(promoCode.trim()) && { opacity: 0.54 },
                                                promoLoading && { opacity: 0.5 }
                                            ]}
                                            onPress={handleApplyPromo}
                                            disabled={!promoCode.trim() || promoLoading}
                                        >
                                            <CText style={styles.promoBtnText}>Apply</CText>
                                        </CTouchableOpacity>
                                    </View>
                                    {promoError ? (
                                        <CText style={styles.promoErrorText}>
                                            {promoError}
                                        </CText>
                                    ) : null}
                                </>
                            ) : (
                                <View style={styles.promoAppliedRow}>
                                    <Ionicons name="checkmark-circle" size={20} color="#31c167" style={{ marginRight: 4 }} />
                                    <CText style={styles.promoAppliedText}>
                                        <>{promoCode.trim().toUpperCase()}</> applied - Rs. {promoDiscount} off!
                                    </CText>
                                    {onRemovePromo ? (
                                        <CTouchableOpacity onPress={onRemovePromo}>
                                            <Ionicons name="close-circle" size={20} color="#e9694a" style={{ marginLeft: 5 }} />
                                        </CTouchableOpacity>
                                    ) : null}
                                </View>
                            )}
                        </View>
                    ) : null} */}

                    <View style={styles.summaryContainer}>
                        <CText style={styles.heading}>{isCheckout ? 'Checkout Summary' : 'Order Summary'}</CText>
                        <View style={styles.row}>
                            <CText style={styles.label}>Total Items</CText>
                            <CText style={styles.value}>{summary.totalItems}</CText>
                        </View>
                        <View style={styles.row}>
                            <CText style={styles.label}>Total</CText>
                            <CText style={styles.value}>{currencySymbol} {summary.grandTotal}</CText>
                        </View>
                        {/* <View style={styles.row}>
                            <CText style={styles.label}>Shipping</CText>
                            <CText style={styles.value}>Rs. {summary.shipping}</CText>
                        </View> */}
                        {/* {isCheckout && promoApplied ? (
                            <View style={styles.row}>
                                <CText style={styles.label}>Promo Discount</CText>
                                <CText style={[styles.value, { color: "#31c167" }]}>- Rs. {promoDiscount}</CText>
                            </View>
                        ) : null} */}
                        <View style={styles.rowTotal}>
                            <CText style={styles.totalLabel}>Total {mode == 'orderDetail' ? "Paid" : "Payable"} </CText>
                            <CText style={styles.totalValue}>Rs. {summary.grandTotal}</CText>
                        </View>
                        <CButton
                            text={btnText}
                            style={styles.button}
                            loading={payLoading}
                            afterIcon={btnIcon}
                            textStyle={styles.buttonText}
                            onPress={() => {
                                onPress && onPress()
                            }}
                        />
                    </View>

                </ScrollView>
            )}

            <View style={styles.bottomFade} pointerEvents="none" />
        </View>
    )
}

const styles = StyleSheet.create({
    textField: {
        borderWidth: 1,
        borderColor: '#dedede',
        borderRadius: 6,
        paddingVertical: 7,
        paddingHorizontal: 13,
        fontSize: 15,
        fontFamily: 'PoppinsRegular',
        color: '#232323',
        backgroundColor: '#fcfcfc',
        marginBottom: 3
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
    bottomSheetContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        shadowColor: "#222",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 5,
        paddingBottom: 24,
        maxHeight: SCREEN_HEIGHT * 0.56,
        minHeight: SCREEN_HEIGHT * 0.48,
        paddingTop: 0,
        overflow: 'hidden',
        position: 'relative',
    },
    dragHandleContainer: {
        alignItems: 'center',
        height: 26,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    dragHandle: {
        width: 44,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#d0d0d5",
        marginTop: 8,
        marginBottom: 4,
        opacity: 0.60,
    },
    scrollHintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#f0f3fa",
        borderRadius: 7,
        marginHorizontal: 24,
        marginBottom: 16,
        paddingVertical: 5,
    },
    scrollHintText: {
        marginLeft: 4,
        fontSize: 13,
        color: "#909090",
        fontFamily: "PoppinsSemiBold",
        letterSpacing: 0.1,
    },
    section: {
        marginHorizontal: 12,
        marginBottom: 15
    },
    sectionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4
    },
    sectionHeading: {
        fontSize: 17,
        fontFamily: 'PoppinsSemiBold',
        color: "#232323",
        marginBottom: 6
    },
    addrBlock: {
        borderWidth: 1,
        borderColor: "#F3F3F6",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#FFF"
    },
    addrName: {
        fontFamily: "PoppinsSemiBold",
        fontSize: 14,
        marginBottom: 2,
        color: "#2c3e50"
    },
    addrText: {
        fontSize: 13,
        color: "#6d757d",
        marginBottom: 2
    },
    changeBtn: {
        alignSelf: "flex-end",
        marginTop: 3,
        flexDirection: "row",
        alignItems: "center"
    },
    changeBtnText: {
        color: "#3a8bfa",
        fontFamily: "PoppinsSemiBold",
        fontSize: 13
    },
    paymentBlock: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F3F3F6",
        borderRadius: 8,
        padding: 11,
        backgroundColor: "#FFF"
    },
    paymentText: {
        fontSize: 14,
        color: "#454545",
        marginRight: 10,
        fontFamily: "PoppinsSemiBold"
    },
    changeBtnSmall: {
        paddingHorizontal: 9,
        paddingVertical: 1,
        borderRadius: 3
    },
    changeBtnTextSmall: {
        color: "#3a8bfa",
        fontFamily: "PoppinsSemiBold",
        fontSize: 13
    },

    summaryContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: "#222",
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2,
        marginHorizontal: 12,
        marginTop: 6,
    },
    heading: {
        fontSize: 20,
        fontFamily: 'PoppinsSemiBold',
        marginBottom: 16,
        color: "#232323",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 15,
        color: "#777",
    },
    value: {
        fontFamily: "PoppinsSemiBold",
        color: "#444",
        fontSize: 15,
    },
    rowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 13,
        paddingTop: 11,
        borderTopWidth: 1,
        borderTopColor: "#EEEFF1",
        marginBottom: 21,
    },
    totalLabel: {
        fontSize: 17,
        color: primaryOrange,
        fontFamily: 'PoppinsSemiBold'
    },
    totalValue: {
        fontSize: 18,
        color: primaryOrange,
        fontFamily: 'PoppinsBold'
    },
    payBtn: {
        backgroundColor: primaryOrange,
        paddingVertical: 15,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    payBtnText: {
        color: "#fff",
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16
    },
    bottomFade: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 20,
        backgroundColor: 'transparent',
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 9,
        zIndex: 10,
        pointerEvents: 'none',
    },
    /* ------ Promo code specific styles ------*/
    promoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    promoInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#dedede',
        borderRadius: 6,
        paddingVertical: 7,
        paddingHorizontal: 13,
        fontSize: 15,
        fontFamily: 'PoppinsRegular',
        color: '#232323',
        backgroundColor: '#fcfcfc',
        marginRight: 10,
    },
    promoBtn: {
        backgroundColor: primaryOrange,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    promoBtnText: {
        color: "#fff",
        fontFamily: "PoppinsSemiBold",
        fontSize: 14
    },
    promoAppliedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#f2faf4",
        padding: 10,
        borderRadius: 6,
        marginTop: 4,
    },
    promoAppliedText: {
        color: "#31c167",
        fontSize: 15,
        fontFamily: 'PoppinsSemiBold'
    },
    promoErrorText: {
        marginTop: 5,
        color: "#e9694a",
        fontSize: 13,
        fontFamily: "PoppinsRegular"
    },
    /* ------ Field input error for empty check ------*/
    fieldErrorText: {
        color: "#e9694a",
        fontSize: 13,
        fontFamily: "PoppinsRegular",
        marginTop: 5,
        marginBottom: 2
    },
    orderInfoContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderIdText: {
        fontSize: 16,
        color: '#222',
        marginBottom: 2,
    },
    statusLabel: {
        fontSize: 15,
        color: '#666',
    },
    statusValue: {
        fontFamily: 'PoppinsSemiBold',
        textTransform: 'capitalize',
    },
    processing: {
        color: '#ffa500',
    },
    bold: {
        fontFamily: 'PoppinsSemiBold',

    }
})