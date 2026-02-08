import ThemedScreenWrapper from '@/src/components/ThemedScreenWrapper';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { useBankHolidaysContext } from '@/src/contexts/BankHolidayContext';
import {
  addMonths,
  format,
  isBefore,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const EditScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    bankHolidays,
    originalBankHolidays,
    updateBankHoliday,
    resetBankHoliday,
  } = useBankHolidaysContext();

  const holiday = bankHolidays.find(h => h.id === id);
  const originalHoliday = originalBankHolidays.find(h => h.id === id);

  const [title, setTitle] = useState(holiday?.title || '');
  const [date, setDate] = useState(holiday?.date || '');

  if (!holiday || !originalHoliday) {
    return (
      <ThemedScreenWrapper>
        <ThemedText type='subtitle'>
          Sorry, we encountered an issue trying to view this bank holiday.
        </ThemedText>
        <Button
          title='← Back to calendar'
          color='green'
          onPress={() => {
            router.back();
          }}
        />
      </ThemedScreenWrapper>
    );
  }

  const dateOnEditScreenEntry = holiday.date;

  const handleSave = () => {
    // Check to see whether the entered title is empty. Save button should be disabled at this point anyway,
    // but keeping this as an extra guard (e.g. if user edits Elements Tree on web):
    if (title.trim().length === 0) {
      return Platform.OS === 'web'
        ? window.alert('Title cannot be empty.')
        : Alert.alert('Error', 'Title cannot be empty.');
    }

    const newDate = parseISO(date);
    const today = new Date();
    const sixMonthsFromNow = addMonths(today, 6);

    // Check to see whether the entered date is within the next six months. The calendar should prevent this ever being chosen,
    // but keeping this as an extra guard anyway:
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

    // Check to see whether the entered date is in the past. The calendar should prevent this ever being chosen,
    // but keeping this as an extra guard anyway:
    if (isBefore(newDate, today)) {
      return Platform.OS === 'web'
        ? window.alert('Date must not be in the past.')
        : Alert.alert('Error', 'Date must not be in the past.');
    }

    const isUnchanged = title === holiday.title && date === holiday.date;

    // If the user hasn't actually made any changes, just let them go back without any modal confirming it:
    if (isUnchanged) {
      router.back();
      return;
    }

    const confirmSave = () => {
      updateBankHoliday(id, { ...holiday, title, date });
      router.back();
    };

    // Confirmation modals for all platforms, to prevent them saving too soon:
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to save these changes?')) {
        confirmSave();
      }
    } else {
      Alert.alert(
        'Save Changes',
        'Are you sure you want to save these changes?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save', onPress: confirmSave },
        ],
      );
    }
  };

  const handleReset = () => {
    const isCurrentlyOriginal =
      holiday.title === originalHoliday.title &&
      holiday.date === originalHoliday.date;

    if (isCurrentlyOriginal) {
      router.back();
      return;
    }

    const confirmReset = () => {
      resetBankHoliday(id);
      router.back();
    };

    if (Platform.OS === 'web') {
      if (
        window.confirm(
          'This will revert all changes in this edited bank holiday back to the original bank holiday. Are you sure?',
        )
      ) {
        confirmReset();
      }
    } else {
      Alert.alert(
        'Reset Bank Holiday',
        'This will revert all changes in this edited bank holiday back to the original bank holiday. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset to original bank holiday',
            onPress: confirmReset,
            style: 'destructive',
          },
        ],
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedScreenWrapper>
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
        <ThemedText type='label'>Date</ThemedText>
        <Calendar
          current={date}
          minDate={format(new Date(), 'yyyy-MM-dd')}
          maxDate={format(addMonths(new Date(), 6), 'yyyy-MM-dd')}
          onDayPress={day => {
            Keyboard.dismiss();
            setDate(day.dateString);
          }}
          markedDates={{
            [dateOnEditScreenEntry]: {
              selected: true,
              selectedColor: '#e1f5fe',
              selectedTextColor: '#0387b8',
              dotColor: '#0387b8',
              marked: true,
            },
            [date]: {
              selected: true,
              selectedColor: '#0387b8',
            },
          }}
        />

        <ThemedView style={styles.buttonContainer}>
          <Button
            title='Save changes'
            onPress={handleSave}
            disabled={title.length === 0}
          />
          <Button
            title='Reset to original bank holiday'
            color='red'
            onPress={handleReset}
          />
          <Button
            title='← Back to calendar'
            color='green'
            onPress={() => {
              router.back();
            }}
          />
        </ThemedView>
      </ThemedScreenWrapper>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
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
