import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const [font] = useFonts({
    regular: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Scanner" options={{ headerShown: false }} />
    </Stack>
  );
}
