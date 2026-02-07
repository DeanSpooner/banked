import { BANK_HOLIDAYS_API_URL } from '@/constants/constants';
import { BankHoliday } from '@/src/api/schemas';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { processBankHolidays } from '@/src/utils/processBankHolidays';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  const [bankHolidays, setBankHolidays] = useState<BankHoliday[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        // Reset the loading and error states every time this fetch is called:
        setIsLoading(true);
        setError(null);

        const response = await fetch(BANK_HOLIDAYS_API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const rawData = await response.json();

        const processedData = processBankHolidays(rawData);
        setBankHolidays(processedData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Sorry, an error was encountered fetching the bank holidays. Please try again later.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  if (isLoading) return <ThemedText>Loading!</ThemedText>;
  if (error) return <ThemedText>Error: {error}</ThemedText>;

  return (
    <ThemedView style={{ height: '100%' }}>
      <ThemedText type='title'>Banked</ThemedText>
      <ThemedText type='subtitle'>The bank holiday checker app</ThemedText>

      <View style={{ flex: 1, paddingTop: 50 }}>
        {bankHolidays.map((holiday, index) => (
          <View
            key={index}
            style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
          >
            <ThemedText type='defaultSemiBold'>{holiday.title}</ThemedText>
            <ThemedText>{holiday.date}</ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}
