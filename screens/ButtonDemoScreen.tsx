import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { ButtonExample } from '@/components/ui/ButtonExample';
import { Theme } from '@/constants/Theme';

export default function ButtonDemoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ButtonExample />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: Theme.spacing.lg,
  },
}); 