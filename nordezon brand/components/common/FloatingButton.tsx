import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import CTouchableOpacity from './CTouchableOpacity'

const FloatingButton = ({
    onPress
}: {
    onPress: () => void
}) => {
    return (
        <View style={styles.fabContainer}>
            <CTouchableOpacity style={styles.fab} onPress={() => onPress()}>
                <Ionicons name="add" size={24} color="#fff" />
            </CTouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    
    fabText: {
        color: '#fff',
        fontFamily: 'PoppinsSemiBold',
        marginLeft: 8,
        fontSize: 12,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        alignItems: 'center', // center the text above the button
    },
    fab: {
        backgroundColor: '#FF6B00',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
})
export default FloatingButton