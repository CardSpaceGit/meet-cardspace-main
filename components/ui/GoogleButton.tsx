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

export type GoogleButtonProps = {
  onPress: () => void;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
};

export function GoogleButton({
  onPress,
  title = 'Continue with Google',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: GoogleButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: 'white', 
          borderWidth: 1,
          borderColor: '#EA4335', // Google's red color
          opacity: disabled ? 0.6 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color="#EA4335"
          size="small" 
        />
      ) : (
        <View style={styles.contentContainer}>
          <Image 
            source={require('@/assets/images/google-logo.png')} 
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
    height: 48,
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
    color: '#EA4335',
    ...Fonts.regular,
  },
}); 