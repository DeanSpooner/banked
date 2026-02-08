import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { useBankHolidaysContext } from '@/src/contexts/BankHolidayContext';
import { addMonths, isBefore, isWithinInterval, parseISO } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const EditScreen = () => {
  const router = useRouter();
  const { index } = useLocalSearchParams<{ index: string }>();
  const { bankHolidays, updateBankHoliday, resetBankHoliday } =
    useBankHolidaysContext();

  const holidayIndex = parseInt(index);
  const holiday = bankHolidays[holidayIndex];

  const [title, setTitle] = useState(holiday?.title || '');
  const [date, setDate] = useState(holiday?.date || '');

  if (!holiday) return <ThemedText>Holiday not found</ThemedText>;

  const handleSave = () => {
    // Check to see whether the entered title is empty. Save button should be disabled at this point anyway,
    // but keeping this as an extra guard (e.g. if user edits Elements Tree on web):
    if (title.length === 0) {
      return Platform.OS === 'web'
        ? window.alert('Title cannot be empty.')
        : Alert.alert('Error', 'Title cannot be empty.');
    }

    const newDate = parseISO(date);
    const today = new Date();
    const sixMonthsFromNow = addMonths(today, 6);

    // Check to see whether the entered date is within the next six months:
    if (
      !isWithinInterval(newDate, {
        start: today,
        end: sixMonthsFromNow,
      })
    ) {
      return Platform.OS === 'web'
        ? window.alert('Date must be within the next 6 months.')
        : Alert.alert('Error', 'Date must be within the next 6 months.');
    }

    // Check to see whether the entered date is in the past:
    if (isBefore(newDate, today)) {
      return Platform.OS === 'web'
        ? window.alert('Date must not be in the past.')
        : Alert.alert('Error', 'Date must not be in the past.');
    }

    updateBankHoliday(holidayIndex, { ...holiday, title, date });
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='subtitle'>
        Edit the bank holiday details. Title and Date are both required fields.
      </ThemedText>
      <View style={{ flexDirection: 'row' }}>
        <ThemedText type='label'>Name</ThemedText>
        {title.length === 0 && (
          <ThemedText type='warning'>Name cannot be empty!</ThemedText>
        )}
      </View>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder='Type your bank holiday name here...'
      />
      <ThemedText type='label'>Date (YYYY-MM-DD)</ThemedText>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder='2026-04-03'
      />

      <ThemedView style={styles.buttonContainer}>
        <Button
          title='Save Changes'
          onPress={handleSave}
          disabled={title.length === 0}
        />
        <Button
          title='Reset to Original'
          color='green'
          onPress={() => {
            resetBankHoliday(holidayIndex);
            router.back();
          }}
        />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 2,
    borderColor: '#0387b8',
    padding: 12,
    borderRadius: 4,
    marginTop: 4,
    color: '#000',
    backgroundColor: '#fff',
  },
  buttonContainer: { marginTop: 20, gap: 20 },
});

export default EditScreen;
