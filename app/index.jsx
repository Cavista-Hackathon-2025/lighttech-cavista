import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function index() {
  setTimeout(() => {
    router.push("Home");
  }, 2000);
  return (
    <View>
      <ActivityIndicator size="small" color="black" />
    </View>
  );
}
