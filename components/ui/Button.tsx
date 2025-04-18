import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  GestureResponderEvent,
  AccessibilityState,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/Theme';
import { ColorPalette } from '@/constants/Colors';

// Define the gradient colors for CardSpace - using from Theme
const CARDSPACE_GRADIENT_COLORS = Theme.gradients.cardspace;

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'outline'
  | 'gradient';

export type ButtonSize = 'sm' | 'md' | 'lg';

// Props for the Button component
export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Button component
export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  // Get the appropriate button theme based on the variant
  const buttonTheme = Theme.buttons[variant];
  
  // Set accessibility props
  const accessibilityState: AccessibilityState = {
    disabled: disabled || loading,
    busy: loading,
  };

  // Render a gradient button if variant is 'gradient' or 'primary'
  if (variant === 'gradient' || variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={loading || disabled ? undefined : onPress}
        disabled={loading || disabled}
        style={[
          styles.container,
          fullWidth && styles.fullWidth,
          getSizeStyle(size),
          disabled && styles.disabledButton,
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={accessibilityState}
        {...props}
      >
        <LinearGradient
          colors={CARDSPACE_GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            getSizeStyle(size),
          ]}
        >
          {loading ? (
            <ActivityIndicator color={buttonTheme.textColor} />
          ) : (
            <Text
              style={[
                styles.text,
                { color: buttonTheme.textColor },
                getTextSizeStyle(size),
                textStyle,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Otherwise, render standard button
  return (
    <TouchableOpacity
      onPress={loading || disabled ? undefined : onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getSizeStyle(size),
        fullWidth && styles.fullWidth,
        {
          backgroundColor: buttonTheme.backgroundColor,
          borderColor: 'borderColor' in buttonTheme ? buttonTheme.borderColor : undefined,
          borderWidth: 'borderWidth' in buttonTheme ? buttonTheme.borderWidth : 0,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={buttonTheme.textColor} 
          size={size === 'sm' ? 'small' : 'large'} 
        />
      ) : (
        <Text 
          style={[
            styles.text,
            { color: buttonTheme.textColor },
            getTextSizeStyle(size),
            textStyle
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Helper functions for getting size-specific styles
const getSizeStyle = (size: ButtonSize): ViewStyle => {
  switch (size) {
    case 'sm':
      return styles.smallButton;
    case 'lg':
      return styles.largeButton;
    default:
      return {};
  }
};

const getTextSizeStyle = (size: ButtonSize): TextStyle => {
  switch (size) {
    case 'sm':
      return styles.smallText;
    case 'lg':
      return styles.largeText;
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    overflow: 'hidden',
  },
  button: {
    height:48,
    borderRadius: Theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginVertical: Theme.spacing.sm,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: Theme.text.body.fontSize,
    textAlign: 'center',
    fontWeight: 'regular',
  },
  gradient: {
    width: '100%',
    height:48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
  smallButton: {
    height: 40,
    paddingHorizontal: Theme.spacing.md,
  },
  largeButton: {
    height: 64,
    paddingHorizontal: Theme.spacing.xl,
  },
  disabledButton: {
    opacity: 0.6,
  },
  smallText: {
    fontSize: Theme.text.caption.fontSize,
  },
  largeText: {
    fontSize: Theme.text.subheader.fontSize,
  },
}); 