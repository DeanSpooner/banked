import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ThemedView } from './ThemedView';

const ThemedScreenWrapper = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <ThemedView
      style={[
        {
          height: '100%',
        },
        style,
      ]}
    >
      <View style={{ flex: 1, margin: 16 }}>{children}</View>
    </ThemedView>
  );
};

export default ThemedScreenWrapper;
