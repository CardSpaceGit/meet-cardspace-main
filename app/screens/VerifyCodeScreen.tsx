import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { InputField } from '@/components/ui/InputField';
import { Fonts } from '@/constants/Fonts';
import { Button } from '@/components/ui/Button';
import { Theme } from '@/constants/Theme';

export default function VerifyCodeScreen() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const isSignUp = params.isSignUp === 'true';
  const email = params.email as string;
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const verifyCode = async () => {
    try {
      setLoading(true);
      
      if (isSignUp) {
        // Verify the code for sign-up
        if (!signUp) return;
        
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code,
        });
        
        if (completeSignUp.status === 'complete') {
          // Navigate to the main app after successful verification
          router.replace('/(tabs)');
        }
      } else {
        // Verify the code for sign-in
        if (!signIn) return;
        
        const completeSignIn = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code,
        });
        
        if (completeSignIn.status === 'complete') {
          // Navigate to the main app
          router.replace('/(tabs)');
        }
      }
    } catch (err: any) {
      console.error('Verification error', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      setLoading(true);
      
      if (isSignUp) {
        // Resend the verification code for sign-up
        if (!signUp) return;
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code"
        });
        Alert.alert('Success', 'Verification code has been sent again.');
      } else {
        // Resend the verification code for sign-in
        if (!signIn) return;
        await signIn.create({
          strategy: 'email_code',
          identifier: email,
        });
        Alert.alert('Success', 'Verification code has been sent again.');
      }
    } catch (err: any) {
      console.error('Resend code error', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      
      <Text style={styles.subtitle}>
        We've sent a verification code to:
      </Text>
      <Text style={styles.emailText}>{email}</Text>
      
      <View style={styles.inputContainer}>
        <InputField
          label="Verification Code"
          placeholder="Enter your verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoCapitalize="none"
        />
        
        <Button 
          title="Verify"
          variant="primary"
          fullWidth={true}
          loading={loading}
          onPress={verifyCode}
          disabled={!code || loading}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.resendButton} 
        onPress={resendCode}
        disabled={loading}
      >
        <Text style={styles.resendButtonText}>Didn't receive the code? Resend</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.backButtonText}>Back to {isSignUp ? 'Sign Up' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    ...Fonts.title,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    ...Fonts.regular,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  emailText: {
    ...Fonts.bold,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6c47ff',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    ...Fonts.bold,
    fontSize: 16,
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendButtonText: {
    color: '#6c47ff',
    ...Fonts.regular,
    fontSize: 16,
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    ...Fonts.regular,
    fontSize: 16,
  },
}); 