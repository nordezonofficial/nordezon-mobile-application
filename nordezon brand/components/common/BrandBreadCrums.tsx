import React from 'react'
import { StyleSheet, View } from 'react-native'
import CText from './CText'

const BrandBreadCrums = ({
    title,
    subtitle,
    paddingHorizontal = 10,
}: {
    title: string
    subtitle: string
    paddingHorizontal?: number
}) => {
    return (
        <View style={{
            paddingHorizontal: paddingHorizontal,
        }}>
            <CText style={styles.mainTitle}>{title}</CText>
            <CText style={styles.subtitle}>{subtitle}</CText>
        </View>
    )
}
const styles = StyleSheet.create({
    mainTitle: {
        fontSize: 24,
        fontFamily: 'PoppinsSemiBold',
        color: '#000',
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
        color: '#666',
    },
})

export default BrandBreadCrums