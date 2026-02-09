import { Colors, Spacing } from '@/constants/theme';
import BankedIconAndSubtitle from '@/src/components/BankedIconAndSubtitle';
import ThemedScreenWrapper from '@/src/components/ThemedScreenWrapper';
import { ThemedText } from '@/src/components/ThemedText';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useBankHolidays } from '@/src/hooks/useBankHolidays';
import { addToCalendar } from '@/src/utils/addToCalendar';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { resolvedTheme } = useTheme();
  const colors = Colors[resolvedTheme];

  const {
    bankHolidays,
    isLoading,
    error,
    originalBankHolidays,
    fetchHolidays,
    isConnected,
  } = useBankHolidays();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHolidays(true);
    setRefreshing(false);
  }, [fetchHolidays]);

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
        <BankedIconAndSubtitle />
        <ThemedText
          type='defaultSemiBold'
          style={{ fontStyle: 'italic', textAlign: 'center', marginTop: 16 }}
        >
          Please wait while the bank holidays are loaded...
        </ThemedText>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size={'large'} />
        </View>
      </ThemedScreenWrapper>
    );
  }

  return (
    <ThemedScreenWrapper>
      <BankedIconAndSubtitle />
      {error && <ThemedText type='warning'>Error: {error}</ThemedText>}
      {isConnected === false && (
        <ThemedText type='warning'>
          You appear to be offline - please reconnect to load any new bank
          holiday data.
        </ThemedText>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 32,
        }}
      >
        <ThemedText style={styles.hint}>
          Tap a bank holiday to edit its details:
        </ThemedText>
        <Pressable
          onPress={onRefresh}
          disabled={refreshing || isConnected === false}
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <IconSymbol
            name='arrow.clockwise'
            size={24}
            color={isConnected === false ? colors.icon : colors.edit}
            style={{ alignSelf: 'center', opacity: refreshing ? 0.5 : 1 }}
          />
        </Pressable>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        alwaysBounceVertical
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
            colors={[colors.tint]}
          />
        }
      >
        {bankHolidays.map(({ title, date, id }) => {
          const original = originalBankHolidays.find(hol => hol.id === id);
          const isEdited =
            original && (original.title !== title || original.date !== date);

          return (
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
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={styles.cardContent}>
                    <ThemedText type='defaultSemiBold'>{title}</ThemedText>
                    <ThemedText>
                      {format(parseISO(date), 'do MMMM yyyy')}
                    </ThemedText>
                  </View>
                  {isEdited && (
                    <IconSymbol
                      name='pencil'
                      size={24}
                      color={colors.edit}
                      style={{ alignSelf: 'center' }}
                    />
                  )}
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
          );
        })}
      </ScrollView>
    </ThemedScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bankedIcon: { width: 80, height: 80, alignSelf: 'center', marginBottom: 16 },
  bankedSubtitle: { textAlign: 'center' },
  hint: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  refreshButton: {
    alignSelf: 'flex-end',
    minHeight: Spacing.minTouchTarget,
    minWidth: Spacing.minTouchTarget,
    justifyContent: 'center',
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
