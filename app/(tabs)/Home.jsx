import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <TouchableOpacity 
        onPress={() => router.push("Scanner")}>
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

        {/* <View style={styles.textCenter}> */}
          <Text style={styles.text}>Tap to scan medication</Text>
        {/* </View> */}
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
  text:{
    fontFamily: "regular",
    color: "white",
    fontSize: 16,
    paddingTop: 10,
  },

});
