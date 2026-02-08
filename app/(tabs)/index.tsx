import { Colors, Spacing } from '@/constants/theme';
import ThemedScreenWrapper from '@/src/components/ThemedScreenWrapper';
import { ThemedText } from '@/src/components/ThemedText';
import { useBankHolidays } from '@/src/hooks/useBankHolidays';
import { addToCalendar } from '@/src/utils/addToCalendar';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { bankHolidays, isLoading, error } = useBankHolidays();

  const handleAddPress = (title: string, date: string) => {
    const message = `Would you like to add "${title}" on ${format(parseISO(date), 'do MMMM yyyy')} to your device calendar?`;

    if (Platform.OS === 'web') {
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
      <ThemedScreenWrapper>
        <ThemedText>Loading…</ThemedText>
      </ThemedScreenWrapper>
    );
  }

  if (error) {
    return (
      <ThemedScreenWrapper>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedScreenWrapper>
    );
  }

  return (
    <ThemedScreenWrapper>
      <Image
        style={styles.bankedIcon}
        source={require('@/assets/images/BankedBIcon.png')}
      />
      <ThemedText type='subtitle' style={styles.bankedSubtitle}>
        Banked: The bank holiday checker app
      </ThemedText>
      <ThemedText style={styles.hint}>
        Tap a bank holiday to edit its details:
      </ThemedText>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {bankHolidays.map(({ title, date, id }) => (
          <View
            key={id}
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.cardTapArea,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => {
                router.push({ pathname: '/edit', params: { id } });
              }}
            >
              <View style={styles.cardContent}>
                <ThemedText type='defaultSemiBold'>{title}</ThemedText>
                <ThemedText>
                  {format(parseISO(date), 'do MMMM yyyy')}
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                { borderColor: colors.border },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => handleAddPress(title, date)}
            >
              <ThemedText style={{ color: colors.success }}>
                Add to calendar
              </ThemedText>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </ThemedScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bankedIcon: { width: 80, height: 80, alignSelf: 'center', marginBottom: 16 },
  bankedSubtitle: { textAlign: 'center' },
  hint: {
    marginTop: 32,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
  },
  cardTapArea: {
    flex: 1,
    minHeight: Spacing.minTouchTarget,
    padding: 16,
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  addButton: {
    minHeight: Spacing.minTouchTarget,
    minWidth: Spacing.minTouchTarget,
    paddingHorizontal: 16,
    borderLeftWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
