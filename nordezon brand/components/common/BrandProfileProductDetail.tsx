import { primaryOrange } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import CText from './CText'
import CTouchableOpacity from './CTouchableOpacity'

export default function BrandProfileProductDetail({
    showRatingReviews = true
}: {
    showRatingReviews?: boolean
}) {
    const { selectedEntity } = useSelector((state: any) => state.post)



    // Calculate average rating from ratings array if present, fallback if not
    let averageRating = 0
    // Try to get array of ratings. Adapt field if backend provides different key.
    const ratingsArr = selectedEntity?.item?.ratings // should be array of numbers or objects with value
    const ratingCount = Array.isArray(ratingsArr) ? ratingsArr.length : (selectedEntity?.item?.ratingCount ?? 0)
    if (Array.isArray(ratingsArr) && ratingsArr.length > 0) {
        // If array is number[]
        if (typeof ratingsArr[0] === "number") {
            averageRating = ratingsArr.reduce((acc, num) => acc + num, 0) / ratingsArr.length
        }
        // If array is {value: number}[]
        else if (typeof ratingsArr[0] === "object" && "value" in ratingsArr[0]) {
            averageRating = ratingsArr.reduce((acc, obj) => acc + (obj.value ?? 0), 0) / ratingsArr.length
        }
    } else if (selectedEntity?.item?.averageRating !== undefined) {
        averageRating = selectedEntity?.item?.averageRating
    }

    // Limit to 1 decimal
    const averageRatingDisplay = averageRating ? averageRating.toFixed(1) : "0.0"

    const handlePressNavigate = () => {
        router.push({
            pathname: "/(home)/brandProfileVisit",
            params: {
                brandId: selectedEntity?.item?.user?.id
            }
        })
    }

    return (
        <>
            {/* Brand Info */}
            <View style={styles.brandRow}>
                <CTouchableOpacity onPress={handlePressNavigate}>
                    <Image source={{ uri: selectedEntity?.item?.user?.logoUrl }} style={styles.brandLogo} />
                </CTouchableOpacity>
                <View style={{ marginLeft: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <CTouchableOpacity onPress={handlePressNavigate}>
                            <CText style={styles.brandName}>{selectedEntity?.item?.user?.brandName}</CText>
                        </CTouchableOpacity>
                        {/* Verified check (always show, or optionally PRODUCT.brand.verified) */}
                        {
                            selectedEntity?.item?.user?.isApprovedByLawyer && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={18}
                                    color={primaryOrange}
                                    style={styles.verifiedCheck}
                                />

                            )
                        }

                    </View>
                    {
                        showRatingReviews && (

                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 1 }}>
                                <Ionicons name="star" size={15} color="#FFBE65" />
                                <CText style={styles.ratingText}>{averageRatingDisplay}</CText>
                                <CText style={styles.reviewText}>({ratingCount} reviews)</CText>
                            </View>

                        )
                    }
                </View>
                <View style={{ flex: 1 }} />
                <CTouchableOpacity
                    onPress={handlePressNavigate}
                    activeOpacity={0.75}
                    style={styles.visitBrandBtn}
                >
                    <Ionicons name="storefront-outline" color={primaryOrange} size={17} />
                    <CText style={styles.visitBrandBtnText}>Brand Profile</CText>
                </CTouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
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
    // Add verified check icon style next to brandName
    verifiedCheck: {
        marginLeft: 6,
        marginTop: 1,
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
})