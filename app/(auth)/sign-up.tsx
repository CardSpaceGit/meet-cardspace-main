import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import { InputField } from '@/components/ui/InputField';
import { Fonts } from '@/constants/Fonts';
import { GoogleButton } from '@/components/ui/GoogleButton';
import { AppleButton } from '@/components/ui/AppleButton';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const googleOAuth = useOAuth({ strategy: "oauth_google" });
  const appleOAuth = useOAuth({ strategy: "oauth_apple" });

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [oauthLoading, setOAuthLoading] = React.useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    
    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    
    setLoading(true);
    
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
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
        setActive({ session: result.createdSessionId });
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
        setActive({ session: result.createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      console.error('OAuth error:', err);
    } finally {
      setOAuthLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        
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
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={onVerifyPress}
            disabled={!code || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
      <View style={styles.oauthContainer}>
        <GoogleButton 
          onPress={onGooglePress}
          disabled={oauthLoading || !isLoaded || !googleOAuth.startOAuthFlow}
          loading={oauthLoading}
          fullWidth
        />
        
        {Platform.OS === 'ios' && (
          <AppleButton 
            onPress={onApplePress}
            disabled={oauthLoading || !isLoaded || !appleOAuth.startOAuthFlow}
            loading={oauthLoading}
            fullWidth
          />
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
          placeholder="Your secure password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={onSignUpPress}
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
        <Text style={styles.footerText}>Already have an account?</Text>
        <Link href="/sign-in" asChild>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign In</Text>
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
    ...Fonts.title,
    marginBottom: 30,
    textAlign: 'center',
  },
  subtitle: {
    ...Fonts.subtitle,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
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
    ...Fonts.bold,
    fontSize: 16,
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
    ...Fonts.regular,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    marginRight: 5,
    ...Fonts.regular,
  },
  footerLink: {
    color: '#6c47ff',
    ...Fonts.bold,
    fontSize: 16,
  },
}); 