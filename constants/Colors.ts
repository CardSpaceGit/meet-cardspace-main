/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

/**
 * App color palette based on the design system
 */
export const ColorPalette = {
  // Text colors
  textPrimary: '#3F3773',   // Primary text color - deep purple
  textSecondary: '#7D75A4', // Secondary text color - muted purple
  
  // Background color
  white: '#FFFFFF',         // White background
  
  // UI element colors
  style_03: '#EFF1F8',      // Light gray-blue
  style_04: '#F8FAFC',      // Very light gray
  style_05: '#F04869',      // Bright pink/red
  style_06: '#E675CA',      // Pink/purple
  style_07: '#786EC7',      // Medium purple
  style_08: '#A79EDF',      // Light purple
  style_09: '#F47963',      // Salmon/coral
  style_10: [               // Multiple variants of style_10
    '#FFC229',              // Yellow
    '#4DCA99',              // Teal/green
    '#6698F8',              // Blue
  ],
};

export const Colors = {
  light: {
    text: ColorPalette.textPrimary,
    secondaryText: ColorPalette.textSecondary,
    background: ColorPalette.white,
    tint: ColorPalette.style_07,
    icon: ColorPalette.textSecondary,
    tabIconDefault: ColorPalette.textSecondary,
    tabIconSelected: ColorPalette.style_07,
    error: ColorPalette.style_05,
    success: ColorPalette.style_10[1], // Using the teal/green
    warning: ColorPalette.style_10[0], // Using the yellow
    info: ColorPalette.style_10[2],    // Using the blue
    borderColor: ColorPalette.style_03,
  },
  dark: {
    text: '#ECEDEE',
    secondaryText: '#9BA1A6',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    error: ColorPalette.style_05,
    success: ColorPalette.style_10[1], // Using the teal/green
    warning: ColorPalette.style_10[0], // Using the yellow
    info: ColorPalette.style_10[2],    // Using the blue
    borderColor: '#2A2D30',
  },
};
