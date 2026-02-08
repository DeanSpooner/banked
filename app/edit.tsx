import { Colors, Spacing } from '@/constants/theme';
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
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const EditScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { minHeight: Spacing.minTouchTarget, borderColor: colors.tint },
            pressed && { opacity: 0.8 },
          ]}
          // In some cases, such as on web when refreshing, there is no navigation history for the router to push back to,
          // so safer just to directly push to the Home screen:
          onPress={() => router.push('/')}
        >
          <ThemedText style={{ color: colors.tint }}>
            ← Back to calendar
          </ThemedText>
        </Pressable>
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
      <ThemedScreenWrapper ignoreTopInset>
        <View style={styles.labelRow}>
          <ThemedText type='label'>Name</ThemedText>
          {title.length === 0 && (
            <ThemedText type='warning'>Name cannot be empty!</ThemedText>
          )}
        </View>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              backgroundColor: colors.cardBackground,
              color: colors.text,
            },
          ]}
          value={title}
          onChangeText={setTitle}
          placeholder='Type your bank holiday name here...'
          placeholderTextColor={colors.icon}
        />
        <ThemedText type='label'>Date</ThemedText>
        <View style={styles.calendarOuterContainer}>
          <View
            style={[
              styles.calendarWrapper,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
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
                  selectedColor: '#68d6fd',
                  selectedTextColor: '#000',
                  dotColor: '#0387b8',
                  marked: true,
                },
                [date]: {
                  selected: true,
                  selectedColor: '#0387b8',
                  selectedTextColor: '#fff',
                },
              }}
              style={styles.calendarFixedHeight}
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                textSectionTitleColor: colors.icon,
                todayBackgroundColor: '#4d4d4d',
                todayTextColor: '#fff',
                dayTextColor: colors.text,
                textDisabledColor: colors.icon,
                dotColor: colors.tint,
                arrowColor: colors.tint,
                monthTextColor: colors.text,
              }}
            />
          </View>
        </View>

        <ThemedView style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: colors.tint,
                minHeight: Spacing.minTouchTarget,
                opacity: title.length === 0 ? 0.5 : pressed ? 0.8 : 1,
              },
            ]}
            onPress={handleSave}
            disabled={title.length === 0}
          >
            <ThemedText
              style={[styles.primaryButtonText, { color: colors.background }]}
            >
              Save changes
            </ThemedText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              {
                borderColor: colors.destructive,
                minHeight: Spacing.minTouchTarget,
              },
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleReset}
          >
            <ThemedText style={{ color: colors.destructive }}>
              Reset to original bank holiday
            </ThemedText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { borderColor: colors.border, minHeight: Spacing.minTouchTarget },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.back()}
          >
            <ThemedText style={{ color: colors.tint }}>
              ← Back to calendar
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedScreenWrapper>
    </TouchableWithoutFeedback>
  );
};

const BORDER_RADIUS = 8;
const BORDER_WIDTH = 1;

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
  },
  calendarOuterContainer: {
    height: 400,
  },
  calendarWrapper: {
    borderRadius: BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    marginTop: 4,
  },
  calendarFixedHeight: {},
  input: {
    borderWidth: BORDER_WIDTH,
    padding: 12,
    borderRadius: BORDER_RADIUS,
    marginTop: 4,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    fontWeight: '600',
  },
  actionButton: {
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});

export default EditScreen;
