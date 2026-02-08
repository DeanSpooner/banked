import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/src/components/ThemedText';
import { Image, StyleSheet } from 'react-native';

const BankedIconAndSubtitle = () => {
  return (
    <>
      <Image
        style={styles.bankedIcon}
        source={require('@/assets/images/BankedBIcon.png')}
      />
      <ThemedText type='subtitle' style={styles.bankedSubtitle}>
        Banked: The bank holiday checker app
      </ThemedText>
    </>
  );
};

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

export default BankedIconAndSubtitle;
