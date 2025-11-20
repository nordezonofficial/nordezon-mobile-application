import { primaryOrange } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import CText from '../common/CText';
import CTouchableOpacity from '../common/CTouchableOpacity';

interface BrandHeaderProps {
    name: string;
    bio: string;
    onMessagePress: () => void;
    verified?: boolean,
    bioOpacity: any
    bioVisible: any,
    hasMessageButton?: boolean
    isVerfied?: boolean
    buttonText?: string
    btnIcon?: any
}
const BrandHeader: React.FC<BrandHeaderProps> = ({ name, bio, onMessagePress, verified = true, bioOpacity,
    bioVisible,
    isVerfied,
    hasMessageButton = true,
    buttonText = "Message",
    btnIcon = "chatbubble-ellipses-outline",
}) => {



    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <CText style={styles.brandName}>{name}</CText>
                {isVerfied && (
                    <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={primaryOrange}
                        style={styles.verifiedIcon}
                    />
                )}
            </View>

            {bio ? (
                <Animated.View style={{ opacity: bioVisible }}>
                    <CText style={styles.bio}>{bio}</CText>
                </Animated.View>
            ) : null}

            {
                hasMessageButton && (
                    <CTouchableOpacity style={styles.messageButton} onPress={onMessagePress}>
                        <Ionicons name={btnIcon} size={18} color="#fff" />
                        <CText style={styles.messageText}>{buttonText}</CText>
                    </CTouchableOpacity>
                )
            }


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },

    messageButton: {
        position: 'absolute',
        right: 0,
        top: 7,
        backgroundColor: primaryOrange,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    messageText: {
        color: '#fff',
        fontFamily: 'PoppinsMedium',
        fontSize: 13,
        marginLeft: 5,
    },
    bio: {
        fontSize: 13,
        fontFamily: 'PoppinsRegular',
        color: '#666',
        lineHeight: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandName: {
        fontSize: 20,
        fontFamily: 'PoppinsSemiBold',
        color: '#222',
    },
    verifiedIcon: {
        marginTop: -12,
    },

});

export default BrandHeader;
