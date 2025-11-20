import { primaryOrange } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = ['POSTS', 'CATALOGUE', 'REELS', 'STORIES', 'ABOUT US'];

type TabType = 'POSTS' | 'CATALOGUE' | 'ABOUT US' | 'REELS' | 'STORIES';

interface BrandTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const BrandTabs: React.FC<BrandTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <View style={styles.tabContainer}>
            {TABS.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[
                        styles.tab,
                        activeTab === tab && styles.activeTab
                    ]}
                    onPress={() => onTabChange(tab as TabType)}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}
                    >
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        borderRadius: 18,
        marginVertical: 5,
        paddingVertical: 2,
        alignItems: 'center',
        paddingHorizontal: 2,
        flexDirection: "row"
    },
    tab: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: 2,
        borderRadius: 5,
        backgroundColor: 'transparent',
    },
    activeTab: {
        backgroundColor: primaryOrange,
    },
    tabText: {
        fontSize: 11,
        color: '#666',
        fontFamily: 'PoppinsMedium',
        letterSpacing: 0.2,
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default BrandTabs;
