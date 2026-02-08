import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '../hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  ignoreTopInset?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ignoreTopInset = false,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
  );

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          backgroundColor,
          paddingTop: ignoreTopInset ? undefined : insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
