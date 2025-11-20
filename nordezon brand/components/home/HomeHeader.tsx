import { primaryGreen } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, TextInput, View } from 'react-native'
import CText from '../common/CText'
import CTouchableOpacity from '../common/CTouchableOpacity'

const HomeHeader = () => {
    const router = useRouter();
    return (  
        <View style={styles.container}>
            {/* Search Field with right icon */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search..."
                    placeholderTextColor="#666"
                    style={styles.textInput}
                    onFocus={() => router.push('/(home)/search')}
                />
                <Ionicons name="search-outline" size={20} color={primaryGreen} style={styles.searchIcon} />
            </View>

            <CTouchableOpacity style={styles.notificationButton} onPress={() => { }}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={'#fff'} />
            </CTouchableOpacity>

            {/* Notification Button */}
            <CTouchableOpacity style={styles.notificationButton} onPress={() => { }}>
                <Ionicons name="notifications-outline" size={24} color={'#fff'} />
                <View style={styles.badge}>
                    <CText style={styles.badgeText}>3</CText>
                </View>
            </CTouchableOpacity>


            {/* Logo */}
            <Image source={require("@/assets/images/Ulogo.png")} style={styles.logo} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: primaryGreen,
        borderRadius: 50,
        paddingHorizontal: 10,
        marginRight: 5,
        width: '45%',
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#000',
        fontFamily: 'PoppinsRegular',
    },
    searchIcon: {
        marginLeft: 5,
    },
    notificationButton: {
        backgroundColor: primaryGreen,
        borderRadius: 25,
        padding: 6,
        position: 'relative',
        marginRight: 5,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'PoppinsSemiBold',
    },
    logo: {
        width: 100,
        height: 100,
        position: "absolute",
        right: 10,
        resizeMode: 'contain',
    },
})

export default HomeHeader
