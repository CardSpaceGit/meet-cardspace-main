import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Platform, 
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { InputField } from '@/components/ui/InputField';
import { Fonts } from '@/constants/Fonts';
import { Theme } from '@/constants/Theme';

export default function OnboardingScreen() {
  const { signOut, isLoaded } = useAuth();
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const handleContinue = async () => {
    setLoading(true);
    
    try {
      // For step 1, just move to step 2
      if (step === 1) {
        setStep(2);
      } 
      // For step 2, complete onboarding and navigate to home
      else if (step === 2) {
        // Here you would typically update the user's profile
        // with the collected information

        // Navigate to the home screen (the index in protected folder)
        router.replace('/');
      }
    } catch (err) {
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkip = () => {
    // Navigate to home without completing onboarding
    router.replace('/');
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/bg.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
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
              {step === 1 ? 'Welcome to ' : 'Complete your '}
              <Text style={styles.highlightText}>CardSpace</Text>
            </Text>
            <Text style={styles.subtitle}>
              {step === 1 
                ? 'Let\'s personalize your experience' 
                : 'Just a few more details to get started'}
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressIndicator, styles.activeProgress]} />
            <View style={[styles.progressIndicator, step === 2 ? styles.activeProgress : {}]} />
          </View>
          
          <View style={styles.formContainer}>
            {step === 1 ? (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>What's your name?</Text>
                <InputField
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                />
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>What's your phone number?</Text>
                <InputField
                  label="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleContinue}
              disabled={
                (step === 1 && !fullName) || 
                (step === 2 && !phoneNumber) || 
                loading || 
                !isLoaded
              }
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {step === 2 ? 'Complete Setup' : 'Continue'}
                </Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
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
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginVertical: 16,
  },
  title: {
    ...Fonts.title,
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
    color: Theme.colors.textPrimary,
    lineHeight: 32,
  },
  highlightText: {
    ...Fonts.title,
    fontSize: 28,
    color: Theme.colors.style_06,
  },
  subtitle: {
    ...Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    color: Theme.colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  progressIndicator: {
    width: 32,
    height: 4,
    backgroundColor: Theme.colors.style_03,
    borderRadius: 2,
  },
  activeProgress: {
    backgroundColor: Theme.colors.style_07,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    ...Fonts.bold,
    fontSize: 16,
    marginBottom: 8,
    color: Theme.colors.textPrimary,
  },
  button: {
    backgroundColor: Theme.colors.style_07,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    ...Fonts.regular,
    fontSize: 14,
  },
  skipButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    color: Theme.colors.textSecondary,
    ...Fonts.regular,
    fontSize: 14,
  },
}); 