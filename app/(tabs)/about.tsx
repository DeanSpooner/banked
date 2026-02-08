import ThemedScreenWrapper from '@/src/components/ThemedScreenWrapper';
import { ThemedText } from '@/src/components/ThemedText';

export default function AboutScreen() {
  return (
    <ThemedScreenWrapper>
      <ThemedText type='title'>Banked</ThemedText>
      <ThemedText type='subtitle'>The bank holiday checker app</ThemedText>
    </ThemedScreenWrapper>
  );
}
