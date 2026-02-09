import { Colors, Spacing } from '@/constants/theme';
import BankedIconAndSubtitle from '@/src/components/BankedIconAndSubtitle';
import ThemedScreenWrapper from '@/src/components/ThemedScreenWrapper';
import { ThemedText } from '@/src/components/ThemedText';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

export default function AboutScreen() {
  const { resolvedTheme } = useTheme();
  const colors = Colors[resolvedTheme];

  return (
    <ThemedScreenWrapper>
      <BankedIconAndSubtitle />
      <ThemedText style={{ marginVertical: 16 }}>
        Banked is an app that conveniently shows the next five bank holidays in
        the United Kingdom. These bank holidays are inclusive of all four
        nations. Users can edit the names and dates of any bank holidays, and
        reset these entries.
      </ThemedText>
      <ThemedText style={{ marginVertical: 16 }}>
        Banked is an app created by Dean Spooner, an app and frontend web
        developer.
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
          <ThemedText>Tap here to visit Dean&apos;s GitHub page</ThemedText>
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
          <ThemedText>Tap here to visit Dean&apos;s portfolio</ThemedText>
        </Pressable>
      </View>
      <View
        style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
      >
        <ThemedText type='defaultSemiBold' style={{ fontStyle: 'italic' }}>
          Banked - built by Dean Spooner, February 2026
        </ThemedText>
      </View>
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
