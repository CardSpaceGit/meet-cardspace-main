import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  StyleProp, 
  ViewStyle, 
  TextStyle,
  Image,
  View
} from 'react-native';
import { Theme } from '@/constants/Theme';
import { Fonts } from '@/constants/Fonts';

export type AppleButtonProps = {
  onPress: () => void;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
};

export function AppleButton({
  onPress,
  title = 'Continue with Apple',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: AppleButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#000000',
          opacity: disabled ? 0.6 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color="#000000"
          size="small" 
        />
      ) : (
        <View style={styles.contentContainer}>
          <Image 
            source={require('@/assets/images/apple.png')} 
            style={styles.icon}
            resizeMode="contain"
          />
          <Text 
            style={[
              styles.text,
              textStyle
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: Theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginVertical: Theme.spacing.sm,
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: Theme.spacing.sm,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000000',
    ...Fonts.regular,
  },
}); 