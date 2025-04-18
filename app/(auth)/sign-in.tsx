import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter, Stack } from 'expo-router';
import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Platform, Image, ScrollView, KeyboardAvoidingView, ImageBackground, Alert } from 'react-native';
import React from 'react';
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

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const googleOAuth = useOAuth({ strategy: "oauth_google" });
  const appleOAuth = useOAuth({ strategy: "oauth_apple" });

  const [emailAddress, setEmailAddress] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [appleLoading, setAppleLoading] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded || !signIn) return;
    
    setLoading(true);
    
    try {
      // Start the sign-in process using email code
      await signIn.create({
        strategy: 'email_code',
        identifier: emailAddress,
      });
      
      // Set pendingVerification to true to show the verification screen
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // Handle verification code submission
  const onVerifyPress = async () => {
    if (!isLoaded || !signIn) return;
    
    setLoading(true);
    
    try {
      // Attempt to verify the email code
      const result = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: verificationCode,
      });
      
      console.log("Verification response:", JSON.stringify(result, null, 2));
      
      if (result.status === 'complete' && result.createdSessionId) {
        try {
          await setActive?.({ session: result.createdSessionId });
          // Navigate to auth-loading for smooth transition
          router.replace('/auth-loading');
        } catch (sessionErr) {
          console.error("Session activation error:", JSON.stringify(sessionErr, null, 2));
        }
      } else {
        const status = result.status || 'unknown';
        console.error(`Verification incomplete. Status: ${status}`);
        Alert.alert(
          'Verification Incomplete', 
          'Your sign-in verification could not be completed. Please try again or contact support.'
        );
      }
    } catch (err) {
      console.error("Verification error:", JSON.stringify(err, null, 2));
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
        
        // Navigate to auth-loading for smooth transition
        router.replace('/auth-loading');
      }
    } catch (err) {
      console.error('OAuth error:', err);
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
        
        // Navigate to auth-loading for smooth transition
        router.replace('/auth-loading');
      }
    } catch (err) {
      console.error('OAuth error:', err);
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
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Verify your email</Text>
              
              <Text style={styles.subtitle}>
                For added security, verify your code. Enter the 6 digit code that was sent to:
              </Text>
              <Text style={styles.emailHighlight}>{emailAddress}</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <CodeInput
                value={verificationCode}
                onChange={setVerificationCode}
                autoFocus={true}
                length={6}
              />
              
              <Button 
                title="Verify"
                variant="primary"
                fullWidth={true}
                loading={loading}
                disabled={verificationCode.length !== 6 || loading}
                onPress={onVerifyPress}
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
              Sign in to <Text style={styles.highlightText}>CardSpace</Text>
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
              <Text style={styles.dividerText}>Or you can also sign in with your email </Text>
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
              disabled={!emailAddress || loading || !isLoaded}
              onPress={onSignInPress}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
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
    marginTop: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    gap: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 0,
  },
  logo: {
    width: 150,
    height: 150,
    marginVertical: 16,
  },
  title: {
    ...Fonts.title,
    fontSize: 40,
    marginBottom: 8,
    textAlign: 'center',
    color: Theme.colors.textPrimary,
    lineHeight: 48,
  },
  highlightText: {
    ...Fonts.title,
    fontSize: 40,
    color: Theme.colors.style_06,
  },
  subtitle: {
    ...Fonts.regular,
    fontSize: 16,
    marginBottom: 0,
    textAlign: 'center',
    color: Theme.colors.textSecondary,
  },
  oauthContainer: {
    marginBottom: 0,
    rowGap: 0,
  },
  oauthButton: {
    backgroundColor: '#4285F4',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 0,
    rowGap: 4,
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
    fontSize: 14,
  },
  footerLink: {
    color: Theme.colors.style_06,
    ...Fonts.bold,
    fontSize: 16,
  },
  emailHighlight: {
    ...Fonts.regular,
    fontSize: 16,
    color: Theme.colors.style_06,
    textAlign: 'center',
    marginTop: 4,
  },
}); 