import { BankHolidayProvider } from '@/src/contexts/BankHolidayContext';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../src/i18n';

export default function RootLayout() {
  const { t } = useTranslation();

  return (
    <ThemeProvider>
      <BankHolidayProvider>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen
              name='edit'
              options={{
                title: t('edit.editBankHoliday'),
                presentation: 'modal',
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </BankHolidayProvider>
    </ThemeProvider>
  );
}
