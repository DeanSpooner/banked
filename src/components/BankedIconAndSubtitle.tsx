import { ThemedText } from '@/src/components/ThemedText';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet } from 'react-native';

const BankedIconAndSubtitle = () => {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const BankedBIcon = require('@/assets/images/BankedBIcon.png');
  const BankedBaIcon = require('@/assets/images/BankedBaIcon.png');

  return (
    <>
      <Image
        style={styles.bankedIcon}
        source={currentLanguage === 'ja' ? BankedBaIcon : BankedBIcon}
      />
      <ThemedText type='subtitle' style={styles.bankedSubtitle}>
        {t('misc.bankedTheHolidayCheckerApp')}
      </ThemedText>
    </>
  );
};

const styles = StyleSheet.create({
  bankedIcon: { width: 40, height: 40, alignSelf: 'center', marginBottom: 16 },
  bankedSubtitle: { textAlign: 'center' },
});

export default BankedIconAndSubtitle;
