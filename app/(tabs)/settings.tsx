import { Colors, Spacing } from '@/constants/theme';
import BankedIconAndSubtitle from '@/src/components/BankedIconAndSubtitle';
import ThemedScreenWrapper from '@/src/components/ThemedScreenWrapper';
import { ThemedText } from '@/src/components/ThemedText';
import { useBankHolidaysContext } from '@/src/contexts/BankHolidayContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

export default function AboutScreen() {
  const { setThemeMode, resolvedTheme, themeMode } = useTheme();
  const colors = Colors[resolvedTheme];

  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const changeLanguage = async (lang: 'en' | 'ja') => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('user-language', lang);
  };

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
    light: t(`themes.light`),
    dark: t(`themes.dark`),
    system: t(`themes.system`),
  };

  return (
    <ThemedScreenWrapper>
      <BankedIconAndSubtitle />
      <View style={styles.container}>
        <ThemedText type='label' style={styles.label}>
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
        <ThemedText type='label' style={styles.label}>
          {t('language')}
        </ThemedText>
        <View
          style={[
            styles.buttonRow,
            { backgroundColor: colors.tabBarBackground },
          ]}
        >
          {(['en', 'ja'] as const).map(lang => (
            <Pressable
              key={lang}
              onPress={() => changeLanguage(lang)}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  borderColor: colors.border,
                  minHeight: Spacing.minTouchTarget,
                },
                pressed && { opacity: 0.8 },
                lang === currentLanguage && { borderColor: colors.success },
              ]}
            >
              <ThemedText style={[styles.buttonText, { color: colors.tint }]}>
                {lang === 'en' ? 'English 🇬🇧' : '日本語 🇯🇵'}
              </ThemedText>
            </Pressable>
          ))}
        </View>
        <ThemedText type='label' style={styles.label}>
          Factory reset - remove all saved bank holidays from your device
        </ThemedText>
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
            Delete all saved bank holidays
          </ThemedText>
        </Pressable>
      </View>
    </ThemedScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 16, paddingHorizontal: 16 },
  label: { marginBottom: 8 },
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
