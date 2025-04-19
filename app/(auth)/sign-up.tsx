import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Image, ScrollView, KeyboardAvoidingView, ImageBackground, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter, Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import { InputField } from '@/components/ui/InputField';
import { Fonts } from '@/constants/Fonts';
import { GoogleButton } from '@/components/ui/GoogleButton';
import { AppleButton } from '@/components/ui/AppleButton';
import { Theme } from '@/constants/Theme';
import { CodeInput } from '@/components/ui/CodeInput';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/LoadingScreen';
import { handlePostAuthNavigation } from '@/app/utils/authUtils';
import { useAuth } from '@clerk/clerk-expo';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();

  const googleOAuth = useOAuth({ strategy: "oauth_google" });
  const appleOAuth = useOAuth({ strategy: "oauth_apple" });

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [appleLoading, setAppleLoading] = React.useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || !signUp) return;
    
    setLoading(true);
    
    try {
      // Start sign-up process using email only
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
      Alert.alert(
        'Sign Up Error',
        'There was a problem creating your account. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded || !signUp) return;
    
    setLoading(true);
    
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      
      console.log("Verification response:", JSON.stringify(signUpAttempt, null, 2));

      // If verification was completed, set the session to active
      // and redirect the user to onboarding
      if (signUpAttempt.status === 'complete' && signUpAttempt.createdSessionId) {
        try {
          await setActive?.({ session: signUpAttempt.createdSessionId });
          console.log("Email sign-up completed, created session");
          
          // Navigate directly to onboarding without intermediate loading screen
          router.replace('/(protected)/onboarding');
        } catch (sessionErr) {
          console.error("Session activation error:", JSON.stringify(sessionErr, null, 2));
          router.replace('/(protected)/onboarding');
        }
      } else if (signUpAttempt.status === 'missing_requirements') {
        // Special handling for missing_requirements status
        console.error(`Verification missing requirements: ${signUpAttempt.status}`);
        
        // Show loading screen before navigation
        setLoading(true);
        
        // For missing requirements, go directly to onboarding
        router.replace('/(protected)/onboarding');
        
        Alert.alert(
          'Additional Information Needed',
          'Your account was created, but we need more information to complete your profile. Please complete the onboarding process.',
          [{ text: 'Continue', style: 'default' }]
        );
      } else {
        const status = signUpAttempt.status || 'unknown';
        console.error(`Verification incomplete. Status: ${status}`);
        Alert.alert(
          'Verification Incomplete', 
          'Your account verification could not be completed. Please try again or contact support.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error("Verification error:", JSON.stringify(err, null, 2));
      Alert.alert(
        'Verification Error',
        'There was a problem verifying your account. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = async () => {
    if (!googleOAuth?.startOAuthFlow) return;
    
    try {
      setGoogleLoading(true);
      const result = await googleOAuth.startOAuthFlow();
      
      if (result && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        console.log("Google OAuth sign-up completed, created session");
        
        // For sign-up flow, navigate directly to onboarding
        // This avoids the intermediate loading screen
        router.replace('/(protected)/onboarding');
      }
    } catch (err) {
      console.error('OAuth error:', err);
      Alert.alert(
        'Sign Up Error',
        'There was a problem signing up with Google. Please try again or use email sign-up.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const onApplePress = async () => {
    if (!appleOAuth?.startOAuthFlow) return;
    
    try {
      setAppleLoading(true);
      const result = await appleOAuth.startOAuthFlow();
      
      if (result && result.createdSessionId) {
        await setActive?.({ session: result.createdSessionId });
        console.log("Apple OAuth sign-up completed, created session");
        
        // For sign-up flow, navigate directly to onboarding
        // This avoids the intermediate loading screen
        router.replace('/(protected)/onboarding');
      }
    } catch (err) {
      console.error('OAuth error:', err);
      Alert.alert(
        'Sign Up Error',
        'There was a problem signing up with Apple. Please try again or use email sign-up.'
      );
    } finally {
      setAppleLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <ImageBackground 
        source={require('@/assets/images/bg.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Stack.Screen options={{ headerShown: false }} />
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            <View style={styles.titleContainer}>
              <Image 
                source={require('@/assets/images/security.png')}
                style={styles.securityImage}
                resizeMode="contain"
              />
              <Text style={styles.title}>Let's verify your email</Text>
              
              <Text style={styles.subtitle}>
                For added security, enter the 6 digit code that was sent to:
              </Text>
              <Text style={styles.emailText}>{emailAddress}</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <CodeInput
                value={code}
                onChange={setCode}
                autoFocus={true}
                length={6}
              />
              
              <Button 
                title="Verify"
                variant="primary"
                fullWidth={true}
                loading={loading}
                onPress={onVerifyPress}
                disabled={code.length !== 6 || loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={require('@/assets/images/bg.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          <View style={styles.titleContainer}>
            <Image 
              source={require('@/assets/images/cardspace_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>
              Sign up for <Text style={styles.highlightText}>CardSpace</Text>
            </Text>
            <Text style={styles.subtitle}>Imagine all your rewards programs together in one place.</Text>
          </View>
          
          <View style={styles.oauthContainer}>
            <GoogleButton 
              onPress={onGooglePress}
              disabled={googleLoading || appleLoading || !isLoaded || !googleOAuth.startOAuthFlow}
              loading={googleLoading}
              fullWidth
            />
            
            {Platform.OS === 'ios' && (
              <AppleButton 
                onPress={onApplePress}
                disabled={appleLoading || googleLoading || !isLoaded || !appleOAuth.startOAuthFlow}
                loading={appleLoading}
                fullWidth
              />
            )}
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or you can also sign up with your email </Text>
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
            
            <Button 
              title="Continue"
              variant="primary"
              fullWidth={true}
              loading={loading}
              onPress={onSignUpPress}
              disabled={!emailAddress || loading || !isLoaded}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/sign-in" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    marginTop: 0,
    flexGrow: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    gap: 0,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginVertical: 16,
  },
  title: {
    ...Fonts.title,
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
    color: Theme.colors.textPrimary,
    lineHeight: 32,
  },
  securityImage: {
    width: 220,
    height: 220,
    marginBottom: 16,
  },
  highlightText: {
    ...Fonts.title,
    fontSize: 28,
    color: Theme.colors.style_06,
  },
  subtitle: {
    ...Fonts.regular,
    fontSize: 16,
    marginBottom: 0,
    textAlign: 'center',
    color: Theme.colors.textSecondary,
  },
  emailText: {
    ...Fonts.regular,
    fontSize: 16,
    color: Theme.colors.style_06,
  },
  oauthContainer: {
    marginBottom: 0,
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
    color: Theme.colors.textPrimary,
    ...Fonts.regular,
  },
  inputContainer: {
    marginBottom: 16,
    rowGap: 4,
  },
  button: {
    backgroundColor: '#6c47ff',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    ...Fonts.bold,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 64,
  },
  footerText: {
    color: Theme.colors.textPrimary,
    marginRight: 5,
    ...Fonts.regular,
    fontSize: 16,
  },
  footerLink: {
    color: Theme.colors.style_06,
    ...Fonts.bold,
    fontSize: 16,
  },
}); 