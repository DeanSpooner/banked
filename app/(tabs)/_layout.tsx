import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].tabBarBackground,
        },
        tabBarActiveBackgroundColor:
          Colors[colorScheme ?? 'light'].tabBarActiveBackground,
        tabBarInactiveBackgroundColor:
          Colors[colorScheme ?? 'light'].tabBarBackground,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='calendar' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='about'
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='info' color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
