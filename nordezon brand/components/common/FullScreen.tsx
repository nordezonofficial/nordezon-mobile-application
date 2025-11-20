import { primaryOrange } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Dimensions, Image, Modal, Platform, StyleSheet, Text, View } from 'react-native'
import CText from './CText'
import CTouchableOpacity from './CTouchableOpacity'
import Description from './Description'

const { width, height } = Dimensions.get('window')

// Here the comment and Like and add to Cart button
export default function FullScreenPopup({
    fullImageVisible,
    setFullImageVisible,
    image,
    brand,       // expecting: { logo, name, verified (bool) }
    title,       // product title
    oneLineDescription // short description string
}: {
    fullImageVisible: boolean,
    setFullImageVisible: (param: boolean) => void
    image: any,
    brand: boolean,
    title?: string,
    oneLineDescription?: string
}) {
    return (
        <>
            <Modal
                visible={fullImageVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setFullImageVisible(false)}
                statusBarTranslucent={true}
            >
                <View style={styles.fixedFullScreenModal}>
                    {/* Close button */}
                    <CTouchableOpacity
                        style={styles.fullScreenCloseBtn}
                        activeOpacity={0.8}
                        onPress={() => setFullImageVisible(false)}
                    >
                        <Ionicons name="close" size={25} color="#fff" />
                    </CTouchableOpacity>
                    {/* Full screen image */}
                    <Image
                        source={{ uri: image }}
                        style={styles.reallyFullScreenImage}
                        resizeMode="contain"
                    />
                    {/* Brand Profile, Title, and Description little up from the bottom & starting where image ends */}
                    {brand && (title || oneLineDescription) && (
                        <View style={styles.metaBlock}>
                            {brand && (
                                <View style={styles.brandRowMeta}>
                                    <Image source={require('@/assets/images/logo/1.png')} style={styles.brandLogo} />
                                    <View style={{ marginLeft: 8, flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.brandName}>Khaadi</Text>
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={18}
                                            color={primaryOrange}
                                            style={{ marginLeft: 4 }}
                                        />
                                    </View>
                                </View>
                            )}
                            {title && (
                                <CText style={styles.metaTitle} >{title}</CText>
                            )}
                            {oneLineDescription && (
                                <Description style={styles.metaDesc} text={oneLineDescription} />
                            )}
                            {/* Here the comment and Like and add to Cart button */}
                            {/* <View style={styles.actionsRow}>
                                <CTouchableOpacity onPress={() => { }} style={styles.actionBtn} activeOpacity={0.75}>
                                    <Ionicons name="heart-outline" size={22} color="#fff" />
                                    <Text style={styles.actionText}>100</Text>
                                </CTouchableOpacity>
                                <CTouchableOpacity onPress={() => { }} style={styles.actionBtn} activeOpacity={0.75}>
                                    <Ionicons name="chatbubble-outline" size={22} color="#fff" />
                                    <Text style={styles.actionText}>200k</Text>
                                </CTouchableOpacity>
                                <View style={{ flex: 1 }} />
                            </View> */}
                        </View>
                    )}
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    fullScreenCloseBtn: {
        position: 'absolute',
        right: 16,
        top: Platform.OS === 'ios' ? 50 : 80,
        zIndex: 20,
        backgroundColor: 'rgba(0,0,0,0.54)',
        borderRadius: 20,
        padding: 4,
    },

    // Modal container, absolutely on top
    fixedFullScreenModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.98)",
        zIndex: 9999,
        justifyContent: "center",
        alignItems: "center"
    },

    reallyFullScreenImage: {
        width: '100%',
        height: '100%',
        backgroundColor: "#111"
    },

    // Block at lower part, up from bottom, starting where image visually ends
    metaBlock: {
        position: 'absolute',
        left: 0,
        right: 0,
        // Place metaBlock about 36px up from bottom, overlaying image edge
        bottom: Platform.OS === 'ios' ? 44 : 32,
        backgroundColor: 'rgba(16,16,16,0.76)',
        paddingHorizontal: 24,
        paddingTop: 14,
        paddingBottom: 10,
        alignItems: "flex-start",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },
    // Brand row inside the meta block (not absolute anymore)
    brandRowMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 7,
    },
    brandLogo: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#eee",
        borderColor: primaryOrange,
        borderWidth: 1,
        marginRight: 2,
    },
    brandName: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },

    metaTitle: {
        color: '#fff',
        fontWeight: "bold",
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
        marginBottom: 4,
        lineHeight: 24,
        letterSpacing: 0.1
    },
    metaDesc: {
        color: '#F6F6F6',
        fontSize: 12,
        fontWeight: "400",
        opacity: 0.82,
        letterSpacing: 0.07
    },

    // Actions row (like/comment/add to cart) for the bottom meta panel
    actionsRow: {
        marginTop: 14,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 50,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginRight: 12,
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 7,
    },
    addToCartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff8600',
        borderRadius: 18,
        paddingVertical: 7,
        paddingHorizontal: 16,
        minWidth: 110,
        marginLeft: 10,
    },
    addToCartText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 7,
    },
})