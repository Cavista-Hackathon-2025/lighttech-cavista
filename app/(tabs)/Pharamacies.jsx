import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  useColorScheme,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';

let MapView;
let Marker;

if (Platform.OS === "web") {
  MapView = ({ children, style }) => (
    <View style={[style, { backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center" }]}>
      <Text>Map View</Text>
      <Text style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
        Maps are only available in the mobile app
      </Text>
      {children}
    </View>
  );
  Marker = () => null;
} else {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export default function Pharmacies() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const mapRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Get search suggestions
  const getSearchSuggestions = async (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=pharmacy&location=${region.latitude},${region.longitude}&radius=50000&key=YOUR_GOOGLE_PLACES_API_KEY`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        setSuggestions(data.predictions);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
    }
  };

  // Select a suggestion and get details
  const handleSelectSuggestion = async (suggestion) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${suggestion.place_id}&fields=name,geometry,rating,vicinity&key=YOUR_GOOGLE_PLACES_API_KEY`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const place = data.result;
        const newLocation = {
          id: place.place_id,
          name: place.name,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          rating: place.rating || "N/A",
          vicinity: place.vicinity,
        };

        setSearchQuery(suggestion.description);
        setSuggestions([]);
        setSelectedPharmacy(newLocation);
        setPharmacies([newLocation]);

        const newRegion = {
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  // Initialize user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setUserLocation(location.coords);
          setRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion);
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={isDark ? "#FFFFFF" : "#666666"} 
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, isDark && styles.searchInputDark]}
            placeholder="Search pharmacies"
            placeholderTextColor={isDark ? "#888888" : "#666666"}
            value={searchQuery}
            onChangeText={getSearchSuggestions}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchQuery('');
                setSuggestions([]);
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={isDark ? "#FFFFFF" : "#666666"} />
            </TouchableOpacity>
          )}
        </View>

        {suggestions.length > 0 && (
          <ScrollView 
            style={[styles.suggestionsContainer, isDark && styles.suggestionsContainerDark]}
            keyboardShouldPersistTaps="handled"
          >
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.place_id}
                style={[styles.suggestionItem, isDark && styles.suggestionItemDark]}
                onPress={() => handleSelectSuggestion(suggestion)}
              >
                <Ionicons name="location" size={20} color={isDark ? "#FFFFFF" : "#666666"} />
                <Text style={[styles.suggestionText, isDark && styles.textDark]}>
                  {suggestion.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsTraffic={true}
      >
        {pharmacies.map((pharmacy) => (
          <Marker
            key={pharmacy.id}
            coordinate={{
              latitude: pharmacy.latitude,
              longitude: pharmacy.longitude,
            }}
            title={pharmacy.name}
            description={`Rating: ${pharmacy.rating}`}
            onPress={() => setSelectedPharmacy(pharmacy)}
          >
            <View style={styles.customMarker}>
              <Ionicons name="medical" size={24} color="#00C853" />
            </View>
          </Marker>
        ))}
      </MapView>

      {selectedPharmacy && (
        <View style={[styles.detailsContainer, isDark && styles.detailsDark]}>
          <Text style={[styles.detailsTitle, isDark && styles.textDark]}>
            {selectedPharmacy.name}
          </Text>
          <Text style={[styles.detailsText, isDark && styles.textDark]}>
            Rating: {selectedPharmacy.rating}
          </Text>
          <Text style={[styles.detailsText, isDark && styles.textDark]}>
            Address: {selectedPharmacy.vicinity}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerDark: {
    backgroundColor: "#1A1A1A",
  },
  searchContainer: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchBarDark: {
    backgroundColor: "#2A2A2A",
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000000",
  },
  searchInputDark: {
    color: "#FFFFFF",
  },
  clearButton: {
    padding: 5,
    marginRight: 5,
  },
  suggestionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 10,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionsContainerDark: {
    backgroundColor: "#2A2A2A",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  suggestionItemDark: {
    borderBottomColor: "#333333",
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#000000",
  },
  map: {
    flex: 1,
  },
  customMarker: {
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#00C853",
  },
  detailsContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsDark: {
    backgroundColor: "#2A2A2A",
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  detailsText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 5,
  },
  textDark: {
    color: "#FFFFFF",
  },
});