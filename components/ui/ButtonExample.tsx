import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from './Button';
import { Theme } from '@/constants/Theme';

export function ButtonExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Button Examples</Text>
      
      <Button 
        title="Primary Button" 
        variant="primary" 
        onPress={() => console.log('Primary button pressed')} 
      />
      
      <Button 
        title="Secondary Button" 
        variant="secondary" 
        onPress={() => console.log('Secondary button pressed')} 
      />
      
      <Button 
        title="Outline Button" 
        variant="outline" 
        onPress={() => console.log('Outline button pressed')} 
      />
      
      <Button 
        title="Danger Button" 
        variant="danger" 
        onPress={() => console.log('Danger button pressed')} 
      />
      
      <Button 
        title="Success Button" 
        variant="success" 
        onPress={() => console.log('Success button pressed')} 
      />
      
      <Button 
        title="Loading Button" 
        variant="primary" 
        loading={true} 
        onPress={() => {}} 
      />
      
      <Button 
        title="Disabled Button" 
        variant="primary" 
        disabled={true} 
        onPress={() => {}} 
      />
      
      <Button 
        title="Full Width Button" 
        variant="primary" 
        fullWidth={true} 
        onPress={() => console.log('Full width button pressed')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
}); 