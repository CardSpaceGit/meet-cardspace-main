import React, { useState, useRef } from 'react';
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
  ImageStyle
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Fonts } from '@/constants/Fonts';
import { Theme } from '@/constants/Theme';
import { Button } from '@/components/ui/Button';

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
}

export default function OnboardingScreen() {
  const { isLoaded } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  const onboardingData = [
    { 
      index: 1, 
      backgroundColor: '#D0F9F6',
      title: 'Save time, save money, save yourself from loyalty card chaos! 🕒💸😅',
      subtitle: 'No more fumbling through your wallet for the right card. 🚀🤑',
      image: require('@/assets/images/onboarding01.png'),
      imageWidth: 500,
      imageHeight: 500
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
      imageWidth: 480,
      imageHeight: 480
    },
  ];
  
  const getCurrentBackgroundColor = () => {
    return onboardingData[step - 1]?.backgroundColor || '#D0F9F6';
  };
  
  const handleContinue = async () => {
    setLoading(true);
    
    try {
      // Navigate to the protected index screen
      router.replace('/');
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

  return (
    <View style={[styles.container, { backgroundColor: getCurrentBackgroundColor() }]}>
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
    marginVertical: 4,
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
}) as StylesProps; 