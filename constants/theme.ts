/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tabBarActiveBackground: '#dbdbdb',
    tabBarBackground: '#c8c8c8',
    tint: tintColorLight,
    icon: '#454b50',
    tabIconDefault: '#8b9093',
    tabIconSelected: tintColorLight,
    warningText: '#CC3300',
    cardBackground: '#f5f5f5',
    border: '#e0e0e0',
    destructive: '#B00020',
    success: '#2E7D32',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tabBarActiveBackground: '#353637',
    tabBarBackground: '#242627',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#ced4da',
    tabIconSelected: tintColorDark,
    warningText: '#FFAB40',
    cardBackground: '#1e1e1e',
    border: '#333333',
    destructive: '#CF6679',
    success: '#81C784',
  },
};

export const Spacing = {
  minTouchTarget: 44,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
