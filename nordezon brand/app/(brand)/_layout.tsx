import BrandDetailedHeader from '@/components/brands/BrandDetailedHeader';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import { primaryOrange } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';

export default function BrandTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <BrandDetailedHeader />,
        tabBarActiveTintColor: primaryOrange,
        tabBarInactiveTintColor: '#555',
        tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 5 },
      }}
    >
      {/* Dashboard */}
      <Tabs.Screen
        name="brandHome"
        options={{
          headerShown: false,
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="speedometer-outline" size={size} color={color} />,
        }}
      />
      {/* Catalog */}
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color, size }) => <Ionicons name="albums-outline" size={size} color={color} />,
        }}
      />
      {/* Orders */}
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
        }}
      />
      {/* Messages */}
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <CTouchableOpacity
              {...props as any}
              onPress={() => router.push('/(chat)/chatlist')}
            />
          ),
        }}
      />

      {/* Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="createCatalogue"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="createPost"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="changePassword"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="brandEditProfile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="editCatalogue"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="editPost"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{
          href: null,
        }}
      />

    </Tabs>
  );
}
