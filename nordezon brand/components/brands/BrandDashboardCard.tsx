import { primaryOrange } from '@/constants/colors'; // your theme color
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CText from '../common/CText';
import CTouchableOpacity from '../common/CTouchableOpacity';

const BrandDashboardCard = () => {
    const stats = [
        { label: 'Total Catalogs', value: 42, color: '#1E90FF' },
        { label: 'Total Products', value: 320, color: '#28A745' },
        { label: 'Current Orders', value: 18, color: '#FF8C00' },
        { label: 'Pending Orders', value: 6, color: '#FF3B30' },
    ];
  

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <CText style={styles.title}>Store Overview</CText>
                    <CText style={styles.subtitle}>Total Catalogs and Orders Summary</CText>
                </View>
                <CTouchableOpacity style={styles.button} onPress={() => { }}>
                    <CText style={styles.buttonText}>Manage</CText>
                </CTouchableOpacity>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsContainer}>
                {stats.map((item, index) => (
                    <View key={index} style={styles.statBox}>
                        <CText style={[styles.value, { color: item.color }]}>{item.value}</CText>
                        <CText style={styles.label}>{item.label}</CText>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.08)',
        shadowColor: 'transparent',
    },


    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    subtitle: {
        fontSize: 12,
        color: '#777',
    },
    button: {
        backgroundColor: primaryOrange,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    statBox: {
        width: '48%',
        alignItems: 'center',
        marginVertical: 8,
    },
    value: {
        fontSize: 22,
        fontWeight: '700',
    },
    label: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});

export default BrandDashboardCard;
