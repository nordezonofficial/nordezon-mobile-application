import { primaryOrange } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DataNotFoundProps {
    message?: string;
    icon?: string;
    color?: string;
}

const DataNotFound: React.FC<DataNotFoundProps> = ({
    message = 'No Data Found',
    icon = 'alert-circle-outline',
    color = primaryOrange, // your theme color
}) => {
    return (
        <View style={styles.container}>
            <Ionicons name={icon as any} size={50} color={color} style={styles.icon} />
            <Text style={[styles.text, { color }]}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    icon: {
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default DataNotFound;
