import CText from '@/components/common/CText'
import CTouchableOpacity from '@/components/common/CTouchableOpacity'
import { primaryGreen } from '@/constants/colors'
import { setShowFilteration } from '@/store/slices/ui'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { Keyboard, StyleSheet, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const SearchHeader = () => {
    const inputRef = useRef<TextInput>(null);
    const [searchText, setSearchText] = useState("");
    const dispatch = useDispatch();
    const { showFilteration } = useSelector((state: any) => state.ui);

    // Handler for submitting search
    // To debug if it gets fired, show an alert too
    const handleSearch = useCallback(() => {
        if (searchText.trim()) {
            console.log("Searching for:", searchText);
            alert(`Searching for: ${searchText}`);
        } else {
            console.log("Search is empty");
        }
        Keyboard.dismiss();
    }, [searchText]);

    useFocusEffect(
        useCallback(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
            return () => { };
        }, [])
    );
 


    return (
        <View style={styles.mainTopContainer}>
            {/* Title */}
            <CText style={styles.title}>Search</CText>
            {/* Main search line: search field and filter icon in one row */}
            <View style={styles.mainSearchContainer}>
                <View style={styles.searchFieldWithFilter}>
                    {/* Search Field */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color={primaryGreen} style={styles.icon} />
                        <TextInput
                            ref={inputRef}
                            placeholder="something ..."
                            placeholderTextColor="#94a3b8"
                            style={styles.input}
                            value={searchText}
                            returnKeyType="search"
                            onChangeText={setSearchText}
                            onSubmitEditing={(e: any) => {
                                console.log("e", e);

                                handleSearch();
                            }}
                            onEndEditing={(e: any) => {
                                handleSearch();
                            }}
                        />

                    </View>
                    {/* Filter Icon */}
                    <CTouchableOpacity onPress={() => {
                        dispatch(setShowFilteration(!showFilteration))
                    }} style={styles.filterIcon}>
                        <Ionicons name="filter-outline" size={22} color={'#fff'} />
                    </CTouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainTopContainer: {
        backgroundColor: "#fff",
        paddingHorizontal: 6,
    },
    mainSearchContainer: {
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
        marginTop: 5,
        paddingHorizontal: 10
    },
    searchFieldWithFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: primaryGreen,
        borderRadius: 5,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        flex: 1,
    },
    filterIcon: {
        backgroundColor: primaryGreen,
        padding: 12,
        borderRadius: 10,
        marginLeft: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#000',
        fontFamily: 'PoppinsRegular',
        paddingVertical: 10
    },
    icon: {
        marginRight: 8,
    },
})

export default SearchHeader