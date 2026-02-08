import { BankHolidayProvider } from '@/src/contexts/BankHolidayContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <BankHolidayProvider>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='edit'
          options={{ title: 'Edit Bank Holiday', presentation: 'modal' }}
        />
      </Stack>
    </BankHolidayProvider>
  );
}
