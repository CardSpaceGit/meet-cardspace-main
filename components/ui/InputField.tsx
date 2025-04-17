import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type InputFieldProps = TextInputProps & {
  label?: string;
  lightColor?: string;
  darkColor?: string;
  error?: string;
};

export function InputField({
  label,
  lightColor,
  darkColor,
  error,
  style,
  ...props
}: InputFieldProps) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const borderColor = textColor; // Using text color for border
  const errorColor = '#ff3b30';

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { 
            borderColor: error ? errorColor : borderColor,
            color: textColor,
          },
          style,
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
}); 