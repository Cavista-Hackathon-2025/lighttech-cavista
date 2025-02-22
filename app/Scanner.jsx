import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Camera, CameraView } from "expo-camera";
import { router } from "expo-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import DetailModal from "../components/detailModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScannerScreen = () => {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera access is required.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    };
    getPermissions();
  }, []);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

  const searchProductWithGemini = async (barcode) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Find product details using this barcode: ${barcode}. Provide the name, manufacturer, image url, and product descriptions.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const productInfo = response.text();

      Alert.alert("Product Info", productInfo);
    } catch (error) {
      console.error("Gemini AI Error:", error);
      Alert.alert("Error", "Failed to fetch product details.");
    } finally {
      setLoading(false);
      setScanned(false);
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);

    try {
      console.log("Scanned barcode:", data);

      // Check if barcode already exists in AsyncStorage
      const storedProducts = await AsyncStorage.getItem("scannedProducts");
      const parsedProducts = storedProducts ? JSON.parse(storedProducts) : [];

      // Check if product was already scanned
      if (parsedProducts.some((product) => product.barcode === data)) {
        console.log("Product already exists in history.");
        setLoading(false);
        setScanned(false);
        setIsVisible(false);
        router.push("/History");
        return;
      }

      // Fetch from OpenFoodFacts API
      const response = await fetch(
        `https://world.openfoodfacts.net/api/v2/product/${data}`
      );
      const result = await response.json();

      if (result.status === 1) {
        // Store the complete product data
        setProductData(result.product); // Store the complete product object
        setIsVisible(true); // Show modal immediately after setting data

        // Save simplified version to storage
        const productInfo = {
          name: result.product.product_name || "Unknown Product",
          barcode: data,
          image:
            result.product.image_url ||
            result.product.image_front_url ||
            "https://via.placeholder.com/150",
        };

        const updatedProducts = [...parsedProducts, productInfo];
        await AsyncStorage.setItem(
          "scannedProducts",
          JSON.stringify(updatedProducts)
        );
      } else {
        // If not found, use Gemini AI
        await searchProductWithGemini(data);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      Alert.alert("Error", "Failed to fetch product details.");
    } finally {
      setLoading(false);
      setScanned(false);
    }
  };

  // Add close modal handler
  const handleCloseModal = () => {
    setIsVisible(false);
    router.replace("/Home");
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  if (hasPermission === false) {
    return null;
  }

  return (
    <View style={styles.container}>
      {!isVisible && (
        <CameraView
          style={StyleSheet.absoluteFill}
          type="back"
          barcodeScannerSettings={{
            barCodeTypes: ["ean13", "ean8", "upc"],
          }}
          onBarcodeScanned={handleBarCodeScanned} // ✅ Correct function
        />
      )}

      {/* ✅ Overlay to make button pressable */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/Home")}
        >
          <Ionicons name="chevron-back" size={25} color="white" />
        </TouchableOpacity>

        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={styles.scanLine} />
          </View>
          <Text style={styles.instructions}>
            Position barcode within the frame
          </Text>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <LottieView
              source={require("../assets/animations/loader.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.loadingText}>Fetching product details...</Text>
          </View>
        )}
      </View>

      <DetailModal
        product={productData}
        visible={isVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default ScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    top: 40, // Adjust for better placement
    left: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // ✅ Ensure it's above the camera
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#00C853",
    backgroundColor: "transparent",
    borderRadius: 20,
    overflow: "hidden",
  },
  scanLine: {
    height: 2,
    width: "100%",
    backgroundColor: "#00C853",
    position: "absolute",
    top: "50%",
  },
  instructions: {
    color: "white",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  lottie: {
    width: 150,
    height: 150,
  },
});
