import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function TabLayout() {
  const { resolvedTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors[resolvedTheme].tabBarBackground,
        },
        tabBarActiveBackgroundColor:
          Colors[resolvedTheme].tabBarActiveBackground,
        tabBarInactiveBackgroundColor: Colors[resolvedTheme].tabBarBackground,
        tabBarActiveTintColor: Colors[resolvedTheme].tint,
        tabBarInactiveTintColor: Colors[resolvedTheme].tint,
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
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='gearshape.fill' color={color} />
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
