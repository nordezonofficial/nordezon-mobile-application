import CText from '@/components/common/CText'
import { primaryGreen } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Easing, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import ProductCatalogue from '../product/ProductCatalogue'
import FilterContainer from './FilterContainer'
const { height } = Dimensions.get('window')

const DUMMY_HISTORY = [
    "Denim Jacket",
    "White T-Shirt",
    "Black Leather Jacket",
    "Summer Dress",
    "Formal Blazer",
    "Oversized Hoodie",
    "Cotton Kurta",
    "Silk Scarf",
    "Cargo Pants",
    "Slim Fit Jeans",
    "Woolen Sweater",
    "Sports Tracksuit",
    "Printed Trousers",
    "Designer Saree",
    "Sneakers",
    "Polo Shirt",
    "Chino Shorts",
    "Bomber Jacket",
    "Ankle Boots",
    "Graphic Tee"
];

const RECOMMENDED_KEYWORDS = [
    "Summer Outfits",
    "Adidas",
    "Gaming Accessories",
    "Smart Watches",
    "Bags",
    "Minimalist Decor",
    "Sneakers",
    "Kids Toys"
];

const Search = () => {
    const inputRef = useRef<TextInput>(null);
    const [searchText, setSearchText] = useState("");
    const [history, setHistory] = useState(DUMMY_HISTORY);
    const { showFilteration: isShowFilteration } = useSelector((state: any) => state.ui)
    const [animationValue] = useState(new Animated.Value(0));

    function handleHistoryPress(item: string) {
        setSearchText(item);
        if (inputRef.current) inputRef.current.focus();
    }

    function handleKeywordPress(keyword: string) {
        setSearchText(keyword);
        if (inputRef.current) inputRef.current.focus();
    }

    function handleClearHistory() {
        setHistory([]);
    }

    useEffect(() => {
        Animated.timing(animationValue, {
            toValue: isShowFilteration ? 1 : 0,
            duration: 300, // animation duration
            easing: Easing.out(Easing.ease),
            useNativeDriver: false, // we animate height, so false
        }).start();
    }, [isShowFilteration]);

    const filterHeight = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 600], // 0 when closed, 300 when open
    });



    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Search History */}
            {
                !isShowFilteration && (history.length > 0) && (

                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <CText style={styles.sectionTitle}>Recent Searches</CText>
                            <TouchableOpacity onPress={handleClearHistory}>
                                <Ionicons name="trash-outline" size={17} color="#888" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.historyList}>
                            {history.map((item, idx) => (
                                <TouchableOpacity
                                    key={item + idx}
                                    style={styles.historyItem}
                                    activeOpacity={0.7}
                                    onPress={() => handleHistoryPress(item)}
                                >
                                    <Ionicons name="time-outline" size={16} color="#cbcdce" style={{ marginRight: 7 }} />
                                    <CText style={styles.historyText}>{item}</CText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                )
            }

            {/* Recommended Keywords */}
            {
                !isShowFilteration && (
                    <View style={styles.section}>
                        <CText style={styles.sectionTitle}>Recommended</CText>
                        <View style={styles.keywordsRow}>
                            {RECOMMENDED_KEYWORDS.map((kw, idx) => (
                                <TouchableOpacity
                                    key={kw + idx}
                                    style={styles.historyItem}
                                    activeOpacity={0.7}
                                    onPress={() => handleHistoryPress(kw)}
                                >
                                    <CText style={styles.historyText}>{kw}</CText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )
            }
            {/* {
                isShowFilteration && ( */}

            <Animated.View style={{ height: filterHeight, overflow: 'hidden' }}>
                <FilterContainer />
            </Animated.View>
            {/* )
            } */}
            <View style={{ marginTop: 10 }}>
                <CText style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginBottom: 10,
                    marginLeft: 10,
                    color: '#232323'
                }}>
                    Discover
                </CText>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 6, paddingRight: 6 }}
                >
                    {Array.from({ length: 10 }).map((_, idx) => (
                        <ProductCatalogue key={idx} />
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff"
    },





    section: {
        marginTop: 15,
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#414141",
        letterSpacing: 0.2,
        marginBottom: 10,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    historyList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    historyItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 5,
        backgroundColor: "#f6f6f6",
        marginRight: 10,
        marginBottom: 8,
        borderColor: '#e0e0e0',
        borderWidth: 1,
    },
    historyText: {
        color: "#585858",
        fontSize: 12,
        fontFamily: 'PoppinsRegular',
    },
    keywordsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    keywordBadge: {
        backgroundColor: "#e8f9ec",
        borderRadius: 15,
        paddingVertical: 7,
        paddingHorizontal: 14,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: primaryGreen,
    },
    keywordText: {
        color: primaryGreen,
        fontSize: 13,
        fontFamily: 'PoppinsRegular',
    },
})

export default Search

