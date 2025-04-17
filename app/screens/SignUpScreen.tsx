import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { RedirectIfAuthenticated } from '../utils/authUtils';
import { ENV } from '../config/env';

export default function SignUpScreenWrapper() {
  return (
    <RedirectIfAuthenticated>
      <SignUpScreen />
    </RedirectIfAuthenticated>
  );
}

function SignUpScreen() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();
  
  const [emailAddress, setEmailAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const signUpWithGoogle = async () => {
    try {
      setLoading(true);
      if (!signUp) return;
      
      // For Expo Go, we need to use a different approach for OAuth
      Alert.alert(
        "OAuth Sign Up",
        "Please use email sign-up in this development environment. OAuth requires additional configuration."
      );
      setLoading(false);
    } catch (err: any) {
      console.error('OAuth error', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const signUpWithApple = async () => {
    try {
      setLoading(true);
      if (!signUp) return;
      
      // For Expo Go, we need to use a different approach for OAuth
      Alert.alert(
        "OAuth Sign Up",
        "Please use email sign-up in this development environment. OAuth requires additional configuration."
      );
      setLoading(false);
    } catch (err: any) {
      console.error('OAuth error', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const signUpWithEmail = async () => {
    try {
      setLoading(true);
      if (!signUp) return;
      
      // Create signup params object (only include lastName if it's provided)
      const signUpParams: any = {
        emailAddress,
        firstName,
      };
      
      // Only add lastName if it's not empty
      if (lastName.trim() !== '') {
        signUpParams.lastName = lastName;
      }
      
      // Start the sign-up process with email
      await signUp.create(signUpParams);
      
      // Prepare verification (this will send the verification code)
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code"
      });
      
      // Navigate to the verification screen
      router.push({
        pathname: '/screens/VerifyCodeScreen',
        params: { email: emailAddress, isSignUp: 'true' }
      });
    } catch (err: any) {
      console.error('Email sign up error', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={emailAddress}
          onChangeText={setEmailAddress}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name (optional)"
          value={lastName}
          onChangeText={setLastName}
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={signUpWithEmail}
          disabled={!emailAddress || !firstName || loading || !isLoaded}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue with Email</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>
      
      <TouchableOpacity 
        style={[styles.button, styles.googleButton]} 
        onPress={signUpWithGoogle}
        disabled={loading || !isLoaded}
      >
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.appleButton]} 
        onPress={signUpWithApple}
        disabled={loading || !isLoaded}
      >
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/screens/SignInScreen')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6c47ff',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    marginRight: 5,
  },
  footerLink: {
    color: '#6c47ff',
    fontWeight: '600',
  },
}); 