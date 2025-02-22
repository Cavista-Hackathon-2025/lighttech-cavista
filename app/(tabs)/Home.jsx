import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MedifyLogo from "../../components/logo";

const Home = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");

        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Camera access is required for scanning. Please enable it in Settings.",
            [
              { text: "OK" },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }
      } catch (error) {
        console.error("Permission request failed:", error);
        setHasPermission(false);
      }
    };

    requestPermission();
  }, []);

  const handleScanPress = () => {
    if (hasPermission) {
      AsyncStorage.removeItem("scannedProducts");

      router.push("/Scanner");
    } else {
      Alert.alert(
        "Permission Required",
        "Camera access is required for scanning. Please enable it in Settings.",
        [
          { text: "OK" },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: 50 }}>
        <MedifyLogo />
      </View>
      <View style={styles.center}>
        <TouchableOpacity onPress={handleScanPress}>
          <LinearGradient
            colors={["#00E676", "#00C853"]}
            style={styles.gradient}
          >
            <Ionicons
              name="scan-outline"
              size={40}
              color="white"
              style={styles.center}
            />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.text}>Tap to scan medication</Text>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  gradient: {
    borderRadius: 100,
    padding: 50,
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "regular",
    color: "white",
    fontSize: 16,
    paddingTop: 15,
  },
});
