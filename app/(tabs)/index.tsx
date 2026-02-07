import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { useBankHolidays } from '@/src/hooks/useBankHolidays';
import { View } from 'react-native';

export default function HomeScreen() {
  const { bankHolidays, isLoading, error } = useBankHolidays();

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
