import { primaryOrange } from '@/constants/colors';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import CText from '../common/CText';

const screenWidth = Dimensions.get('window').width - 32;
const primaryGreen = '#33e0eb';

const MetricsGraphs = () => {
    const { dashboard } = useSelector((state: any) => state.user);



    const fallbackProductData = {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [
            { data: [0, 0, 0, 0, 0, 0], label: 'Likes', strokeWidth: 2 },
            { data: [0, 0, 0, 0, 0, 0], label: 'Comments', strokeWidth: 2 },
            { data: [0, 0, 0, 0, 0, 0], label: 'Carts', strokeWidth: 2 },
        ],
    };

    const productLineData = dashboard?.product?.lineData || fallbackProductData;

    // ✅ attach color functions for better visual distinction
    const coloredDatasets =
        productLineData.datasets?.map((dataset: any, index: number) => ({
            ...dataset,
            color: (opacity = 1) => {
                if (dataset.label === 'Likes') return `rgba(51, 224, 235, ${opacity})`; // primaryGreen
                if (dataset.label === 'Comments') return `rgba(255, 140, 0, ${opacity})`; // orange
                if (dataset.label === 'Carts') return `rgba(255, 59, 48, ${opacity})`; // red
                return `rgba(51, 224, 235, ${opacity})`;
            },
        })) || [];

    const productChartData = {
        labels: productLineData.labels,
        datasets: coloredDatasets,
        legend: productLineData.datasets?.map((d: any) => d.label) || [],
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <CText style={styles.header}>Store Metrics</CText>

            {/* Orders Over Time */}
            <CText style={styles.chartTitle}>Orders Over Time</CText>
            <View style={{
                left: -30,
            }}>
                <LineChart
                    data={dashboard?.order?.lineData || {}}
                    width={screenWidth} height={220}
                    chartConfig={orderChartConfig}
                    style={styles.chartStyle}
                    bezier
                />
            </View>

            {/* Post Engagement Graph (Likes, Comments, Carts) */}
            <CText style={styles.header}>Product Engagement Graph</CText>
            <View style={{
                left: -30,
            }}>

                <LineChart
                    data={productChartData}
                    width={screenWidth}
                    height={250}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chartStyle}
                />
            </View>
        </View>
    );
};

const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(51, 224, 235, ${opacity})`, // primaryGreen
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: primaryOrange,
    },
};

const orderChartConfig = {
    backgroundGradientFrom: '#fff',           // Starting background color of the chart
    backgroundGradientTo: '#fff',             // Ending background color of the chart
    decimalPlaces: 0,                         // Number of decimal places to show on values
    color: (opacity = 1) => `rgba(255, 140, 0, ${opacity})`,  // Line color (orange tone with opacity)
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label/text color (black tone with opacity)
    style: {
        borderRadius: 16,
    },

    propsForDots: {
        r: '6',                                 // Radius of dots
        strokeWidth: '2',                       // Width of dot borders
        stroke: primaryOrange,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
    },
    chartTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 6,
        color: '#555',
    },
    chartStyle: {
        borderRadius: 16,
        marginVertical: 8,
    },
});

export default MetricsGraphs;
