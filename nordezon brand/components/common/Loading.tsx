import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View, type DimensionValue } from 'react-native'

const Loading = () => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const startShimmer = () => {
            Animated.loop(
                Animated.timing(shimmerAnimation, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start()
        }

        startShimmer()
    }, [shimmerAnimation])

    const translateX = shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 300],
    })

    const ShimmerLine = ({ width, height = 16, marginBottom = 12 }: { width: DimensionValue, height?: number, marginBottom?: number }) => (
        <View style={[
            styles.shimmerContainer,
            { width: width, height: height, marginBottom: marginBottom }
        ]}>
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            />
        </View>
    )

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                {/* Header shimmer */}
                <ShimmerLine width="60%" height={20} marginBottom={16} />

                {/* Content lines */}
                <ShimmerLine width="100%" height={14} />
                <ShimmerLine width="90%" height={14} />
                <ShimmerLine width="75%" height={14} />

                {/* Footer area */}
                <View style={styles.footer}>
                    <ShimmerLine width={80} height={32} marginBottom={0} />
                    <ShimmerLine width={60} height={32} marginBottom={0} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 10,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    content: {
    },
    shimmerContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    shimmer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        position: 'absolute',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
})

export default Loading