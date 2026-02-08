import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { BankHolidayProvider } from '@/src/contexts/BankHolidayContext';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <BankHolidayProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].tabBarBackground,
          },
          tabBarActiveBackgroundColor:
            Colors[colorScheme ?? 'light'].background,
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
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
    </BankHolidayProvider>
  );
}
