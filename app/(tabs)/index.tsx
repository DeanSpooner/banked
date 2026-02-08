import ThemedScreenWrapper from '@/src/components/ThemedScreenWrapper';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { useBankHolidays } from '@/src/hooks/useBankHolidays';
import { addToCalendar } from '@/src/utils/addToCalendar';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const { bankHolidays, isLoading, error } = useBankHolidays();

  const handleAddPress = (title: string, date: string) => {
    const message = `Would you like to add "${title}" on ${date} to your device calendar?`;

    if (Platform.OS === 'web') {
      // Already added messaging in addToCalendar to handle web, go straight there:
      addToCalendar(title, date);
    } else {
      Alert.alert('Add to Calendar', message, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => addToCalendar(title, date),
        },
      ]);
    }
  };

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
    <ThemedScreenWrapper>
      <ThemedText type='title'>Banked</ThemedText>
      <ThemedText type='subtitle'>The bank holiday checker app</ThemedText>
      <ThemedText>Touch a bank holiday to edit its details:</ThemedText>

      <ScrollView style={{ flex: 1, paddingTop: 32 }}>
        {bankHolidays.map(({ title, date }, index) => (
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
                <ThemedText type='defaultSemiBold'>{title}</ThemedText>
                <ThemedText>
                  {format(parseISO(date), 'do MMMM yyyy')}
                </ThemedText>
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
                onPress={() => handleAddPress(title, date)}
              >
                <ThemedText>Add to calendar</ThemedText>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedScreenWrapper>
  );
}
