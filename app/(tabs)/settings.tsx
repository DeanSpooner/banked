import { Colors, Spacing } from '@/constants/theme';
import BankedIconAndSubtitle from '@/src/components/BankedIconAndSubtitle';
import ThemedScreenWrapper from '@/src/components/ThemedScreenWrapper';
import { ThemedText } from '@/src/components/ThemedText';
import { useBankHolidaysContext } from '@/src/contexts/BankHolidayContext';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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

  return (
    <ThemedScreenWrapper>
      <BankedIconAndSubtitle />
      <View style={styles.container}>
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
            Factory reset - remove all saved bank holidays
          </ThemedText>
        </Pressable>
      </View>
    </ThemedScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 16 },
  actionButton: {
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
