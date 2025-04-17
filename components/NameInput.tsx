import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { InputField } from './ui/InputField';

interface NameInputProps {
  onNameChange?: (name: string) => void;
  defaultValue?: string;
}

export function NameInput({ onNameChange, defaultValue = '' }: NameInputProps) {
  const [name, setName] = useState(defaultValue);

  const handleNameChange = (text: string) => {
    setName(text);
    if (onNameChange) {
      onNameChange(text);
    }
  };

  return (
    <View style={styles.container}>
      <InputField
        label="Your Full Name"
        placeholder="e.g Awesomeness"
        value={name}
        onChangeText={handleNameChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
}); 