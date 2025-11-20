import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
const { width } = Dimensions.get('window')

export default function HRLineFullWidth() {
    return (
        <View style={styles.hrLine} />

    )
}

const styles = StyleSheet.create({
    hrLine: {
        borderBottomColor: '#f8f8f8',
        borderBottomWidth: 10,
        marginVertical: 25, 
        width: width,
        left: -18,
    },
})