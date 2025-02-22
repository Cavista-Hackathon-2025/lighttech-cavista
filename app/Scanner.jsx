import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { router } from 'expo-router';

const ScannerScreen = () => {
    const devices = useCameraDevices();
    const device = devices.back;
    const [barcode, setBarcode] = useState(null);
  
    useEffect(() => {
      const requestPermission = async () => {
        const cameraPermission = await Camera.requestCameraPermission();
        if (cameraPermission !== "granted") {
          Alert.alert("Permission Denied", "Camera access is required for scanning.");
          router.back();
        }
      };
      requestPermission();
    }, []);
  
    const onBarcodeScanned = (code) => {
      if (!barcode) {
        setBarcode(code);
        fetch(`https://world.openfoodfacts.net/api/v2/product/${code}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 1) {
              Alert.alert("Product Found", `Name: ${data.product.product_name}`);
            } else {
              Alert.alert("Not Found", "No product information available.");
            }
            router.back();
          })
          .catch(() => Alert.alert("Error", "Failed to fetch product details."));
      }
    };
  
    if (!device) return <ActivityIndicator size="small" color="black" />;
  
    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        onCodeScanned={(codes) => codes.length > 0 && onBarcodeScanned(codes[0].value)}
        codeScanner={{ format: ["ean-13", "upc-a"] }}
      />
    );
  };
  
  export default ScannerScreen;