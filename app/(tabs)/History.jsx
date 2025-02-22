import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const History = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const storedProducts = await AsyncStorage.getItem("scannedProducts");
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    };

    loadProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanned Products</Text>

      {products.length === 0 ? (
        <Text style={styles.emptyText}>No scanned products yet.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.barcode}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name || "Unknown Product"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  emptyText: {
    color: "gray",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  name: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
