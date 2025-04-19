import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image, 
  Animated, 
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  Easing
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Theme } from '@/constants/Theme';
import { Fonts } from '@/constants/Fonts';
import { ColorPalette } from '@/constants/Colors';
import { Brand } from '@/app/services/brandService';

// Inspired by: https://github.com/codrops/ModalWindowEffects

interface CardAddModalProps {
  isVisible: boolean;
  onClose: () => void;
  brand: Brand | null;
  onScanPress: () => void;
  onManualPress: () => void;
}

const { width, height } = Dimensions.get('window');

export const CardAddModal: React.FC<CardAddModalProps> = ({
  isVisible,
  onClose,
  brand,
  onScanPress,
  onManualPress
}) => {
  // Create separate animated values for the background and modal
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(1)).current;
  
  const blurIntensity = Platform.OS === 'ios' ? 25 : 20;
  
  useEffect(() => {
    if (isVisible) {
      // Reset values before animation
      backgroundOpacity.setValue(0);
      modalAnimation.setValue(0);
      
      // Animate background first
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }).start();
      
      // Animate modal with a slight delay for a staggered effect
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: true,
        delay: 100,
        damping: 22,
        stiffness: 200,
        mass: 1
      }).start();
      
      // Scale down background content
      Animated.timing(contentScale, {
        toValue: 0.95,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }).start();
    } else {
      // Hide modal first
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad)
      }).start();
      
      // Fade out background with delay
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad)
      }).start();
      
      // Scale up background content back to normal
      Animated.timing(contentScale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad)
      }).start();
    }
  }, [isVisible]);
  
  if (!brand) return null;
  
  return (
    <>
      {/* Scale effect for the app content behind the modal */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFillObject, 
          { transform: [{ scale: contentScale }] },
          styles.behindContentAnimatedView
        ]} 
        pointerEvents="none" 
      />
      
      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={onClose}
      >
        <Animated.View
          style={[
            styles.container,
            { opacity: backgroundOpacity }
          ]}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={blurIntensity}
            tint="dark"
          />
          
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: modalAnimation,
                transform: [
                  {
                    translateY: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, 0]
                    })
                  }
                ]
              }
            ]}
          >
            {/* Handle at top of modal for better UX */}
            <View style={styles.modalHandle} />
            
            <View style={styles.cardImageContainer}>
              <Image 
                source={{ uri: brand.card_url }}
                style={styles.cardImage}
                resizeMode="contain"
                defaultSource={require('@/assets/images/card-placeholder.png')}
              />
            </View>
            
            <Text style={styles.brandName}>{brand.name}</Text>
            <Text style={styles.instructions}>How would you like to add this card?</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={onScanPress}
                activeOpacity={0.8}
              >
                <Image
                  source={require('@/assets/images/card-icon.png')}
                  style={styles.optionImage}
                  resizeMode="contain"
                />
                <Text style={styles.optionTitle}>Scan Barcode</Text>
                <Text style={styles.optionDescription}>
                  Use your phone camera to scan the barcode.
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={onManualPress}
                activeOpacity={0.8}
              >
                <Image
                  source={require('@/assets/images/rightarrow.png')}
                  style={styles.optionImage}
                  resizeMode="contain"
                />
                <Text style={styles.optionTitle}>Manual Input</Text>
                <Text style={styles.optionDescription}>
                  Manually enter the card number.
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  behindContentAnimatedView: {
    zIndex: 5, // Ensures it sits behind the modal but above other content
    backgroundColor: 'transparent',
    transformOrigin: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    alignItems: 'center',
    // Add shadow for better separation from blurred background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
  },
  cardImageContainer: {
    width: width * 0.65,
    height: 200,
    marginBottom: 0,
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  brandName: {
    ...Fonts.bold,
    fontSize: 22,
    color: ColorPalette.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  instructions: {
    ...Fonts.regular,
    fontSize: 16,
    color: ColorPalette.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  optionCard: {
    width: '48%',
    backgroundColor: ColorPalette.style_04,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorPalette.style_03,
  },
  optionImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  optionTitle: {
    ...Fonts.bold,
    fontSize: 16,
    color: ColorPalette.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    ...Fonts.regular,
    fontSize: 14,
    color: ColorPalette.textSecondary,
    textAlign: 'center',
  },
}); 