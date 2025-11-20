import CText from '@/components/common/CText'
import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import { primaryGreen, primaryOrange } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

export default function CartProduct({
    onRemove,
    onDecrease,
    onIncrease,
    onAddToCart,
    isMainProduct = false,
    showAddToCart = false,
    isEditing = true,
    marginBottom = 14,
    showBrandProfileImage = false,
    item,
    color,
    size,
    renderQTYSection = true
}: {
    onRemove: () => void,
    onDecrease: () => void,
    onIncrease: () => void,
    onAddToCart?: () => void,
    showAddToCart?: boolean,
    isMainProduct?: boolean,
    isEditing: boolean,
    marginBottom?: number,
    showBrandProfileImage?: boolean,
    renderQTYSection?: boolean,
    item: any,
    color: string,
    size: string,
}) {
    // Helper: Check if color or size available on item
    const hasColor = !!(color && typeof color === 'string' && color.length > 0);
    const hasSize = !!(size && typeof size === 'string' && size.length > 0);

    return (
        <View style={[styles.cartProduct, { marginBottom }]}>
            <View style={styles.productImageContainer}>
                <Image source={{ uri: item?.post?.url }} style={styles.productImage} />
                {/* Show Brand Profile Image ON Product image if enabled */}
                {showBrandProfileImage && (
                    <CTouchableOpacity onPress={() => { }} style={styles.brandProfileImageWrapper}>
                        <Image
                            source={{
                                uri: item?.user?.logoUrl
                            }}
                            style={styles.brandProfileImage}
                        />
                    </CTouchableOpacity>
                )}
            </View>
            <View style={styles.infoContainer}>
                <CText style={[styles.brandName, {
                    marginTop: isMainProduct ? 10 : 0,
                }]}>
                    {item?.user?.brandName}
                </CText>
                <CText style={styles.productTitle}>{item?.post?.title}</CText>
                {/* Conditionally show color and size */}
                {(hasColor || hasSize) && (
                    <View style={{ flexDirection: "row", marginVertical: 2 }}>
                        {hasColor && (
                            <View style={{ marginRight: hasSize ? 12 : 0, flexDirection: "row", alignItems: "center" }}>
                                <CText style={{ fontSize: 12, color: primaryGreen, fontFamily: "PoppinsSemiBold" }}>
                                    Color:
                                </CText>
                                <View style={{
                                    borderColor: primaryGreen,
                                    borderWidth: 1,
                                    backgroundColor: color,
                                    width: 15,
                                    height: 15,
                                    borderRadius: 50,
                                    marginLeft: 5,
                                    marginBottom: 2,
                                }}>

                                </View>
                            </View>
                        )}
                        {hasSize && (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <CText style={{ fontSize: 12, color: primaryGreen, fontFamily: "PoppinsSemiBold" }}>
                                    Size:
                                </CText>
                                <CText style={{ fontSize: 12, color: "#222", marginLeft: 3 }}>
                                    {size}
                                </CText>
                            </View>
                        )}
                    </View>
                )}
                <View style={styles.priceRow}>
                    <CText style={styles.discountPrice}>Rs. {item?.post?.discountedPrice}</CText>
                    <CText style={styles.originalPrice}>Rs. {item?.post?.price}</CText>
                </View>
                <View style={styles.qtyRow}>
                    {renderQTYSection && isEditing ? (
                        <>
                            <CTouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
                                <Ionicons name="remove-circle-outline" size={22} color="#e86429" />
                            </CTouchableOpacity>
                            <CText style={styles.qtyText}>{item?.quantity}</CText>
                            <CTouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
                                <Ionicons name="add-circle-outline" size={22} color="#37b56c" />
                            </CTouchableOpacity>
                        </>
                    ) : renderQTYSection ? (
                        // only show qty text if not editing
                        <CText style={styles.qtyText}>Qty: {item.qty}</CText>
                    ) : (
                        <></>
                    )}
                    {/* Show Add to Cart icon if showAddToCart is true */}
                </View>
            </View>
            {/* Remove Trash icon if not editing */}
            {isEditing === true && !showAddToCart && (
                <CTouchableOpacity style={styles.deleteBtn} onPress={onRemove}>
                    <Ionicons name="trash-outline" size={20} color="#c00" />
                </CTouchableOpacity>
            )}

            {showAddToCart === true && (
                <TouchableOpacity
                    style={styles.addToCartBtn}
                    onPress={() => {

                        console.log("onAddToCart", onAddToCart);

                        onAddToCart && onAddToCart()
                    }}
                >
                    <Ionicons name="cart-outline" size={22} color="#e8744a" />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    cartProduct: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingBottom: 3,
        paddingHorizontal: 11,
        marginHorizontal: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#F3F3F6",
        position: 'relative',
    },
    productImageContainer: {
        position: 'relative',
        marginRight: 10,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 2,
        resizeMode: "contain",
        backgroundColor: "#f5f5f5",
    },
    // Brand profile image on top left of main image
    brandProfileImageWrapper: {
        position: 'absolute',
        top: 6,
        left: 6,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: primaryOrange,
        borderRadius: 20,
        padding: 2,
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    brandProfileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FFE5D1',
        backgroundColor: "#fff",
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    brandName: {
        fontSize: 12,
        color: "#368",
        fontFamily: 'PoppinsSemiBold',
    },
    productTitle: {
        fontSize: 12,
        color: "#222",
        marginTop: 1,
        marginBottom: 3,
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    discountPrice: {
        color: "#e8744a",
        fontWeight: "700",
        marginRight: 7
    },
    originalPrice: {
        color: "#b1b1b1",
        textDecorationLine: 'line-through',
        fontSize: 12,
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 7,
    },
    qtyBtn: {
        padding: 3
    },
    qtyText: {
        fontSize: 15,
        fontFamily: 'PoppinsSemiBold'
    },
    deleteBtn: {
        position: 'absolute',
        right: 10,
        top: 5,
        padding: 4,
    },
    addToCartBtn: {
        position: 'absolute',
        right: 10,
        top: 5,
        padding: 4,
        borderRadius: 16,
        backgroundColor: '#fff4ed',
    },
})