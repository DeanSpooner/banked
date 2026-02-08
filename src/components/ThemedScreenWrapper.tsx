import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ThemedView } from './ThemedView';

const ThemedScreenWrapper = ({
  children,
  style,
  ignoreTopInset,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  ignoreTopInset?: boolean;
}) => {
  return (
    <ThemedView
      style={[
        {
          height: '100%',
        },
        style,
      ]}
      ignoreTopInset={ignoreTopInset}
    >
      <View style={{ flex: 1, margin: 16 }}>{children}</View>
    </ThemedView>
  );
};

export default ThemedScreenWrapper;
