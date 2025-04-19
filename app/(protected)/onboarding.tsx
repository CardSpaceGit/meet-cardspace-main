import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform, 
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Fonts } from '@/constants/Fonts';
import { Theme } from '@/constants/Theme';
import { Button } from '@/components/ui/Button';
import { markOnboardingComplete, hasCompletedOnboarding, STORAGE_KEYS } from '@/app/utils/authUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingScreen } from '@/components/LoadingScreen';

const { width } = Dimensions.get('window');

// Define interface for onboarding screen data
interface OnboardingScreenData {
  index: number;
  backgroundColor: string;
  title: string;
  subtitle: string;
  image: any;
  imageWidth: number;
  imageHeight: number;
}

// Define styles interface
interface StylesProps {
  container: ViewStyle;
  screen: ViewStyle;
  contentContainer: ViewStyle;
  headerContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  imageContainer: ViewStyle;
  onboardingImage: ImageStyle;
  progressContainer: ViewStyle;
  progressIndicator: ViewStyle;
  activeProgress: ViewStyle;
  buttonContainer: ViewStyle;
  leftTouchArea: ViewStyle;
  rightTouchArea: ViewStyle;
  navigationHint: ViewStyle;
  navigationHintText: TextStyle;
  loadingOverlay: ViewStyle;
}

export default function OnboardingScreen() {
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const flatListRef = useRef<FlatList>(null);
  
  // Check if user has already completed onboarding at component mount
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user?.id) {
        try {
          setError(null);
          const completed = await hasCompletedOnboarding(user.id);
          if (completed) {
            console.log('User has already completed onboarding, redirecting to home');
            router.replace('/');
            return;
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          setError('Failed to check onboarding status. Please try again.');
        }
      } else {
        // If no user ID is available, retry a few times before showing an error
        if (retryCount < 3) {
          console.log(`No user ID available yet, retrying... (${retryCount + 1}/3)`);
          setRetryCount(retryCount + 1);
          // Wait a moment and try again
          setTimeout(() => {
            setCheckingOnboarding(true);
          }, 1000);
          return;
        } else {
          setError('Unable to retrieve user information. Please try signing out and back in.');
        }
      }
      setCheckingOnboarding(false);
    };
    
    if (checkingOnboarding) {
      checkOnboardingStatus();
    }
  }, [user?.id, retryCount, checkingOnboarding, router]);
  
  // Hide the hint after a few seconds
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 3000); // Hide after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showHint]);
  
  // Show loading while checking onboarding status
  if (checkingOnboarding) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' }}>
        <ActivityIndicator size="large" color={Theme.colors.style_07} />
        <Text style={{ marginTop: 16, ...Fonts.regular, color: Theme.colors.textSecondary }}>
          Checking onboarding status...
        </Text>
      </View>
    );
  }
  
  // Show error screen if there's an error
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8', padding: 20 }}>
        <Text style={{ ...Fonts.regular, color: 'red', marginBottom: 20, textAlign: 'center' }}>
          {error}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: Theme.colors.style_07,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
          }}
          onPress={() => {
            setRetryCount(0);
            setCheckingOnboarding(true);
          }}
        >
          <Text style={{ ...Fonts.regular, color: 'white' }}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: 16,
            paddingVertical: 8,
          }}
          onPress={() => router.replace('/')}
        >
          <Text style={{ ...Fonts.regular, color: Theme.colors.style_07 }}>Skip & Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const onboardingData = [
    { 
      index: 1, 
      backgroundColor: '#D0F9F6',
      title: 'Save time, save money, save yourself from loyalty card chaos! 🕒💸😅',
      subtitle: 'No more fumbling through your wallet for the right card. 🚀🤑',
      image: require('@/assets/images/onboarding01.png'),
      imageWidth: 480,
      imageHeight: 540,
    },
    { 
      index: 2, 
      backgroundColor: '#FFEBF0',
      title: '"Ditch the loyalty card Cha-Cha - Shopping is not a dance floor! 💃🕺🏼"',
      subtitle: 'Focus on what matters – enjoying your shopping experience. 💃🕺',
      image: require('@/assets/images/onboarding02.png'),
      imageWidth: 480,
      imageHeight: 520
    },
    { 
      index: 3, 
      backgroundColor: '#F0F3FC',
      title: 'Slow down, speedy shopper! 🐌🛍️',
      subtitle: 'Access all your loyalty rewards in one app and make shopping a breeze. 🌬️🛒',
      image: require('@/assets/images/onboarding03.png'),
      imageWidth: 520,
      imageHeight: 500
    },
  ];
  
  const getCurrentBackgroundColor = () => {
    return onboardingData[step - 1]?.backgroundColor || '#D0F9F6';
  };
  
  const handleContinue = async () => {
    setLoading(true);
    
    try {
      // Set navigating state to show full-screen loading indicator
      setNavigating(true);
      
      // Get the user ID to ensure it's properly saved
      const userId = user?.id;
      console.log('Completing onboarding for user:', userId);
      
      if (!userId) {
        console.warn('No user ID available when completing onboarding. Using global flag only.');
        Alert.alert(
          'Warning',
          'Unable to save your onboarding status to your account. You may see this screen again next time you sign in.',
          [{ text: 'Continue Anyway', style: 'default' }]
        );
      }
      
      // Mark onboarding as completed with user ID
      await markOnboardingComplete(userId);
      
      try {
        // Double check that it was saved correctly
        if (userId) {
          const userSpecificKey = `${STORAGE_KEYS.USER_ONBOARDING_PREFIX}${userId}`;
          const userValue = await AsyncStorage.getItem(userSpecificKey);
          console.log(`Verified user key ${userSpecificKey} = ${userValue}`);
          
          if (userValue !== 'true') {
            throw new Error('Failed to save user-specific onboarding status');
          }
        }
        
        const globalValue = await AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
        console.log(`Verified global key ${STORAGE_KEYS.HAS_COMPLETED_ONBOARDING} = ${globalValue}`);
        
        if (globalValue !== 'true') {
          throw new Error('Failed to save global onboarding status');
        }
      } catch (verifyErr) {
        console.error('Error verifying onboarding status:', verifyErr);
        // Try one more time to save
        await markOnboardingComplete(userId);
      }
      
      // Add a small delay to ensure the loading indicator is visible
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Navigate to the protected index screen
      console.log('Onboarding completed successfully, navigating to main app');
      router.replace('/(protected)');
    } catch (err) {
      console.error('Onboarding error:', err);
      setNavigating(false);
      Alert.alert(
        'Error',
        'Failed to complete onboarding. Do you want to try again?',
        [
          {
            text: 'Try Again',
            onPress: () => handleContinue(),
            style: 'default'
          },
          {
            text: 'Continue Anyway',
            onPress: () => router.replace('/(protected)'),
            style: 'destructive'
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkip = async () => {
    try {
      // Show loading indicator
      setNavigating(true);
      
      // Get the user ID to ensure it's properly saved
      const userId = user?.id;
      console.log('Skipping onboarding for user:', userId);
      
      if (!userId) {
        console.warn('No user ID available when skipping onboarding. Using global flag only.');
      }
      
      // Mark onboarding as completed even if user skips, with user ID
      await markOnboardingComplete(userId);
      
      // Add a small delay to ensure the loading indicator is visible
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Navigate to home without completing onboarding
      console.log('Onboarding skipped, navigating to main app');
      router.replace('/(protected)');
    } catch (err) {
      console.error('Onboarding skip error:', err);
      // Still try to navigate even if there was an error saving the onboarding status
      router.replace('/(protected)');
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    const currentIndex = Math.round(contentOffset.x / width) + 1;
    
    if (currentIndex !== step) {
      setStep(currentIndex);
    }
  };
  
  // Navigate to next screen
  const handleNextScreen = () => {
    if (step < onboardingData.length) {
      const nextStep = step + 1;
      setStep(nextStep);
      flatListRef.current?.scrollToIndex({ index: nextStep - 1, animated: true });
    } else if (step === onboardingData.length) {
      // If on last screen, call the continue function
      handleContinue();
    }
  };
  
  // Navigate to previous screen
  const handlePreviousScreen = () => {
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      flatListRef.current?.scrollToIndex({ index: prevStep - 1, animated: true });
    }
  };

  const renderOnboardingScreen = ({ item }: { item: OnboardingScreenData }) => {
    const { index, backgroundColor, title, subtitle, image, imageWidth, imageHeight } = item;
    
    return (
      <View style={[styles.screen, { backgroundColor }]}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          
          <View style={styles.imageContainer}>
            <Image
              source={image}
              style={[styles.onboardingImage, { width: imageWidth, height: imageHeight }]}
              resizeMode="contain"
            />
          </View>
          
          {index === 3 && (
            <View style={styles.buttonContainer}>
              <Button 
                title="Continue"
                variant="primary"
                fullWidth={true}
                loading={loading}
                onPress={handleContinue}
                disabled={loading || !isLoaded}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  // If navigating, show a full screen loading overlay
  if (navigating) {
    return <LoadingScreen message="Getting your app ready..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: getCurrentBackgroundColor() }]}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressIndicator, step >= 1 ? styles.activeProgress : {}]} />
        <View style={[styles.progressIndicator, step >= 2 ? styles.activeProgress : {}]} />
        <View style={[styles.progressIndicator, step >= 3 ? styles.activeProgress : {}]} />
      </View>
      
      {/* Navigation hint that fades away */}
      {showHint && (
        <View style={styles.navigationHint}>
          <Text style={styles.navigationHintText}>
            Swipe to navigate
          </Text>
        </View>
      )}
      
      {/* Touch area for previous screen */}
      <TouchableOpacity
        style={styles.leftTouchArea}
        activeOpacity={0.6}
        onPress={handlePreviousScreen}
        disabled={step === 1} // Disable on first screen
      />
      
      {/* Touch area for next screen */}
      <TouchableOpacity
        style={styles.rightTouchArea}
        activeOpacity={0.6}
        onPress={handleNextScreen}
      />
      
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
        scrollEnabled={true} // Keep swipe functionality
      />
    </View>
  );
}

// Define StyleSheet with correct typing
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
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginTop: 2,
    alignItems: 'center',
  },
  title: {
    ...Fonts.title,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
    color: Theme.colors.textPrimary,
    lineHeight: 34,
    paddingHorizontal: 4,
  },
  subtitle: {
    ...Fonts.regular,
    fontSize: 16,
    textAlign: 'center',
    color: Theme.colors.textSecondary,
    paddingHorizontal: 4,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  onboardingImage: {
    // Base styles - will be overridden by inline styles
    width: width * 0.8,
    height: width * 0.8,
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
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  leftTouchArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 60,
    height: '100%',
    zIndex: 5, // Above the FlatList but below progress indicators
  },
  rightTouchArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 60,
    height: '100%',
    zIndex: 5, // Above the FlatList but below progress indicators
  },
  navigationHint: {
    position: 'absolute',
    top: 80, // Below the progress indicators
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 6,
  },
  navigationHintText: {
    color: 'white',
    ...Fonts.regular,
    fontSize: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
}) as unknown as StylesProps; 