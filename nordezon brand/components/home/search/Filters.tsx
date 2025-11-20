import ColorList from '@/components/common/ColorList'
import CText from '@/components/common/CText'
import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import { primaryGreen } from '@/constants/colors'
import { setShowFilteration } from '@/store/slices/ui'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
// -- For slider import --

const CATEGORY_LIST = [
    'Men', 'Women', 'Shoes', 'Bags', 'Accessories', 'Kids'
]

const SIZE_LIST = ['XS', 'S', 'M', 'L', 'XL', '2XL']


// For demo, primary color here:
const MAIN_COLOR = primaryGreen

const minPrice = 10
const maxPrice = 500

const Filters = ({
    onClose,
    onApply,
}: {
    onClose?: () => void
    onApply?: (filters: any) => void
}) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    // State for per-category sizes (no default on category add):
    const [categorySizesIdx, setCategorySizesIdx] = useState<Record<string, number>>({})
    const [activeSizeCategory, setActiveSizeCategory] = useState<string | null>(null)
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
    const { showFilteration } = useSelector((state: any) => state.ui)
    const dispatch = useDispatch();
    // Category select (multi)
    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev => {
            const exists = prev.includes(cat)
            let newArr: string[]
            if (exists) {
                // Remove the category and its assigned size
                const { [cat]: omit, ...restSizes } = categorySizesIdx
                setCategorySizesIdx(restSizes)
                // If active tab is the one being removed, change tab
                if (activeSizeCategory === cat) {
                    setActiveSizeCategory(prev.filter(c => c !== cat)[0] || null)
                }
                newArr = prev.filter(c => c !== cat)
            } else {
                // Add category WITHOUT setting a default size
                setCategorySizesIdx({
                    ...categorySizesIdx,
                })
                setActiveSizeCategory(cat)
                newArr = [...prev, cat]
            }
            // when none left, set tab to null
            if (newArr.length === 0) setActiveSizeCategory(null)
            return newArr
        })
    }

    // For slider: set size index for category
    const setSizeForCategoryIdx = (cat: string, idx: number) => {
        setCategorySizesIdx(prev => ({
            ...prev,
            [cat]: idx,
        }))
    }



    // Fake slider interaction (see note below)
    const onPriceChange = (which: "min" | "max", val: number) => {
        if (which === "min") {
            setPriceRange(([_, max]) => [
                Math.min(val, max - 1), max
            ])
        } else {
            setPriceRange(([min]) => [
                min, Math.max(val, min + 1)
            ])
        }
    }

    // On apply
    const handleApply = () => {
        // Output sizes as {category: sizeName}, skip any not set
        const sizeObj: Record<string, string> = {}
        for (let k in categorySizesIdx) {
            if (
                typeof categorySizesIdx[k] === 'number' &&
                categorySizesIdx[k] >= 0 && categorySizesIdx[k] < SIZE_LIST.length
            ) {
                sizeObj[k] = SIZE_LIST[categorySizesIdx[k]]
            }
        }
        onApply?.({
            categories: selectedCategories,
            size: sizeObj,
            colors: selectedColors,
            priceRange,
        })
    }

    return (
        <View style={[styles.sheetContainer]}>
            {/* HEADER */}
            <View style={styles.headerRow}>
                <CText style={styles.headerTitle}>Filter</CText>
                <CTouchableOpacity onPress={() => {
                    dispatch(setShowFilteration(!showFilteration))
                }}>
                    <Ionicons name="close" size={26} color="#444" />
                </CTouchableOpacity>
            </View>

            {/* BODY */}
            <ScrollView>
                {/* CATEGORIES */}
                <CText style={styles.sectionLabel}>Categories</CText>
                <View style={styles.chipsRow}>
                    {CATEGORY_LIST.map(cat => {
                        const selected = selectedCategories.includes(cat)
                        return (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.chip,
                                    selected && { backgroundColor: primaryGreen }
                                ]}
                                activeOpacity={0.75}
                                onPress={() => toggleCategory(cat)}
                            >
                                <CText style={[
                                    styles.chipText,
                                    selected && { color: '#fff', fontWeight: 'bold' }
                                ]}>{cat}</CText>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                {/* SIZE TABS for selected categories */}
                {selectedCategories.length > 0 && (
                    <>
                        <CText style={styles.sectionLabel}>Size</CText>
                        {/* Tab bar for categories */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: 'row', gap: 11, marginBottom: 4, marginTop: 3 }}
                        >
                            {selectedCategories.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.tabItem,
                                        activeSizeCategory === cat && styles.activeTabItem
                                    ]}
                                    onPress={() => setActiveSizeCategory(cat)}
                                >
                                    <CText style={[
                                        styles.tabText,
                                        activeSizeCategory === cat && styles.activeTabText
                                    ]}>{cat}</CText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        {/* Size selector for the currently active tab (sizes are touchable) */}
                        {activeSizeCategory && (
                            <View style={[styles.sizeSliderContainer, { marginTop: 13, marginBottom: 19 }]}>
                                <View style={styles.sliderLabelRow}>
                                    {SIZE_LIST.map((size, idx) => {
                                        const selected = categorySizesIdx[activeSizeCategory] === idx
                                        return (
                                            <CTouchableOpacity
                                                key={size}
                                                style={[
                                                    styles.sizeLabelTouchable,
                                                    selected && { backgroundColor: primaryGreen, borderColor: '#fff', width: 30, height: 45, justifyContent: "center", alignItems: "center" }
                                                ]}
                                                onPress={() => setSizeForCategoryIdx(activeSizeCategory, idx)}
                                                activeOpacity={0.8}
                                            >
                                                <CText style={[
                                                    styles.sizeSliderLabel,
                                                    selected && { color: "#fff", fontWeight: 'bold' }
                                                ]}>{size}</CText>
                                            </CTouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        )}


                    </>
                )}

                {/* COLORS */}
                <ColorList setSelectedColors={setSelectedColors} selectedColors={selectedColors}></ColorList>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 3,
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: "#232323"
    },
    sectionLabel: {
        fontSize: 15,
        fontFamily: "PoppinsSemiBold",
        color: "#555",
        marginBottom: 7,
        marginTop: 16,
        letterSpacing: 0,

    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 7,
        marginBottom: 5
    },
    chip: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 14,
        paddingVertical: 7,
        marginRight: 8,
        marginBottom: 7,
        borderRadius: 5,
        elevation: 1
    },
    chipText: {
        color: '#272727',
        letterSpacing: 0.1,
        fontWeight: '500'
    },
    sizeSliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        paddingVertical: 6,
        paddingHorizontal: 2,
    },
    sizeSliderContainer: {
        marginTop: 10,
        marginBottom: 18,
        // marginHorizontal: 4,
        justifyContent: 'center',
    },
    sliderLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
        marginHorizontal: 7,
    },
    sizeSliderLabel: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
    },
    sizeLabelTouchable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        borderRadius: 50,
        marginHorizontal: 1,
    },

    // Tab styles for categories
    tabItem: {
        backgroundColor: '#f6f6f9',
        borderRadius: 5,
        paddingHorizontal: 13,
        paddingVertical: 7,
        // elevation: 1,
        minWidth: 58,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeTabItem: {
        backgroundColor: MAIN_COLOR + '22',
        borderColor: MAIN_COLOR,
        borderWidth: 1.2,
    },
    tabText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 15,
        letterSpacing: 0.1
    },
    activeTabText: {
        color: MAIN_COLOR,
        fontWeight: 'bold'
    },
    colorsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 8,
        marginTop: 7,
        minHeight: 44
    },

    priceRangeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7
    },
    priceLabel: {
        fontSize: 15,
        color: '#333',
        fontWeight: 'bold'
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6
    },
    sliderBtn: {
        paddingHorizontal: 4,
        zIndex: 3
    },

})

export default Filters