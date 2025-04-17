import { ColorPalette, Colors } from './Colors';
import { Fonts } from './Fonts';

/**
 * Theme helper to easily access colors, fonts, and other design system elements
 */
export const Theme = {
  colors: ColorPalette,
  
  // Button themes
  buttons: {
    primary: {
      backgroundColor: ColorPalette.style_07,
      textColor: ColorPalette.white,
      ...Fonts.bold,
    },
    secondary: {
      backgroundColor: ColorPalette.style_08,
      textColor: ColorPalette.white,
      ...Fonts.bold,
    },
    danger: {
      backgroundColor: ColorPalette.style_05,
      textColor: ColorPalette.white,
      ...Fonts.bold,
    },
    success: {
      backgroundColor: ColorPalette.style_10[1],
      textColor: ColorPalette.white,
      ...Fonts.bold,
    },
    warning: {
      backgroundColor: ColorPalette.style_10[0],
      textColor: ColorPalette.textPrimary,
      ...Fonts.bold,
    },
    info: {
      backgroundColor: ColorPalette.style_10[2],
      textColor: ColorPalette.white,
      ...Fonts.bold,
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: ColorPalette.textPrimary,
      borderColor: ColorPalette.style_03,
      borderWidth: 1,
      ...Fonts.bold,
    },
  },
  
  // Input field themes
  inputs: {
    default: {
      backgroundColor: ColorPalette.white,
      textColor: ColorPalette.textPrimary,
      placeholderColor: ColorPalette.textSecondary,
      borderColor: ColorPalette.style_03,
      labelColor: ColorPalette.textPrimary,
      errorColor: ColorPalette.style_05,
    },
    filled: {
      backgroundColor: ColorPalette.style_04,
      textColor: ColorPalette.textPrimary,
      placeholderColor: ColorPalette.textSecondary,
      borderColor: 'transparent',
      labelColor: ColorPalette.textPrimary,
      errorColor: ColorPalette.style_05,
    },
  },
  
  // Text styles with colors
  text: {
    header: {
      ...Fonts.title,
      color: ColorPalette.textPrimary,
    },
    subheader: {
      ...Fonts.subtitle,
      color: ColorPalette.textSecondary,
    },
    body: {
      ...Fonts.body,
      color: ColorPalette.textPrimary,
    },
    caption: {
      ...Fonts.regular,
      fontSize: Fonts.sizes.sm,
      color: ColorPalette.textSecondary,
    },
    link: {
      ...Fonts.bold,
      color: ColorPalette.style_07,
    },
  },
  
  // Common spacing values
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius values
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  
  // Shadow styles
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
}; 