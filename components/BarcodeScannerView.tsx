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

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission',
          'We need camera permission to scan barcodes',
          [{ text: 'OK', onPress: onClose }]
        );
      }
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
      onBarCodeScanned(data);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.placeholderText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.placeholderText}>No access to camera</Text>
          <TouchableOpacity 
            style={styles.mockScanButton}
            onPress={onClose}
          >
            <Text style={styles.mockScanButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.scannerContainer}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'qr',
            'code128',
            'code39',
            'ean13',
            'ean8',
            'upc_e'
          ],
        }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
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
          Position the barcode within the frame to scan
        </Text>
      </View>
      
      {scanned && (
        <TouchableOpacity 
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanAgainButtonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  scannerContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  placeholderText: {
    ...Fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
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
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: ColorPalette.style_07,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  scanAgainButtonText: {
    ...Fonts.bold,
    fontSize: 16,
    color: '#FFFFFF',
  }
}); 