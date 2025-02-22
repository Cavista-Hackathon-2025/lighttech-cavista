import { View, Text, Platform } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import Feather from "@expo/vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";

const ios = Platform.OS === "ios";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#a1a1aa",
        tabBarItemStyle: {
          height: ios ? 70 : 60,
          marginTop: 10,
        },
        headerShown: false,
        tabBarStyle: {
          height: ios ? 75 : 70,
          backgroundColor: "black",
          borderColor: "rgba(161, 161, 170, 0.3)",
        },
        tabBarLabelStyle: {
          fontFamily: "semibold",
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          // title: "Analytics",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Pharamacies"
        options={{
          // title: "Create",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={20} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={20} color={color} />
          ),
        }}
      />

    */}
    </Tabs>
  );
}
