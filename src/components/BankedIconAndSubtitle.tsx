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
});

export default BankedIconAndSubtitle;
