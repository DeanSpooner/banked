import { Colors, Spacing } from '@/constants/theme';
import BankedIconAndSubtitle from '@/src/components/BankedIconAndSubtitle';
import ThemedScreenWrapper from '@/src/components/ThemedScreenWrapper';
import { ThemedText } from '@/src/components/ThemedText';
import { useBankHolidaysContext } from '@/src/contexts/BankHolidayContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

export default function AboutScreen() {
  const { setThemeMode, resolvedTheme, themeMode } = useTheme();
  const colors = Colors[resolvedTheme];

  const { factoryReset } = useBankHolidaysContext();

  const handleReset = () => {
    const confirmReset = () => {
      factoryReset();
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

  const modes = ['light', 'dark', 'system'] as const;

  const modeStrings = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };

  return (
    <ThemedScreenWrapper>
      <BankedIconAndSubtitle />
      <View style={styles.container}>
        <ThemedText type='label' style={{ marginBottom: 12 }}>
          Appearance
        </ThemedText>
        <View
          style={[
            styles.buttonRow,
            { backgroundColor: colors.tabBarBackground },
          ]}
        >
          {modes.map(mode => {
            const isActive = themeMode === mode;
            return (
              <Pressable
                key={mode}
                onPress={() => setThemeMode(mode)}
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    borderColor: colors.border,
                    minHeight: Spacing.minTouchTarget,
                  },
                  pressed && { opacity: 0.8 },
                  isActive && { borderColor: colors.success },
                ]}
              >
                <ThemedText style={[styles.buttonText, { color: colors.tint }]}>
                  {modeStrings[mode]}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
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
          <ThemedText
            style={[styles.buttonText, { color: colors.destructive }]}
          >
            Factory reset - remove all saved bank holidays
          </ThemedText>
        </Pressable>
      </View>
    </ThemedScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 16, paddingHorizontal: 16 },
  label: { fontSize: 14, marginBottom: 8, opacity: 0.7 },
  buttonRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 8,
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  buttonText: { textAlign: 'center' },
  spacer: { height: 20 },
  actionButton: {
    minHeight: Spacing.minTouchTarget,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
