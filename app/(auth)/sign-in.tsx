import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import { InputField } from '@/components/ui/InputField';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const googleOAuth = useOAuth({ strategy: "oauth_google" });
  const appleOAuth = useOAuth({ strategy: "oauth_apple" });

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [oauthLoading, setOAuthLoading] = React.useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = async () => {
    if (!googleOAuth.startOAuthFlow) return;
    
    try {
      setOAuthLoading(true);
      const result = await googleOAuth.startOAuthFlow();
      
      if (result && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      console.error('OAuth error:', err);
    } finally {
      setOAuthLoading(false);
    }
  };

  const onApplePress = async () => {
    if (!appleOAuth.startOAuthFlow) return;
    
    try {
      setOAuthLoading(true);
      const result = await appleOAuth.startOAuthFlow();
      
      if (result && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      console.error('OAuth error:', err);
    } finally {
      setOAuthLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <View style={styles.oauthContainer}>
        <TouchableOpacity 
          style={styles.oauthButton} 
          onPress={onGooglePress}
          disabled={oauthLoading || !isLoaded || !googleOAuth.startOAuthFlow}
        >
          <Text style={styles.oauthButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        
        {Platform.OS === 'ios' && (
          <TouchableOpacity 
            style={[styles.oauthButton, { backgroundColor: '#000' }]} 
            onPress={onApplePress}
            disabled={oauthLoading || !isLoaded || !appleOAuth.startOAuthFlow}
          >
            <Text style={styles.oauthButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <InputField
          label="Email"
          autoCapitalize="none"
          value={emailAddress}
          placeholder="your@email.com"
          onChangeText={setEmailAddress}
          keyboardType="email-address"
        />
        
        <InputField
          label="Password"
          value={password}
          placeholder="Your password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={onSignInPress}
          disabled={!emailAddress || !password || loading || !isLoaded}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Link href="/sign-up" asChild>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
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
  oauthContainer: {
    marginBottom: 20,
  },
  oauthButton: {
    backgroundColor: '#4285F4',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  oauthButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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