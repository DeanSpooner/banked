import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';

export default function AboutScreen() {
  return (
    <ThemedView style={{ height: '100%' }}>
      <ThemedText type='title'>Banked</ThemedText>
      <ThemedText type='subtitle'>The bank holiday checker app</ThemedText>
    </ThemedView>
  );
}
