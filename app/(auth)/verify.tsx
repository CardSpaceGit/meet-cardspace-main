import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { InputField } from '@/components/ui/InputField';
import { Fonts } from '@/constants/Fonts';
import { Button } from '@/components/ui/Button';
import { Theme } from '@/constants/Theme';

export default function VerifyScreen() {
  const { signIn, setActive: signInSetActive } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded, setActive: signUpSetActive } = useSignUp();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Check which flow we're in (sign-up or sign-in)
  // This will be based on which hook is active
  const isSignUp = !!signUp?.status;
  
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
        
        console.log("Sign-up verification response:", JSON.stringify(completeSignUp, null, 2));
        
        if (completeSignUp.status === 'complete' && completeSignUp.createdSessionId) {
          try {
            // Use optional chaining and await the setActive call
            await signUpSetActive?.({ session: completeSignUp.createdSessionId });
            router.replace('/');
          } catch (sessionErr) {
            console.error("Session activation error:", JSON.stringify(sessionErr, null, 2));
            Alert.alert('Error', 'Unable to activate your session. Please try again.');
          }
        } else {
          const status = completeSignUp.status || 'unknown';
          console.error(`Verification incomplete. Status: ${status}`);
          Alert.alert(
            'Verification Incomplete', 
            'Your account verification could not be completed. Please try again or contact support.'
          );
        }
      } else {
        // Verify the code for sign-in
        if (!signIn) return;
        
        const completeSignIn = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code,
        });
        
        console.log("Sign-in verification response:", JSON.stringify(completeSignIn, null, 2));
        
        if (completeSignIn.status === 'complete' && completeSignIn.createdSessionId) {
          try {
            // Use optional chaining and await the setActive call
            await signInSetActive?.({ session: completeSignIn.createdSessionId });
            router.replace('/');
          } catch (sessionErr) {
            console.error("Session activation error:", JSON.stringify(sessionErr, null, 2));
            Alert.alert('Error', 'Unable to activate your session. Please try again.');
          }
        } else {
          const status = completeSignIn.status || 'unknown';
          console.error(`Verification incomplete. Status: ${status}`);
          Alert.alert(
            'Verification Incomplete', 
            'Your sign-in verification could not be completed. Please try again or contact support.'
          );
        }
      }
    } catch (err: any) {
      console.error('Verification error', JSON.stringify(err, null, 2));
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
        const email = signIn.identifier;
        if (!email) {
          Alert.alert('Error', 'Please go back and enter your email again.');
          return;
        }
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
        We've sent a verification code to your email.
      </Text>
      
      <View style={styles.inputContainer}>
        <InputField
          value={code}
          placeholder="Enter verification code"
          onChangeText={setCode}
          keyboardType="number-pad"
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
        <Text style={styles.backButtonText}>Back</Text>
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