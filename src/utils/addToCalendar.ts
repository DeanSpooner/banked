import * as Calendar from 'expo-calendar';
import { Alert, Platform } from 'react-native';

export async function addToCalendar(title: string, dateString: string) {
  if (Platform.OS === 'web') {
    window.alert(
      'Sorry! Adding to calendars is currently only available via the Banked mobile app.',
    );
    return;
  }

  const { status } = await Calendar.requestCalendarPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permission Denied',
      `Please enable calendar access for Banked in your device's settings to use this feature.`,
    );
    return;
  }

  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );

  const defaultCalendar =
    Platform.OS === 'ios'
      ? await Calendar.getDefaultCalendarAsync()
      : calendars.find(cal => cal.isPrimary) || calendars[0];

  // Found on Android (at least via my Android Emulator) that it didn't detect the calendar, even though it already had one installed.
  // I just needed to open it once for it to be detected. May only be an emulator/Expo Go thing, but think this could be helpful messaging:
  if (!defaultCalendar) {
    Alert.alert(
      'Error',
      'No calendar found on this device. Please install and launch your calendar app, then try again.',
    );
    return;
  }

  try {
    const startDate = new Date(dateString);
    const endDate = new Date(dateString);

    await Calendar.createEventAsync(defaultCalendar.id, {
      title: `Bank Holiday: ${title}`,
      startDate,
      endDate,
      allDay: true,
      notes: 'Added from the Banked app.',
    });

    Alert.alert('Success!', `${title} has been added to your calendar.`);
  } catch (error) {
    Alert.alert('Error', 'Failed to save event to your calendar.');
    console.error(error);
  }
}
