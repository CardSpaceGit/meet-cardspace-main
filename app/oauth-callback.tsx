import { useAuth } from '@clerk/clerk-expo';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AuthVerifyScreen } from '@/components/AuthVerifyScreen';

export default function OAuthCallbackPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [customMessage, setCustomMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      if (isLoaded) {
        try {
          // Start with identity verification
          await new Promise(resolve => setTimeout(resolve, Platform.OS === 'android' ? 1200 : 1000));
          
          if (!isSignedIn) {
            // Handle authentication failure - show error message
            setCustomMessage("Authentication was unsuccessful. Redirecting...");
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.replace('/(auth)/sign-in');
            return;
          }
          
          // Proceed to step 2 - Account verification
          setCurrentStep(2);
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Proceed to step 3 - Workspace preparation
          setCurrentStep(3);
          
          // Add slightly longer delay for the last step to make it feel complete
          await new Promise(resolve => setTimeout(resolve, 1800));
          
          // Navigate to protected area
          router.replace('/(protected)');
        } catch (error) {
          console.error('Error during OAuth callback navigation:', error);
          setCurrentStep(1); // Reset to first step
          setCustomMessage("We encountered an issue during sign-in. Redirecting...");
          
          // Delay before navigation on error
          await new Promise(resolve => setTimeout(resolve, 1500));
          router.replace('/(auth)/sign-in');
        }
      }
    };
    
    checkAuthAndNavigate();
  }, [isLoaded, isSignedIn, router]);

  return <AuthVerifyScreen currentStep={currentStep} customMessage={customMessage} />;
} 