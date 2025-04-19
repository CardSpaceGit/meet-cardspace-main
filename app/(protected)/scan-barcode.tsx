import React, { useState } from 'react';
import { 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BarcodeScannerView } from '@/components/BarcodeScannerView';

export default function ScanBarcodeScreen() {
  const router = useRouter();
  const { brandId, brandName } = useLocalSearchParams();
  const [scanning, setScanning] = useState(true);

  const handleBarCodeScanned = (data: string) => {
    setScanning(false);
    
    // Process the scanned barcode data
    console.log(`Bar code data ${data} has been scanned!`);
    
    // Show success message
    Alert.alert(
      "Barcode Scanned",
      `Barcode data: ${data}`,
      [
        { 
          text: "Add Card", 
          onPress: () => {
            // Navigate back to the wallet with the scanned card data
            router.push({
              pathname: "/(protected)/" as any,
              params: { 
                brandId: brandId as string, 
                cardNumber: data,
                addSuccess: "true"
              }
            });
          } 
        },
        {
          text: "Scan Again",
          onPress: () => {
            setScanning(true);
          }
        }
      ]
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <BarcodeScannerView 
        onClose={handleGoBack}
        onBarCodeScanned={handleBarCodeScanned}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  }
}); 