import { primaryGreen, primaryOrange } from '@/constants/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import CText from '../common/CText'

const aboutDescription = `Denka Official Store brings you the finest in premium fashion, blending timeless design with modern trends. Our mission is to elevate your everyday style through products crafted with quality and care, ensuring each piece adds unique value to your life. Step into a world of innovation, sustainability, and elegance—crafted for you.`

const workingHours = [
    { day: 'Monday', time: '10:00 AM - 8:00 PM' },
    { day: 'Tuesday', time: '10:00 AM - 8:00 PM' },
    { day: 'Wednesday', time: '10:00 AM - 8:00 PM' },
    { day: 'Thursday', time: '10:00 AM - 8:00 PM' },
    { day: 'Friday', time: '10:00 AM - 8:00 PM' },
    { day: 'Saturday', time: '10:00 AM - 7:00 PM' },
    { day: 'Sunday', time: 'Closed' }
]

const socialMediaLinks = [
    { name: 'Instagram', color: '#E4405F', icon: <FontAwesome name="instagram" size={18} color="#E4405F" />, url: 'https://instagram.com/denkaofficial' },
    { name: 'Facebook', color: '#3b5998', icon: <FontAwesome name="facebook-square" size={18} color="#3b5998" />, url: 'https://facebook.com/denkaofficial' },
    { name: 'Twitter (X)', color: '#1DA1F2', icon: <FontAwesome name="twitter" size={18} color="#1DA1F2" />, url: 'https://twitter.com/denkaofficial' },
    { name: 'YouTube', color: '#FF0000', icon: <FontAwesome name="youtube-play" size={18} color="#FF0000" />, url: 'https://youtube.com/denkaofficial' }
]

const storeAddress = '123 Denim Avenue, Fashion City, IN 560001'

const BrandAboutUs = () => {
    return (
        <View style={styles.container}>
            {/* About/Description */}
            <CText style={styles.sectionTitle}>About Us</CText>
            <CText style={styles.description}>{aboutDescription}</CText>

            {/* Working Hours */}
            <CText style={styles.sectionTitle}>Working Hours</CText>
            <View style={styles.workingHoursBlock}>
                {workingHours.map((entry, idx) => (
                    <View style={styles.workingHourRow} key={idx}>
                        <CText style={[styles.workingHourDay, entry.day === 'Sunday' ? styles.closedDay : null]}>
                            {entry.day}
                        </CText>
                        <CText style={[
                            styles.workingHourTime,
                            entry.day === 'Sunday' ? styles.closedCText : null
                        ]}>
                            {entry.time}
                        </CText>
                    </View>
                ))}
            </View>

            {/* Store Address */}
            <CText style={styles.sectionTitle}>Address</CText>
            <View style={styles.addressRow}>
                <Ionicons name="location-sharp" size={18} color={primaryGreen} style={{ marginRight: 6 }} />
                <CText style={styles.addressCText}>{storeAddress}</CText>
            </View>

            {/* Social Media */}
            <CText style={styles.sectionTitle}>Connect with us</CText>
            <View style={styles.socialLinksContainer}>
                {socialMediaLinks.map((sm, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={styles.socialLink}
                        onPress={() => Linking.openURL(sm.url)}
                        activeOpacity={0.7}
                    >
                        {sm.icon}
                        <CText style={[styles.socialCText, { color: sm.color }]}>{sm.name}</CText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff'
    },
    sectionTitle: {
        color: primaryOrange,
        fontSize: 17,
        marginTop: 18,
        marginBottom: 7,
        fontFamily: 'PoppinsSemiBold',
    },
    description: {
        color: '#333',
        fontSize: 12,

        lineHeight: 21,
        marginBottom: 12,
    },
    workingHoursBlock: {
        borderRadius: 8,
        backgroundColor: '#F8FCF8',
        padding: 10,
        marginBottom: 10,
    },
    workingHourRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 3,
    },
    workingHourDay: {
        fontSize: 14,
        color: '#484848',
        fontWeight: '500',
    },
    workingHourTime: {
        fontSize: 14,
    },
    closedDay: {
        color: '#D32F2F',
    },
    closedCText: {
        color: '#C62828',
        fontWeight: '700'
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 7,
        padding: 8,
    },
    addressCText: {
        fontSize: 14,
        color: '#3c3c3c',
        fontWeight: '500'
    },
    socialLinksContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        marginTop: 4,
        marginBottom: 8,
    },
    socialLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 18,
        marginBottom: 4,
    },
    socialCText: {
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 14,
        textDecorationLine: 'underline',
    }
})

export default BrandAboutUs