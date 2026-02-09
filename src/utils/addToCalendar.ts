import * as Calendar from 'expo-calendar';
import { t } from 'i18next';
import { Alert, Platform } from 'react-native';

export async function addToCalendar(title: string, dateString: string) {
  if (Platform.OS === 'web') {
    window.alert(
      t(
        'calendar.sorryAddingToCalendarsIsCurrentlyOnlyAvailableViaTheBankedApp',
      ),
    );
    return;
  }

  const { status } = await Calendar.requestCalendarPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      t('calendar.permissionDenied'),
      t('calendar.pleaseEnableCalendarAccessForBanked'),
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
    Alert.alert(t('calendar.error'), t('calendar.noCalendarFoundOnThisDevice'));
    return;
  }

  try {
    const startDate = new Date(dateString);
    const endDate = new Date(dateString);

    await Calendar.createEventAsync(defaultCalendar.id, {
      title: t('calendar.bankHolidayTitle', {
        title,
      }),
      startDate,
      endDate,
      allDay: true,
      notes: t('calendar.addedFromTheBankedApp'),
    });

    Alert.alert(
      t('calendar.success'),
      t('calendar.titleHasBeenAddedToYourCalendar', {
        title,
      }),
    );
  } catch (err) {
    Alert.alert(
      t('calendar.error'),
      t('calendar.failedToSaveEventToYourCalendar'),
    );
    console.error(err);
  }
}
