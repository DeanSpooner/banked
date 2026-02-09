import { Colors, Spacing } from '@/constants/theme';
import BankedIconAndSubtitle from '@/src/components/BankedIconAndSubtitle';
import ThemedScreenWrapper from '@/src/components/ThemedScreenWrapper';
import { ThemedText } from '@/src/components/ThemedText';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function AboutScreen() {
  const { resolvedTheme } = useTheme();
  const colors = Colors[resolvedTheme];
  const { t } = useTranslation();

  return (
    <ThemedScreenWrapper>
      <BankedIconAndSubtitle />
      <ScrollView>
        <ThemedText style={{ marginVertical: 16 }}>
          {t('about.bankedDescription1')}
        </ThemedText>
        <ThemedText style={{ marginVertical: 16 }}>
          {t('about.bankedDescription2')}
        </ThemedText>
        <View
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
            onPress={() => Linking.openURL('https://github.com/deanspooner')}
          >
            <ThemedText>{t('about.tapHereToVisitDeansGitHubPage')}</ThemedText>
          </Pressable>
        </View>
        <View
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
            onPress={() =>
              Linking.openURL('https://deanspooner.github.io/portfolio')
            }
          >
            <ThemedText>{t('about.tapHereToVisitDeansPortfolio')}</ThemedText>
          </Pressable>
        </View>
        <View
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
        >
          <ThemedText type='defaultSemiBold' style={{ fontStyle: 'italic' }}>
            {t('about.bankedBuiltByDeanSpoonerFebruary2026')}
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
  },
  cardTapArea: {
    flex: 1,
    minHeight: Spacing.minTouchTarget,
    padding: 16,
    justifyContent: 'center',
  },
});
