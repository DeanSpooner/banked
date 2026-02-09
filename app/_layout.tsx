import { BankHolidayProvider } from '@/src/contexts/BankHolidayContext';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <BankHolidayProvider>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen
              name='edit'
              options={{ title: 'Edit Bank Holiday', presentation: 'modal' }}
            />
          </Stack>
        </SafeAreaProvider>
      </BankHolidayProvider>
    </ThemeProvider>
  );
}
