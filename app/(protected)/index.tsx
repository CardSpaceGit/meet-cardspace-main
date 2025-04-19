import React from 'react';
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
  Alert
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/Theme';
import { Fonts } from '@/constants/Fonts';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { clearOnboardingStatus } from '@/app/utils/authUtils';

const { width, height } = Dimensions.get('window');

export default function ProtectedHome() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

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
        >
          {/* Card placeholder section */}
          <TouchableOpacity style={styles.cardPlaceholder} onPress={handleAddCard}>
            <Image 
              source={require('@/assets/images/card-placeholder.png')} 
              style={styles.cardImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          {/* Welcome text section */}
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>
              Kick things off by giving your favourite rewards program a high-five ✋!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Just hit that plus button below and let the rewards party begin!
            </Text>
          </View>
          
          {/* Debug button for onboarding reset - only in development */}
          <TouchableOpacity 
            style={styles.debugButton} 
            onPress={resetOnboardingStatus}
          >
            <Text style={styles.debugButtonText}>Reset Onboarding (Dev Only)</Text>
          </TouchableOpacity>
          
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
  cardPlaceholder: {
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 32 : 30,
    padding: 20,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
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
  debugButton: {
    backgroundColor: '#ffdddd',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  debugButtonText: {
    ...Fonts.regular,
    color: '#ff0000',
    fontSize: 14,
  },
}); 