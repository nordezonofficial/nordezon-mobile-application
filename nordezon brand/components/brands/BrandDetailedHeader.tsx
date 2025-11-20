import { primaryOrange } from '@/constants/colors';
import { tabs } from '@/constants/common';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import CText from '../common/CText';
import CTouchableOpacity from '../common/CTouchableOpacity';
import NotificationBox from '../common/NotificationBox';

const { width, height } = Dimensions.get('window');

const BrandDetailedHeader = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-width * 0.6)).current;
    const { user, unReadNotificationCount } = useSelector((state: any) => state.user)


    /* -- navigation --*/
    const navigation = useRouter();

    const openMenu = () => {
        setMenuOpen(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    const closeMenu = async (param: string) => {
        if (param == 'logout') {
            await AsyncStorage.clear();
            router.replace('/(auth)/login')
            return;
        }
        if (param != "CLOSED") {

            navigation.push(`/(brand)/${param}` as any)
        }
        Animated.timing(slideAnim, {
            toValue: -width * 0.6,
            duration: 250,
            useNativeDriver: false,
        }).start(() => setMenuOpen(false));
    };

    return (
        <>
            {/* Drawer */}
            {menuOpen && (
                <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                    <View style={styles.drawerContent}>
                        {/* Drawer Header with Close Button */}
                        <View style={styles.drawerHeader}>
                            <Image
                                source={{
                                    uri: user.logoUrl
                                }}
                                style={styles.drawerLogo}
                            />
                            <CTouchableOpacity onPress={() => closeMenu('CLOSED')} style={styles.closeButton}>
                                <Ionicons name="close" size={26} color={primaryOrange} />
                            </CTouchableOpacity>
                        </View>

                        {/* Tabs */}
                        {/* Tabs */}
                        <View style={styles.tabsContainer}>
                            {tabs.map((tab: any, index: any) => (
                                <CTouchableOpacity
                                    key={index}
                                    style={styles.tabButton}
                                    onPress={() => closeMenu(tab.route)}
                                >
                                    <View style={styles.tabRow}>
                                        <Ionicons
                                            name={tab.icon}
                                            size={20}
                                            color={primaryOrange}
                                            style={styles.tabIcon}
                                        />
                                        <CText style={styles.tabText}>{tab.label}</CText>
                                    </View>
                                </CTouchableOpacity>
                            ))}
                        </View>


                        {/* Bottom Ulogo */}
                        <View style={styles.bottomLogoContainer}>
                            <Image
                                source={require('../../assets/images/Ulogo.png')}
                                style={styles.bottomLogo}
                            />
                        </View>
                    </View>
                </Animated.View>
            )}


            {/* Header */}
            <View style={styles.container}>
                {/* Left Drawer Icon */}
                <CTouchableOpacity style={styles.menuButton} onPress={openMenu}>
                    <Ionicons name="menu-outline" size={28} color={primaryOrange} />
                </CTouchableOpacity>

                {/* Center Logo */}
                <Image
                    source={require('../../assets/images/Ulogo.png')}
                    style={styles.logo}
                />

                {/* Right Notification */}
                <CTouchableOpacity
                    style={styles.notificationButton}
                    onPress={() => setShowNotifications(true)}
                >
                    <Ionicons name="notifications-outline" size={24} color={primaryOrange} />
                    <View style={styles.badge}>
                        <CText style={styles.badgeText}>{unReadNotificationCount}</CText>
                    </View>
                </CTouchableOpacity>

                {/* Notification Modal */}
                <NotificationBox
                    visible={showNotifications}
                    onClose={() => setShowNotifications(false)}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        zIndex: 1, // keeps header above content but below drawer
    },
    menuButton: {
        padding: 6,
    },
    tabRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabIcon: {
        marginRight: 12,
    },

    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width * 0.6,
        height: height,
        zIndex: 9999,
        elevation: 20,
        backgroundColor: '#fff',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    drawerLogo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        borderRadius: 50,
        borderWidth: 1.5,
        borderColor: primaryOrange
    },
    closeButton: {
        padding: 4,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    notificationButton: {
        padding: 6,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
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
    tabButton: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tabText: {
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
        color: '#333',
    },
    bottomLogoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    bottomLogo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        opacity: 0.9,
    },
    tabsContainer: {
        flexGrow: 1,
    },
    drawerContent: {
        flex: 1,
        justifyContent: 'space-between', // pushes logo to bottom
    },

});

export default BrandDetailedHeader;
