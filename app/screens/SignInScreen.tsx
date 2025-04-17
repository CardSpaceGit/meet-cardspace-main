import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { RedirectIfAuthenticated } from '../utils/authUtils';
import { ENV } from '../config/env';

export default function SignInScreenWrapper() {
  return (
    <RedirectIfAuthenticated>
      <SignInScreen />
    </RedirectIfAuthenticated>
  );
}

function SignInScreen() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      if (!signIn) return;
      
      // For Expo Go, we need to use a different approach for OAuth
      Alert.alert(
        "OAuth Sign In",
        "Please use email sign-in in this development environment. OAuth requires additional configuration."
      );
      setLoading(false);
    } catch (err: any) {
      console.error('OAuth error', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setLoading(true);
      if (!signIn) return;
      
      // For Expo Go, we need to use a different approach for OAuth
      Alert.alert(
        "OAuth Sign In",
        "Please use email sign-in in this development environment. OAuth requires additional configuration."
      );
      setLoading(false);
    } catch (err: any) {
      console.error('OAuth error', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const signInWithEmail = async () => {
    try {
      setLoading(true);
      if (!signIn) return;
      
      // Start the sign-in process with email
      await signIn.create({
        strategy: 'email_code',
        identifier: emailAddress,
      });
      
      // Navigate to the verification screen
      router.push({
        pathname: '/screens/VerifyCodeScreen',
        params: { email: emailAddress, isSignUp: 'false' }
      });
    } catch (err: any) {
      console.error('Email sign in error', err);
      if (err.errors?.[0]?.message.includes("Couldn't find your account")) {
        // Handle "account not found" by suggesting to sign up
        Alert.alert(
          "Account Not Found", 
          "We couldn't find an account with this email. Would you like to create one?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Sign Up",
              onPress: () => router.push('/screens/SignUpScreen')
            }
          ]
        );
      } else {
        Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={emailAddress}
          onChangeText={setEmailAddress}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={signInWithEmail}
          disabled={!emailAddress || loading || !isLoaded}
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
        onPress={signInWithGoogle}
        disabled={loading || !isLoaded}
      >
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.appleButton]} 
        onPress={signInWithApple}
        disabled={loading || !isLoaded}
      >
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/screens/SignUpScreen')}>
          <Text style={styles.footerLink}>Sign Up</Text>
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