import CButton from '@/components/common/CButton'
import CText from '@/components/common/CText'
import { primaryOrange } from '@/constants/colors'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
const { width } = Dimensions.get('window')

const OrderSuccessfully = () => {
    const [loading, setLoading] = useState(false)

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/icons/order.png')} style={styles.orderImage}></Image>
            <CText style={styles.title}>Order Placed!</CText>
            <CText style={styles.subtitle}>Thank you for your purchase. Your order has been received and is being processed.</CText>

            <CButton
                text={"My Order Detail"}
                style={styles.button}
                loading={loading}
                textStyle={styles.buttonText}
                onPress={() => {
                    router.push('/(home)/orderDetail')
                }}
            />

            <CButton
                text={"Continue Shopping"}
                style={styles.buttonTransparent}
                textStyle={styles.buttonTransparentText}
                onPress={() => { }}
            />
        </View>
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
    buttonTransparent: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: primaryOrange,
        borderRadius: 5,
        paddingVertical: 15,
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
    },
    buttonTransparentText: {
        color: primaryOrange,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    orderImage: {
        height: 300,
        maxWidth: width,
    },
    title: {
        fontSize: 22,
        color: '#000',
        marginBottom: 10,
        fontFamily: 'PoppinsSemiBold',

    },
    subtitle: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        paddingHorizontal: 32,
        marginTop: 6
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
})

export default OrderSuccessfully