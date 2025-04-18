import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform, 
  Image,
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { InputField } from '@/components/ui/InputField';
import { Fonts } from '@/constants/Fonts';
import { Theme } from '@/constants/Theme';
import { Button } from '@/components/ui/Button';

const { width } = Dimensions.get('window');

// Define interface for onboarding screen data
interface OnboardingScreenData {
  index: number;
  backgroundColor: string;
}

export default function OnboardingScreen() {
  const { isLoaded } = useAuth();
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const flatListRef = useRef<FlatList>(null);
  
  const handleContinue = async () => {
    setLoading(true);
    
    try {
      if (step === 1) {
        setStep(2);
        flatListRef.current?.scrollToIndex({ index: 1, animated: true });
      } 
      else if (step === 2) {
        setStep(3);
        flatListRef.current?.scrollToIndex({ index: 2, animated: true });
      }
      else if (step === 3) {
        // Here you would typically update the user's profile
        // Navigate to the home screen
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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    const currentIndex = Math.round(contentOffset.x / width) + 1;
    
    if (currentIndex !== step) {
      setStep(currentIndex);
    }
  };

  const renderOnboardingScreen = ({ item }: { item: OnboardingScreenData }) => {
    const { index, backgroundColor } = item;
    
    return (
      <View style={[styles.screen, { backgroundColor }]}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/cardspace_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.formContainer}>
            {index === 1 && (
              <View style={styles.inputContainer}>
                <InputField
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                />
              </View>
            )}
            
            {index === 2 && (
              <View style={styles.inputContainer}>
                <InputField
                  label="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>
            )}
            
            {index === 3 && (
              <View style={styles.inputContainer}>
                <InputField
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}
            
            <Button 
              title={step === 3 ? 'Complete Setup' : 'Continue'}
              variant="primary"
              fullWidth={true}
              loading={loading}
              onPress={handleContinue}
              disabled={
                (step === 1 && !fullName) || 
                (step === 2 && !phoneNumber) ||
                (step === 3 && !email) ||
                loading || 
                !isLoaded
              }
            />
            
            <Button 
              title="Skip for now"
              variant="outline"
              fullWidth={true}
              onPress={handleSkip}
            />
          </View>
        </View>
      </View>
    );
  };

  const onboardingData = [
    { index: 1, backgroundColor: '#D0F9F6' },
    { index: 2, backgroundColor: '#FFEBF0' },
    { index: 3, backgroundColor: '#F0F3FC' },
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.progressContainer}>
        <View style={[styles.progressIndicator, step >= 1 ? styles.activeProgress : {}]} />
        <View style={[styles.progressIndicator, step >= 2 ? styles.activeProgress : {}]} />
        <View style={[styles.progressIndicator, step >= 3 ? styles.activeProgress : {}]} />
      </View>
      
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderOnboardingScreen}
        keyExtractor={(item) => item.index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    width,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginVertical: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
    gap: 8,
    zIndex: 10,
  },
  progressIndicator: {
    width: 32,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
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
}); 