import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

const DetailModal = ({ product, visible, onClose }) => {
  if (!product) return null; // Add this safety check

  // Extract the product image URL from the JSON response
  const productImageUrl =
    product.image_url ||
    product.image_front_url ||
    "https://via.placeholder.com/150";

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Product Image */}
          <Image
            source={{ uri: productImageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />

          {/* Product Name */}
          <Text style={styles.header}>
            {product.product_name || "Product Name Not Available"}
          </Text>

          {/* Basic Info */}
          <Text style={styles.details}>Brand: {product.brands || "N/A"}</Text>
          <Text style={styles.details}>
            Quantity: {product.quantity || "N/A"}
          </Text>

          {/* Nutri-Score */}
          {product.nutriscore_2023?.title_element && (
            <View style={styles.nutriScoreContainer}>
              <Text style={styles.details}>
                Nutri-Score:{" "}
                {product.nutriscore_2023.title_element.grade || "N/A"}
              </Text>
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
  },
  nutriScoreContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  nutriScoreImage: {
    width: 50,
    height: 50,
    marginVertical: 10,
  },
  nutrientLevelsContainer: {
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default DetailModal;
