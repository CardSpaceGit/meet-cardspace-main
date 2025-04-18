import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from 'react-native';
import { Theme } from '@/constants/Theme';
import { Fonts } from '@/constants/Fonts';

interface CodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  error?: boolean;
}

export const CodeInput = ({
  length = 6,
  value,
  onChange,
  autoFocus = true,
  error = false
}: CodeInputProps) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focused, setFocused] = useState<number | null>(autoFocus ? 0 : null);

  useEffect(() => {
    // Pre-fill the inputRefs array with null values
    inputRefs.current = Array(length).fill(null);
  }, [length]);

  useEffect(() => {
    // When the component mounts, focus on the first input if autoFocus is true
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleChange = (text: string, index: number) => {
    // Only allow digits
    if (text && !/^\d+$/.test(text)) {
      return;
    }
    
    // Create a new value array, ensuring it's the right length
    const newValue = value.padEnd(length, '').split('');
    
    // Update the value at the current index
    newValue[index] = text;
    
    // Call the onChange prop with the new combined value
    onChange(newValue.join(''));
    
    // If we entered a digit and we're not at the last input, focus the next input
    if (text && index < length - 1) {
      // Use setTimeout to ensure the state update happens before focusing
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    // If backspace is pressed and the current input is empty, focus the previous input
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocused(index);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  const getInputStyle = (index: number) => {
    return [
      styles.input,
      focused === index && styles.inputFocused,
      error && styles.inputError,
      value[index] ? styles.inputFilled : null,
    ];
  };

  // Create array from the length
  const inputs = Array.from({ length }, (_, index) => (
    <View key={index} style={styles.inputContainer}>
      <TextInput
        ref={(ref) => {
          inputRefs.current[index] = ref;
        }}
        style={getInputStyle(index)}
        value={value[index] || ''}
        onChangeText={(text) => handleChange(text, index)}
        onKeyPress={(e) => handleKeyPress(e, index)}
        onFocus={() => handleFocus(index)}
        onBlur={handleBlur}
        keyboardType="number-pad"
        maxLength={1}
        selectTextOnFocus
        caretHidden={Platform.OS === 'android'}
      />
    </View>
  ));

  return (
    <View style={styles.container}>
      {inputs}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  inputContainer: {
    width: '15%',
    aspectRatio: 1,
  },
  input: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: Theme.colors.style_03,
    borderRadius: Theme.borderRadius.md,
    fontSize: 20,
    textAlign: 'center',
    color: Theme.colors.textPrimary,
    ...Fonts.regular,
  },
  inputFocused: {
    borderColor: Theme.colors.style_07,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Theme.colors.style_05,
  },
  inputFilled: {
    backgroundColor: Theme.colors.style_04,
  },
}); 