import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { InputField } from './ui/InputField';

export function OutlinedInputExample() {
  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <InputField
        label="Outlined input"
        placeholder="Type something"
        value={value}
        onChangeText={setValue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
}); 