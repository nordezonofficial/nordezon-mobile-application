import { colors, primaryGreen } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import CText from './CText'
import CTouchableOpacity from './CTouchableOpacity'

/**
 * Props:
 * - setSelectedColors: function to update selected colors
 * - colorList: color swatches (array)
 * - hasSelectedFeature: show selection
 * - selectedColors: array of selected color codes/strings
 * - multiSelect: boolean (if true, can select multiple; if false, only one at a time)
 */
const ColorList = ({
    setSelectedColors,
    colorList = colors,
    hasSelectedFeature = true,
    selectedColors,
    multiSelect = true
}: any) => {
    // Color select (single or multi)
    const toggleColor = (color: string) => {
        setSelectedColors && setSelectedColors((prev: any) => {
            if (multiSelect) {
                return prev.includes(color)
                    ? prev.filter((c: any) => c !== color)
                    : [...prev, color]
            } else {
                // If only single selection allowed
                return prev.includes(color) ? [] : [color];
            }
        })
    }

    return (
        <>
            <CText style={styles.sectionLabel}>Colors</CText>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: 'row', gap: 14, paddingBottom: 4, paddingTop: 2 }}
                style={{ marginBottom: 2 }}
            >
                {colorList.map((swatch: any, index: number) => {
                    const colorCode =
                        typeof swatch === "object" && swatch !== null
                            ? swatch.color
                            : swatch;
                    const selected = hasSelectedFeature ? selectedColors.includes(colorCode) : false;

                    return (
                        <View key={index} style={{ alignItems: "center", marginRight: 7 }}>
                            <CTouchableOpacity
                                style={[
                                    styles.colorCircle,
                                    {
                                        backgroundColor: colorCode,
                                        borderWidth: 1,
                                    },
                                    swatch.border && {
                                        borderColor: '#bbb', borderWidth: 1
                                    },
                                    hasSelectedFeature ?
                                        selected && {
                                            borderColor: primaryGreen,
                                            borderWidth: 2,
                                            elevation: 3
                                        } : {}
                                ]}
                                activeOpacity={0.8}
                                onPress={() => toggleColor(colorCode)}
                            >
                                {hasSelectedFeature && selected &&
                                    <Ionicons
                                        name="checkmark"
                                        size={18}
                                        color={colorCode == '#ffffff' ? '#000' : '#fff'}
                                    />
                                }
                            </CTouchableOpacity>
                            <CText style={{ fontSize: 10, color: "#444", marginTop: 4, left: -5, }}>
                                {(() => {
                                    // CASE 1: swatch is an object → return its label
                                    if (typeof swatch === "object" && swatch !== null) {
                                        return swatch.label || "";
                                    }

                                    // CASE 2: swatch is a string → find matching object from colors array
                                    const found = colors?.find((c) => c.color == swatch);

                                    return found?.label || ""; // fallback if not found
                                })()}
                            </CText>
                        </View>
                    )
                })}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 18,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#dedede'
    },
    sectionLabel: {
        fontSize: 15,
        fontFamily: "PoppinsSemiBold",
        color: "#555",
        marginBottom: 7,
        marginTop: 16,
        letterSpacing: 0,

    },
})

export default ColorList