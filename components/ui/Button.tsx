import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Theme } from '@/constants/Theme';
import { ColorPalette } from '@/constants/Colors';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'outline';

export type ButtonProps = {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
};

export function Button({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const buttonTheme = Theme.buttons[variant];
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: buttonTheme.backgroundColor,
          borderColor: 'borderColor' in buttonTheme ? buttonTheme.borderColor : undefined,
          borderWidth: 'borderWidth' in buttonTheme ? buttonTheme.borderWidth : 0,
          opacity: disabled ? 0.6 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? ColorPalette.textPrimary : ColorPalette.white} 
          size="small" 
        />
      ) : (
        <Text 
          style={[
            styles.text,
            { color: buttonTheme.textColor },
            textStyle
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginVertical: Theme.spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 