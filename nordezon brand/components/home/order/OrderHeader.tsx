import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import { primaryGreen } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

const OrderHeader = () => {
    return (
        <View style={styles.headerContainer}>
            {/* Logo on the Left */}
            <Image
                source={require('@/assets/images/Elogo.png')}
                style={styles.logo}
            />

            {/* Notification Button on the Right */}
            <CTouchableOpacity style={styles.notificationButton} onPress={() => { }}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={'#fff'} />
            </CTouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
    },
    logo: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    notificationButton: {
        backgroundColor: primaryGreen,
        borderRadius: 25,
        padding: 6,
        position: 'relative',
    },
})

export default OrderHeader