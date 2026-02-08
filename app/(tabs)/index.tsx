import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { useBankHolidays } from '@/src/hooks/useBankHolidays';
import { addToCalendar } from '@/src/utils/addToCalendar';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const { bankHolidays, isLoading, error } = useBankHolidays();

  if (isLoading) {
    return (
      <ThemedView
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ThemedText>Loading!</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={{
        height: '100%',
        padding: 32,
      }}
    >
      <ThemedText type='title'>Banked</ThemedText>
      <ThemedText type='subtitle'>The bank holiday checker app</ThemedText>

      <ScrollView style={{ flex: 1, paddingTop: 32 }}>
        {bankHolidays.map((holiday, index) => (
          <View
            key={index}
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderColor: '#ccc',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Pressable
              style={{
                flex: 1,
                minHeight: 48,
                padding: 8,
                borderColor: 'green',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                router.push({
                  pathname: '/edit',
                  params: { index },
                });
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <ThemedText type='defaultSemiBold'>{holiday.title}</ThemedText>
                <ThemedText>{holiday.date}</ThemedText>
              </View>
            </Pressable>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Pressable
                style={{
                  minHeight: 48,
                  padding: 8,
                  borderColor: 'red',
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => addToCalendar(holiday.title, holiday.date)}
              >
                <ThemedText>Add to calendar</ThemedText>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
