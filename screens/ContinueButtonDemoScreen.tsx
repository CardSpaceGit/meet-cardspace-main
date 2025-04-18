import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Theme } from '@/constants/Theme';

export default function ContinueButtonDemoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          variant="primary"
          fullWidth={true}
          size="lg"
          onPress={() => console.log('Continue pressed')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    padding: Theme.spacing.md,
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
}); 