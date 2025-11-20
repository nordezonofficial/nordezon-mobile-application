import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const CSettings = () => {
    const router = useRouter();

    const handleOptionPress = async (option: string) => {
        if (option == 'Logout') {
            await AsyncStorage.clear();
            router.replace('/(auth)/login')
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CText style={styles.title}>Settings</CText>

            {/* Account Section */}
            <CText style={styles.sectionTitle}>Account</CText>
            <View style={styles.card}>
                <SettingsItem
                    icon="person-outline"
                    label="Profile"
                    onPress={() => router.push('/(brand)/profile')}

                />
                <SettingsItem
                    icon="key-outline"
                    label="Change Password"
                    onPress={() => router.push('/(brand)/changePassword')}
                />
                {/* <SettingsItem 
                    icon="mail-outline" 
                    label="Email Preferences" 
                    onPress={() => handleOptionPress('Email Preferences')} 
                /> */}
            </View>

            {/* Notifications Section */}
            {/* <CText style={styles.sectionTitle}>Notifications</CText>
            <View style={styles.card}>
                <SettingsItem 
                    icon="notifications-outline" 
                    label="Push Notifications" 
                    onPress={() => handleOptionPress('Push Notifications')} 
                />
                <SettingsItem 
                    icon="mail-unread-outline" 
                    label="Email Notifications" 
                    onPress={() => handleOptionPress('Email Notifications')} 
                />
            </View> */}

            {/* Other Section */}
            <CText style={styles.sectionTitle}>Other</CText>
            <View style={styles.card}>
                <SettingsItem
                    icon="help-circle-outline"
                    label="Help & Support"
                    onPress={() => handleOptionPress('Help & Support')}
                />
                <SettingsItem
                    icon="information-circle-outline"
                    label="About"
                    onPress={() => handleOptionPress('About')}
                />
                <SettingsItem
                    icon="log-out-outline"
                    label="Logout"
                    onPress={() => handleOptionPress('Logout')}
                    isDestructive
                />
            </View>
        </ScrollView>
    );
};

interface SettingsItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    isDestructive?: boolean;
}

const SettingsItem = ({ icon, label, onPress, isDestructive }: SettingsItemProps) => {
    return (
        <CTouchableOpacity style={styles.item} onPress={onPress}>
            <Ionicons name={icon} size={22} color={isDestructive ? '#EF5350' : '#333'} />
            <CText style={[styles.itemLabel, isDestructive && { color: '#EF5350' }]}>{label}</CText>
            <Ionicons name="chevron-forward" size={20} color="#777" />
        </CTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#777',
        marginVertical: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    itemLabel: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
});

export default CSettings;
