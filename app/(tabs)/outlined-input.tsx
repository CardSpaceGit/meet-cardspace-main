import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { OutlinedInputExample } from '@/components/OutlinedInputExample';
import { InputField } from '@/components/ui/InputField';
import { NameInput } from '@/components/NameInput';
import { Fonts } from '@/constants/Fonts';

export default function OutlinedInputScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorExample, setErrorExample] = useState('');

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Outlined Inputs',
        headerTitleStyle: Fonts.title,
      }} />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Outlined Input Fields</Text>
        
        <OutlinedInputExample />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Name Input</Text>
          <NameInput />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Input</Text>
          <InputField
            label="Email Address"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Password Input</Text>
          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Error State Example</Text>
          <InputField
            label="Username"
            placeholder="Enter username"
            value={errorExample}
            onChangeText={setErrorExample}
            error={errorExample.length < 5 && errorExample.length > 0 ? "Username must be at least 5 characters" : ""}
          />
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    ...Fonts.title,
    textAlign: 'center',
    marginVertical: 20,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    ...Fonts.subtitle,
    marginBottom: 15,
  },
}); 