import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Theme } from '@/constants/Theme';
import { Fonts } from '@/constants/Fonts';
import { createPulseAnimation, createProgressAnimation } from '@/app/utils/animations';
import { ColorPalette } from '@/constants/Colors';

interface StepIndicatorProps {
  current: boolean;
  completed: boolean;
  label: string;
  index: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ current, completed, label, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(current ? 0.7 : 1)).current;
  
  useEffect(() => {
    if (current) {
      createPulseAnimation(scaleAnim, 0.9, 1.1, 1600).start();
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animations if not current
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    
    return () => {
      // Cleanup animations
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [current, scaleAnim, opacityAnim]);
  
  return (
    <View style={styles.stepContainer}>
      <Animated.View 
        style={[
          styles.stepIndicator,
          completed ? styles.stepCompleted : current ? styles.stepCurrent : styles.stepFuture,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
        ]}
      >
        {completed ? (
          <Text style={styles.stepText}>✓</Text>
        ) : (
          <Text style={styles.stepText}>{index}</Text>
        )}
      </Animated.View>
      <Text style={[
        styles.stepLabel, 
        current ? styles.stepLabelCurrent : completed ? styles.stepLabelCompleted : styles.stepLabelFuture
      ]}>
        {label}
      </Text>
    </View>
  );
};

// Animated background gradient dots
const BackgroundDots: React.FC = () => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 0.35,
      duration: 1200,
      useNativeDriver: true,
    }).start();
    
    return () => {
      opacityAnim.stopAnimation();
    };
  }, [opacityAnim]);
  
  return (
    <Animated.View style={[styles.dotsContainer, { opacity: opacityAnim }]}>
      {Array.from({ length: 12 }).map((_, i) => (
        <View key={i} style={[
          styles.dot, 
          { 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            opacity: 0.1 + Math.random() * 0.3,
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
          }
        ]} />
      ))}
    </Animated.View>
  );
};

// Brand logo or icon placeholder
const BrandLogo: React.FC = () => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
    
    return () => {
      opacityAnim.stopAnimation();
      scaleAnim.stopAnimation();
    };
  }, [opacityAnim, scaleAnim]);
  
  return (
    <Animated.View style={[
      styles.logoContainer,
      { 
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }]
      }
    ]}>
      <Text style={styles.logoText}>CardSpace</Text>
    </Animated.View>
  );
};

interface AuthVerifyScreenProps {
  currentStep: number;
  customMessage?: string;
}

export const AuthVerifyScreen: React.FC<AuthVerifyScreenProps> = ({ 
  currentStep = 1,
  customMessage 
}) => {
  const steps = [
    { id: 1, label: 'Verifying identity' },
    { id: 2, label: 'Checking account' },
    { id: 3, label: 'Preparing your workspace' }
  ];
  
  // Animated values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.95)).current;
  const cardOpacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Initial card entrance animation
    Animated.parallel([
      Animated.timing(cardScaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Progress animation based on current step
    const progress = (currentStep - 1) / (steps.length - 1);
    createProgressAnimation(progressAnim, progress, 800).start();
    
    return () => {
      // Cleanup animations
      progressAnim.stopAnimation();
      cardScaleAnim.stopAnimation();
      cardOpacityAnim.stopAnimation();
    };
  }, [currentStep, progressAnim, cardScaleAnim, cardOpacityAnim, steps.length]);
  
  // Messages based on step
  const messages = {
    1: "We're verifying your identity to ensure a secure experience",
    2: "Checking your account details and permissions",
    3: "Setting up your personalized workspace"
  };
  
  const displayMessage = customMessage || messages[currentStep as keyof typeof messages] || "Processing your request";
  
  return (
    <View style={styles.container}>
      <BackgroundDots />
      <BrandLogo />
      
      <Animated.View 
        style={[
          styles.card,
          { 
            transform: [{ scale: cardScaleAnim }],
            opacity: cardOpacityAnim
          }
        ]}
      >
        <Text style={styles.title}>Secure Sign-In</Text>
        
        <Text style={styles.message}>{displayMessage}</Text>
        
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })}
            ]} 
          />
        </View>
        
        <View style={styles.stepsContainer}>
          {steps.map((step) => (
            <StepIndicator
              key={step.id}
              index={step.id}
              label={step.label}
              current={currentStep === step.id}
              completed={currentStep > step.id}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorPalette.white,
    padding: 20,
  },
  dotsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: ColorPalette.style_07,
  },
  logoContainer: {
    position: 'absolute',
    top: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    ...Fonts.bold,
    fontSize: 28,
    color: ColorPalette.textPrimary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    ...Fonts.bold,
    fontSize: 24,
    color: ColorPalette.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    ...Fonts.regular,
    fontSize: 16,
    color: ColorPalette.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: ColorPalette.style_07,
    borderRadius: 3,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepContainer: {
    alignItems: 'center',
    width: '30%',
  },
  stepIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCompleted: {
    backgroundColor: ColorPalette.style_07,
  },
  stepCurrent: {
    backgroundColor: ColorPalette.style_07,
    shadowColor: ColorPalette.style_07,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  stepFuture: {
    backgroundColor: '#e0e0e0',
  },
  stepText: {
    ...Fonts.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  stepLabel: {
    ...Fonts.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  stepLabelCompleted: {
    color: ColorPalette.textPrimary,
  },
  stepLabelCurrent: {
    color: ColorPalette.textPrimary,
    ...Fonts.bold,
  },
  stepLabelFuture: {
    color: ColorPalette.textSecondary,
  }
}); 