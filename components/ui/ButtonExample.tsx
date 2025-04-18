import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from './Button';
import { Theme } from '@/constants/Theme';

export function ButtonExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CardSpace Buttons</Text>
      
      <Text style={styles.sectionTitle}>Primary Gradient Buttons</Text>
      <Button 
        title="Primary Button" 
        variant="primary" 
        onPress={() => console.log('Primary button pressed')} 
      />
      
      <Button 
        title="Continue" 
        variant="primary" 
        fullWidth={true}
        onPress={() => console.log('Continue pressed')} 
      />
      
      <Button 
        title="Save Changes" 
        variant="primary" 
        size="lg"
        onPress={() => console.log('Save pressed')} 
      />
      
      <Text style={styles.sectionTitle}>Other Button Variants</Text>
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

      <Text style={styles.sectionTitle}>Button States</Text>
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
      
      <Text style={styles.sectionTitle}>Button Sizes</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Button 
            title="Small" 
            variant="primary" 
            size="sm"
            onPress={() => console.log('Small button pressed')} 
          />
        </View>
        <View style={styles.column}>
          <Button 
            title="Medium" 
            variant="primary" 
            size="md"
            onPress={() => console.log('Medium button pressed')} 
          />
        </View>
        <View style={styles.column}>
          <Button 
            title="Large" 
            variant="primary" 
            size="lg"
            onPress={() => console.log('Large button pressed')} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -Theme.spacing.xs,
  },
  column: {
    flex: 1,
    paddingHorizontal: Theme.spacing.xs,
  },
}); 