import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import HomeHeader from '@/components/home/HomeHeader';
import { primaryOrange } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';

export default function BrandTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                header: () => <HomeHeader />,
                tabBarActiveTintColor: primaryOrange,
                tabBarInactiveTintColor: '#555',
                tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 5 },
            }}
        >

            {/* 1. Order List */}
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Orders',
                    headerShown: true,
                    tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
                    tabBarButton: (props) => (
                        <CTouchableOpacity
                            {...props as any}
                            onPress={() => router.push('/(home)/order')}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="carts"
                options={{
                    title: 'Cart',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
                    tabBarButton: (props) => (
                        <CTouchableOpacity
                            {...props as any}
                            onPress={() => router.push('/(home)/cart')}
                        />
                    ),
                }}
            />

            {/* 3. Home */}
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />

            {/* 4. Shopping Reels */}
            <Tabs.Screen
                name="shopping"
                options={{
                    title: 'Reels',
                    tabBarIcon: ({ color, size }) => <Ionicons name="play-circle-outline" size={size} color={color} />,
                    tabBarButton: (props) => (
                        <CTouchableOpacity
                            {...props as any}
                            onPress={() => { }}
                        />
                    ),
                }}
            />

            {/* 5. Settings */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
                    tabBarButton: (props) => (
                        <CTouchableOpacity
                            {...props as any}
                            onPress={() => router.push('/(brand)/settings')}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
