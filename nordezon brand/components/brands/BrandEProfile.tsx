import Banner from '@/components/brands/Banner';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import CText from '../common/CText';
import BrandHeader from './BrandHeader';
const { height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.25;
const MIN_BANNER_HEIGHT = 120; // Increased minimum height to keep banner more visible
const metrics = [
    { label: 'Total Catalogs', value: 42, color: '#1E90FF' },
    { label: 'Total Products', value: 320, color: '#28A745' },
    { label: 'Current Orders', value: 18, color: '#FF8C00' },
    { label: 'Pending Orders', value: 6, color: '#FF3B30' },
];
interface ProfileProps {
    logo: any;
    banner: any;
    name: string;
    bio: string;
    verified?: boolean;
    onEditPress: () => void;
    details: {
        fullName: string;
        email: string;
        contactNumber: string;
        city: string;
        address: string;
        cnic: string;
        brandName: string;
        businessType: string;
        activeOn: string;
    };
}
const BrandEProfile = ({
    logo,
    banner,
    name,
    bio,
    verified,
    onEditPress,
    details,
}: ProfileProps) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const bannerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT - MIN_BANNER_HEIGHT],
        outputRange: [HEADER_HEIGHT, MIN_BANNER_HEIGHT],
        extrapolate: 'clamp',
    });

    const bioOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    })

    const DetailItem = ({ label, value }: { label: string; value: string }) => (
        <View style={styles.detailItem}>
            <CText style={styles.detailLabel}>{label}:</CText>
            <CText style={styles.detailValue}>{value}</CText>
        </View>
    );

    const router = useRouter();

    const { user } = useSelector((state: any) => state.user)

    return (
        <BackgroundContainer paddingVertical={0}>

            {/* Fixed Banner - stays visible during scroll */}
            <Animated.View style={[styles.bannerContainer, { height: bannerHeight }]}>
                <Banner
                    hasNotificationIcon={false}
                    hasBackButton={true}
                    hasLogo={true}
                    onBackPress={() => {
                        router.push("/(brand)/settings")
                    }}
                    logoSlider={scrollY.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, -20], // how much BrandTabs should move up
                        extrapolate: 'clamp',
                    })}
                />
            </Animated.View>

            {/* Fixed Brand Header - positioned below banner and stays visible */}
            <Animated.View style={[
                styles.fixedBrandHeader,
                {
                    top: bannerHeight,
                    height: scrollY.interpolate({
                        inputRange: [0, 150],
                        outputRange: [70, 120],
                        extrapolate: 'clamp',
                    }),
                },
            ]}>
                <Animated.View
                    style={{
                        height: scrollY.interpolate({
                            inputRange: [0, 80],
                            outputRange: [120, 110],
                            extrapolate: 'clamp',
                        }),

                    }}
                >
                    <BrandHeader
                        btnIcon={'create-outline'}
                        buttonText={'Edit'}
                        hasMessageButton={true}
                        bioVisible={scrollY.interpolate({
                            inputRange: [0, 80],
                            outputRange: [1, 0],
                            extrapolate: 'clamp',
                        })}
                        bio={user.bio}
                        name={user.brandName}
                        isVerfied={user.isLawyerApproved}
                        bioOpacity={bioOpacity}
                        onMessagePress={() => {
                            router.push('/(brand)/brandEditProfile')
                        }}
                    />
                </Animated.View>
            </Animated.View>


            {/* Scrollable Content */}
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                {/* Spacer to account for fixed header */}
                <View style={styles.headerSpacer} />


                {/* Actions / Stats */}
                {/* <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <CText style={styles.statNumber}>120</CText>
                        <CText style={styles.statLabel}>Posts</CText>
                    </View>
                    <View style={styles.stat}>
                        <CText style={styles.statNumber}>1.5K</CText>
                        <CText style={styles.statLabel}>Followers</CText>
                    </View>
                    <View style={styles.stat}>
                        <CText style={styles.statNumber}>300</CText>
                        <CText style={styles.statLabel}>Following</CText>
                    </View>
                </View> */}
                <View style={styles.aboutSection}>
                    <CText style={styles.sectionTitle}>About Us</CText>
                    <CText style={styles.aboutText}>{user.aboutUs}</CText>
                </View>

                <View style={styles.detailsSection}>
                    <CText style={styles.sectionTitle}>Additional Details</CText>

                    <DetailItem label="Full Name" value={user.fullName} />
                    <DetailItem label="Email" value={user.email} />
                    <DetailItem label="Contact Number" value={user.phoneNumber} />
                    <DetailItem label="City" value={user.city} />
                    <DetailItem label="Address" value={user.address} />
                    <DetailItem label="CNIC" value={user.CNIC} />
                    <DetailItem label="Brand Name" value={user.brandName} />
                    {/* <DetailItem label="Business Type" value={details.businessType} /> */}
                    {user.activeOns && user.activeOns.length > 0 ? (
                        user.activeOns.map((item: any, index: number) => (
                            <DetailItem
                                key={index}
                                label={item.key}
                                value={item.value}
                            />
                        ))
                    ) : (
                        <CText style={{ color: 'gray' }}>No Active On records found</CText>
                    )}

                </View>

            </Animated.ScrollView>

        </BackgroundContainer>

    );
};

const styles = StyleSheet.create({
    brandNameOverlay: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    brandName: {
        fontSize: 24,
        fontFamily: 'PoppinsSemiBold',
        color: '#000',
    },

    brandNameContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    aboutSection: {
        marginBottom: 10,
    },
    aboutText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginTop: 6,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#555',
        width: 130,
    },
    detailValue: {
        fontSize: 13,
        color: '#000',
        flex: 1,
        flexWrap: 'wrap',
    },
    verifiedIcon: {
        marginTop: -12,
    },
    sectionHeader: {
        top: 30,
        left: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    viewAll: {
        fontSize: 14,
        right: 25,
        fontFamily: 'PoppinsMedium',
        color: '#FF8C00', // you can use your primary orange or brand color
        textDecorationLine: 'underline',
    },

    sectionTitle: {
        fontSize: 15,
        fontFamily: 'PoppinsSemiBold',
        color: '#333',
        marginTop: 20,
    },
    detailsSection: {
        marginTop: 10,
    },
    bannerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        zIndex: 1,
    },
    productContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap"
    },
    fixedBrandHeader: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 7,
    },
    headerSpacer: {
        height: HEADER_HEIGHT + 120,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    statLabel: {
        fontSize: 12,
        color: '#777',
    },
});

export default BrandEProfile;
