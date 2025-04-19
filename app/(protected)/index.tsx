import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Platform,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Alert,
  Animated,
  Easing,
  RefreshControl
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/Theme';
import { Fonts } from '@/constants/Fonts';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { clearOnboardingStatus } from '@/app/utils/authUtils';
import { ColorPalette } from '@/constants/Colors';

// Inspired by: https://github.com/codrops/StackMotionHoverEffects

const { width, height } = Dimensions.get('window');

export default function ProtectedHome() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Animation values for stacked card effect
  const cardScale = useRef(new Animated.Value(0.5)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  
  // Values for colored stack cards behind the main card
  const stackCard1Opacity = useRef(new Animated.Value(0)).current;
  const stackCard1Scale = useRef(new Animated.Value(0.3)).current;
  const stackCard1Rotate = useRef(new Animated.Value(-15)).current;
  
  const stackCard2Opacity = useRef(new Animated.Value(0)).current;
  const stackCard2Scale = useRef(new Animated.Value(0.3)).current;
  const stackCard2Rotate = useRef(new Animated.Value(10)).current;
  
  const stackCard3Opacity = useRef(new Animated.Value(0)).current;
  const stackCard3Scale = useRef(new Animated.Value(0.3)).current;
  const stackCard3Rotate = useRef(new Animated.Value(-5)).current;
  
  const stackCard4Opacity = useRef(new Animated.Value(0)).current;
  const stackCard4Scale = useRef(new Animated.Value(0.3)).current;
  const stackCard4Rotate = useRef(new Animated.Value(8)).current;

  // Animation function to reuse for both initial render and refresh
  const playCardAnimation = () => {
    // Reset animation values to starting positions
    cardScale.setValue(0.5);
    cardOpacity.setValue(0);
    stackCard1Opacity.setValue(0);
    stackCard1Scale.setValue(0.3);
    stackCard1Rotate.setValue(-15);
    stackCard2Opacity.setValue(0);
    stackCard2Scale.setValue(0.3);
    stackCard2Rotate.setValue(10);
    stackCard3Opacity.setValue(0);
    stackCard3Scale.setValue(0.3);
    stackCard3Rotate.setValue(-5);
    stackCard4Opacity.setValue(0);
    stackCard4Scale.setValue(0.3);
    stackCard4Rotate.setValue(8);
    
    // Start the animation sequence with faster durations
    Animated.sequence([
      // First show background stack cards in sequence with slight delays
      Animated.parallel([
        Animated.timing(stackCard1Opacity, {
          toValue: 0.8,
          duration: 200, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        }),
        Animated.timing(stackCard1Scale, {
          toValue: 0.85,
          duration: 250, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        }),
        Animated.timing(stackCard1Rotate, {
          toValue: -6,
          duration: 250, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        })
      ]),
      
      Animated.parallel([
        Animated.timing(stackCard2Opacity, {
          toValue: 0.9,
          duration: 200, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        }),
        Animated.timing(stackCard2Scale, {
          toValue: 0.9,
          duration: 250, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        }),
        Animated.timing(stackCard2Rotate, {
          toValue: 4,
          duration: 250, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        })
      ]),
      
      Animated.parallel([
        Animated.timing(stackCard3Opacity, {
          toValue: 1,
          duration: 200, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        }),
        Animated.timing(stackCard3Scale, {
          toValue: 0.95,
          duration: 250, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        }),
        Animated.timing(stackCard3Rotate, {
          toValue: -2,
          duration: 250, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        })
      ]),
      
      Animated.parallel([
        Animated.timing(stackCard4Opacity, {
          toValue: 1,
          duration: 200, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        }),
        Animated.timing(stackCard4Scale, {
          toValue: 0.97,
          duration: 250, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        }),
        Animated.timing(stackCard4Rotate, {
          toValue: 2,
          duration: 250, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        })
      ]),
      
      // Finally animate in the main card
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 200, // Faster animation
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 9,
          tension: 100 // Increased tension for faster spring
        })
      ])
    ]).start();
  };

  // Handle refresh action
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Play animation immediately, with shorter timeout
    playCardAnimation();
    
    // Hide refreshing indicator after animation completes
    setTimeout(() => {
      setRefreshing(false);
    }, 800); // Shorter delay matching faster animation
  }, []);

  useEffect(() => {
    // Play animation on initial render
    playCardAnimation();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    // The redirect will happen automatically due to the protected layout
  };

  const handleAddCard = () => {
    // Navigate to add brand menu screen
    router.push('/(protected)/add-brand-menu');
  };
  
  // Dev function to reset onboarding status for testing
  const resetOnboardingStatus = async () => {
    Alert.alert(
      'Reset Onboarding',
      'Are you sure you want to reset onboarding status? This is for testing only.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearOnboardingStatus(user?.id);
              Alert.alert('Success', 'Onboarding status has been reset. Sign out and sign back in to see the onboarding screens again.');
              console.log('Onboarding status reset for user ID:', user?.id);
            } catch (error) {
              console.error('Error resetting onboarding status:', error);
              Alert.alert('Error', 'Failed to reset onboarding status.');
            }
          }
        }
      ]
    );
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/bg.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <Header title="Welcome" />
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
          alwaysBounceVertical={true}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Theme.colors.style_07}
              colors={[Theme.colors.style_07]}
              title="Pull to refresh..."
              titleColor={Theme.colors.textSecondary}
            />
          }
        >
          {/* Card placeholder section with animated stack effect */}
          <View style={styles.cardStack}>
            {/* Background stack cards */}
            <Animated.View style={[
              styles.stackCard,
              styles.stackCard1,
              {
                opacity: stackCard1Opacity,
                transform: [
                  { scale: stackCard1Scale },
                  { rotate: stackCard1Rotate.interpolate({
                      inputRange: [-15, 0],
                      outputRange: ['-15deg', '0deg']
                    })
                  }
                ]
              }
            ]} />
            
            <Animated.View style={[
              styles.stackCard,
              styles.stackCard2,
              {
                opacity: stackCard2Opacity,
                transform: [
                  { scale: stackCard2Scale },
                  { rotate: stackCard2Rotate.interpolate({
                      inputRange: [0, 10],
                      outputRange: ['0deg', '10deg']
                    })
                  }
                ]
              }
            ]} />
            
            <Animated.View style={[
              styles.stackCard,
              styles.stackCard3,
              {
                opacity: stackCard3Opacity,
                transform: [
                  { scale: stackCard3Scale },
                  { rotate: stackCard3Rotate.interpolate({
                      inputRange: [-5, 0],
                      outputRange: ['-5deg', '0deg']
                    })
                  }
                ]
              }
            ]} />
            
            <Animated.View style={[
              styles.stackCard,
              styles.stackCard4,
              {
                opacity: stackCard4Opacity,
                transform: [
                  { scale: stackCard4Scale },
                  { rotate: stackCard4Rotate.interpolate({
                      inputRange: [0, 8],
                      outputRange: ['0deg', '8deg']
                    })
                  }
                ]
              }
            ]} />
            
            {/* Main visible card */}
            <TouchableOpacity 
              style={styles.cardPlaceholder} 
              onPress={handleAddCard}
              activeOpacity={0.9}
            >
              <Animated.View style={{
                opacity: cardOpacity,
                transform: [{ scale: cardScale }],
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Image 
                  source={require('@/assets/images/card-placeholder.png')} 
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
          
          {/* Welcome text section */}
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>
              Kick things off by giving your favourite rewards program a high-five ✋!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Just hit that plus button below and let the rewards party begin!
            </Text>
          </View>
          
          {/* Add extra padding at the bottom for scrolling past the tab bar */}
          <View style={styles.bottomPadding} />
        </ScrollView>
        
        {/* Floating Add Button */}
        <TouchableOpacity 
          style={styles.floatingAddButton} 
          onPress={handleAddCard}
          activeOpacity={0.8}
        >
          <Image 
            source={require('@/assets/images/add.png')} 
            style={styles.floatingAddIcon}
            resizeMode="cover"
          />
        </TouchableOpacity>
        
        {/* Arrow pointing to add button */}
        <View style={styles.arrowContainer}>
          <Image 
            source={require('@/assets/images/arrow-down.png')} 
            style={styles.arrowImage}
            resizeMode="contain"
          />
        </View>
        
        {/* Use the new BottomNav component */}
        <BottomNav />
      </SafeAreaView>
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
    paddingTop: Platform.OS === 'ios' ? 0 : 40, // No paddingTop on iOS when using SafeAreaView
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Add some space at the bottom
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : 0, // Different padding based on platform
  },
  cardStack: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 32 : 30,
    height: 240, // Increased height to accommodate the stack with 4 cards
  },
  stackCard: {
    position: 'absolute',
    width: 290,
    height: 190,
    borderRadius: 20,
  },
  stackCard1: {
    backgroundColor: ColorPalette.style_06, // Pink/purple
    top: 20,
  },
  stackCard2: {
    backgroundColor: ColorPalette.style_07, // Medium purple
    top: 15,
  },
  stackCard3: {
    backgroundColor: ColorPalette.style_10, // Salmon/coral
    top: 10,
  },
  stackCard4: {
    backgroundColor: ColorPalette.style_10[2], // Blue (#6698F8)
    top: 5,
  },
  cardPlaceholder: {
    position: 'absolute',
    borderRadius: 20,
    width: 314,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  cardImage: {
    width: 314,
    height: 221,
    marginBottom: 2,
  },
  cardPlaceholderText: {
    ...Fonts.regular,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  welcomeTextContainer: {
    paddingHorizontal: 16,
    marginVertical: Platform.OS === 'ios' ? 32 : 24,
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.style_03,
    borderRadius: 24,
    backgroundColor: Theme.colors.style_04,
  },
  welcomeTitle: {
    ...Fonts.title,
    fontSize: 16,
    color: Theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    ...Fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  floatingAddButton: {
    position: 'absolute',
    right: 24,
    bottom: Platform.OS === 'ios' ? 88 : 88, // Position above bottom nav
    width: 68,
    height: 68,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // Ensure button stays on top
    overflow: 'hidden', // Ensure the image stays within bounds
  },
  floatingAddIcon: {
    width: 68,
    height: 68,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 160 : 160, // Position above the add button
    right: 80, // Position to the left of the add button
    zIndex: 998, // Below the button but above other content
  },
  arrowImage: {
    width: 100,
    height: 100,
    transform: [{ rotate: '-16deg' }], // Angle to point at the button
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 90 : 80, // Extra padding for iOS to account for home indicator
  },
}); 