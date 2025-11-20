import CText from '@/components/common/CText'
import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import { primaryGreen } from '@/constants/colors'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Filters from './Filters'
import RangeSlider from './RangSlider'

export default function FilterContainer() {
    return (
        <>
            <Filters></Filters>
            <RangeSlider></RangeSlider>
            <View style={styles.footer}>
                <CTouchableOpacity style={styles.applyBtn} onPress={() => { }}>
                    <CText style={styles.applyBtnText}>Apply Filters</CText>
                </CTouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    footer: {
        paddingVertical: 9,
        backgroundColor: "#fff",
    },
    applyBtn: {
        backgroundColor: primaryGreen,
        paddingVertical: 13,
        borderRadius: 7,
        alignItems: 'center',
        marginHorizontal: 2
    },
    applyBtnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 0.5
    }
})