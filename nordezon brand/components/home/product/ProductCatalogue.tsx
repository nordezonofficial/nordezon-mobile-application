import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import { primaryOrange } from '@/constants/colors'
import { currencySymbol } from '@/constants/keys'
import { setSelectedEntity } from '@/store/slices/post'
import { router } from 'expo-router'
import React from 'react'
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CText from '../../common/CText'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_MARGIN = 10
const CARD_WIDTH = (SCREEN_WIDTH / 2) - (CARD_MARGIN * 2.5)

const ProductCatalogue = ({
    minus = 10,
    item,
    onPressImage,
    onPressTitle,
    onPressBrand,
}: {
    minus?: number
    item?: any,
    onPressImage?: () => void,
    onPressTitle?: () => void,
    onPressBrand?: () => void,
}) => {
    const dispatch = useDispatch();
    const { selectedEntity } = useSelector((state: any) => state.post)
    const handlePress = (param: string) => {
        if (param == "BRAND") {
            router.push({
                pathname: "/(home)/brandProfileVisit",
                params: {
                    brandId: item?.user?.id
                }
            })
        }

        if (param == "PRODUCT") {
            dispatch(setSelectedEntity({
                id: item.id,
                requestType: "POST",
                backId: selectedEntity.id,
                backItem: selectedEntity.item,
            }))
            router.replace({
                pathname: '/(home)/productDetail',
                params: {
                    id: item.id
                }
            });
        }
    }

    return (
        <View style={[styles.container, {
            width: CARD_WIDTH - minus,
        }]}>
            <CTouchableOpacity onPress={() => handlePress("PRODUCT")}>
                <ImageBackground
                    source={{ uri: item?.url }}
                    style={styles.productImageBg}
                    imageStyle={styles.productImageStyle}
                />
            </CTouchableOpacity>
            <View style={styles.detailsBox}>
                <CTouchableOpacity activeOpacity={0.8} onPress={() => handlePress("PRODUCT")}>
                    <CText
                        style={styles.title}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >
                        {item?.title}
                    </CText>
                </CTouchableOpacity>
                <CTouchableOpacity activeOpacity={0.8} onPress={() => handlePress("BRAND")}>
                    <CText style={styles.brand}>{item?.user?.brandName}</CText>
                </CTouchableOpacity>
                <View style={styles.priceRow}>
                    <CText style={styles.price}>
                        {currencySymbol}  {item?.discountedPrice ? item?.discountedPrice?.toFixed(2) : item?.price?.toFixed(2)}
                    </CText>
                    {item?.discountedPrice &&
                        <CText style={styles.oldPrice}>{currencySymbol} {item?.price?.toFixed(0)}</CText>
                    }
                </View>
                <View style={styles.ratingRow}>
                    <CText style={styles.ratingText}> {item?.averageRating && item?.averageRating?.toFixed(2) != 0 ? `⭐ ${item?.averageRating?.toFixed(2)}` : ''}</CText>
                    <CText style={styles.reviewText}>
                        {item?.totalReviews != 0 ? '(' : ''}{item?.totalReviews != 0 ? (item?.totalReviews) : ''}{item?.totalReviews != 0 ? ')' : ''}
                    </CText>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 8,
        margin: CARD_MARGIN - 8,

        shadowColor: "#373737",
        borderColor: '#eeeeee',
        borderWidth: 1,
        overflow: 'hidden',
    },
    productImageBg: {
        width: '100%',
        aspectRatio: 0.75,
        justifyContent: 'flex-end',
    },
    productImageStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    detailsBox: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        paddingVertical: 9,
        paddingHorizontal: 5,
        // Ensure details are below the image with a little overlap effect if wanted
        elevation: 2,
        shadowColor: "#373737",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        marginTop: -4,
    },
    title: {
        fontSize: 13,
        color: "#232323",
        marginBottom: 3,
        // Truncate long titles with ellipsis
        width: '100%',
    },
    brand: {
        fontSize: 11,
        fontFamily: 'PoppinsSemiBold',
        color: "#339",
        marginBottom: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    price: {
        color: primaryOrange,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 12,
        marginRight: 7,
    },
    oldPrice: {
        color: "#b0b0b0",
        textDecorationLine: 'line-through',
        fontSize: 10,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 1,
    },
    ratingText: {
        fontSize: 13,
        color: "#f7b81e",
        marginRight: 5
    },
    reviewText: {
        fontSize: 11,
        color: "#989898"
    },
    descriptionLabel: {
        display: 'none'
    },
    description: {
        display: 'none'
    },
});

export default ProductCatalogue