/**
 * WORKAROUND for "Cannot find native module 'ExpoBarCodeScanner'" error
 * 
 * This is a temporary solution that replaces the actual barcode scanner with a mock UI.
 * 
 * To fix this issue properly:
 * 1. Ensure expo-barcode-scanner is installed: `npx expo install expo-barcode-scanner`
 * 2. For iOS: Run `npx pod-install` to link the native module
 * 3. For Android: Make sure the app has camera permissions in AndroidManifest.xml
 * 4. Rebuild the app: `npx expo run:ios` or `npx expo run:android`
 * 
 * Once fixed, you can restore the original BarcodeScannerView implementation.
 */

import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { ColorPalette } from '@/constants/Colors';

interface BarcodeScannerViewProps {
  onClose: () => void;
  onBarCodeScanned: (data: string) => void;
}

export const BarcodeScannerView: React.FC<BarcodeScannerViewProps> = ({ 
  onClose,
  onBarCodeScanned
}) => {
  const handleMockScan = () => {
    // Simulate scanning a mock barcode
    onBarCodeScanned("1234567890123");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Mock camera view with placeholder */}
      <View style={styles.mockCameraView}>
        <View style={styles.scanFrame}>
          <Text style={styles.placeholderText}>Camera placeholder</Text>
          <Text style={styles.placeholderSubtext}>
            Barcode scanner functionality is currently unavailable
          </Text>
          
          <TouchableOpacity 
            style={styles.mockScanButton}
            onPress={handleMockScan}
          >
            <Text style={styles.mockScanButtonText}>Simulate Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
        >
          <Ionicons name="close-circle" size={36} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Scan Card Barcode</Text>
      </View>
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Native barcode scanner module not available
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mockCameraView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    ...Fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  placeholderSubtext: {
    ...Fonts.regular,
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
  },
  mockScanButton: {
    backgroundColor: ColorPalette.style_07,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  mockScanButtonText: {
    ...Fonts.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  headerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    padding: 8,
  },
  headerText: {
    ...Fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionsText: {
    ...Fonts.regular,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 8,
  }
}); 