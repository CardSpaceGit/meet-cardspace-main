import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Fonts } from '@/constants/Fonts';
import { ColorPalette } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';

export type InputFieldProps = TextInputProps & {
  label?: string;
  lightColor?: string;
  darkColor?: string;
  error?: string;
  variant?: 'outlined' | 'filled';
};

export function InputField({
  label,
  lightColor,
  darkColor,
  error,
  style,
  variant = 'outlined',
  ...props
}: InputFieldProps) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  
  // Use color palette colors
  const primaryColor = ColorPalette.style_07; // Purple from our design system
  const errorColor = ColorPalette.style_05;
  const borderColor = error ? errorColor : primaryColor;
  
  // Different styling based on variant
  const isOutlined = variant === 'outlined';
  const inputStyles = isOutlined 
    ? Theme.inputs.default
    : Theme.inputs.filled;

  return (
    <View style={styles.container}>
      <View style={styles.outlinedContainer}>
        <TextInput
          style={[
            styles.outlinedInput,
            { 
              borderColor: error ? errorColor : inputStyles.borderColor,
              color: inputStyles.textColor,
              backgroundColor: inputStyles.backgroundColor,
            },
            style,
          ]}
          placeholderTextColor={inputStyles.placeholderColor}
          {...props}
        />
        {label && (
          <Text 
            style={[
              styles.outlinedLabel, 
              { 
                color: error ? errorColor : inputStyles.labelColor, 
                backgroundColor: isOutlined ? backgroundColor : inputStyles.backgroundColor
              }
            ]}
          >
            {label}
          </Text>
        )}
      </View>
      {error && <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  outlinedContainer: {
    position: 'relative',
  },
  outlinedInput: {
    height: 56,
    borderWidth: 1,
    borderRadius: Theme.borderRadius.round,
    paddingHorizontal: 15,
    fontSize: 16,
    paddingTop: 12,
    paddingBottom: 6,
    ...Fonts.regular,
  },
  outlinedLabel: {
    position: 'absolute',
    top: -10,
    left: 15,
    fontSize: 14,
    paddingHorizontal: 4,
    ...Fonts.bold,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    ...Fonts.regular,
  },
}); 