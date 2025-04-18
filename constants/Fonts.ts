/**
 * Font constants for the app
 * Uses Century Gothic as the main font family
 */

export const Fonts = {
  // Regular font
  regular: {
    fontFamily: 'CenturyGothic',
  },
  
  // Bold
  bold: {
    fontFamily: 'CenturyGothic-Bold',
  },
  
  // Italic
  italic: {
    fontFamily: 'CenturyGothic-Italic',
  },
  
  // Bold Italic
  boldItalic: {
    fontFamily: 'CenturyGothic-BoldItalic',
  },
  
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Helper functions
  get title() {
    return {
      ...this.regular,
      fontSize: this.sizes.xxl,
    };
  },
  
  get subtitle() {
    return {
      ...this.regular,
      fontSize: this.sizes.lg,
    };
  },
  
  get body() {
    return {
      ...this.regular,
      fontSize: this.sizes.md,
    };
  },
  
  get label() {
    return {
      ...this.bold,
      fontSize: this.sizes.sm,
    };
  },
}; 