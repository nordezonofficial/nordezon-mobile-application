import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
const { height } = Dimensions.get("window")
export default function BackgroundContainer({ children, bgColor = "#fff", paddingVertical = 10, paddingHorizontal = 16}: {
    children: React.ReactNode;
    bgColor?: string
    paddingVertical?: number
    paddingHorizontal?: number

}) {
    return (
        <View style={[styles.container, {
            backgroundColor: bgColor,
            paddingVertical: paddingVertical,
            paddingHorizontal: paddingHorizontal
        }]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})