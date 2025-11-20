import BackgroundContainer from '@/components/common/BackgroundContainer'
import CTextField from '@/components/common/CTextField'
import KeyboardAvoiding from '@/components/common/KeyboardAvoiding'
import Bazar from '@/components/home/Bazar'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const bazarList = () => {
    // Add state for search query
    const [search, setSearch] = useState('');

    // You can later use `search` to filter the bazar items if desired
    return (
        <BackgroundContainer paddingHorizontal={0} paddingVertical={0}>
            <KeyboardAvoiding>
                {/* Title */}
                <Text style={styles.title}>Farokht Bazar – Explore the Best Street Markets</Text>
                <View style={styles.searchContainer}>
                    <CTextField
                        style={styles.searchInput}
                        placeholder="Search Bazar..."
                        value={search}
                        onChangeText={setSearch}
                        icon='search'
                    />
                </View>

                {/* Bazar listings below */}
                <Bazar />
                <Bazar />
                <Bazar />
                <Bazar />
                <Bazar />
                <Bazar />
            </KeyboardAvoiding>
        </BackgroundContainer>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: "#232323",
        paddingTop: 24,
        paddingHorizontal: 14,
        paddingBottom: 2,
        fontFamily: 'PoppinsSemiBold',
    },
    searchContainer: {
        paddingHorizontal: 14,
        paddingTop: 18,
        paddingBottom: 6,
        backgroundColor: "#fff",
    },
    searchInput: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        fontSize: 15,
        borderColor: "#ebebeb",
        fontFamily: "Poppins",
    },
})

export default bazarList