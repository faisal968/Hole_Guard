import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

interface HomeScreenProps {
  setGlobalLoading: (loading: boolean) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setGlobalLoading }) => {
  const handleUpload = () => {
    router.push("/(main)/PatholeDetection");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bkgd.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        
        
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#01406D', '#01406D']}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Home</Text>
            <Text style={styles.headerSubtitle}>Welcome to HoleGuard Dashboard</Text>
          </LinearGradient>
        </View>

        
        <View style={styles.mainContent}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>HoleGuard</Text>
            <Text style={styles.subtitle}>
              Advanced pothole detection and analysis system using AI to improve
              road safety and maintenance.
            </Text>
          </View>

          
          <View style={styles.uploadContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
              <Ionicons
                name="cloud-upload-outline"
                size={22}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.uploadText}>Upload Image & Video</Text>
            </TouchableOpacity>
          </View>

          
          <View style={styles.stepsContainer}>
            <View style={styles.stepBox}>
              <Ionicons
                name="search"
                size={24}
                color="#01406D"
                style={styles.stepIcon}
              />
              <Text style={styles.stepTitle}>Detect</Text>
              <Text style={styles.stepText}>
                Upload road images or videos to identify potholes with high
                accuracy.
              </Text>
            </View>
            <View style={styles.stepBox}>
              <Ionicons
                name="analytics"
                size={24}
                color="#01406D"
                style={styles.stepIcon}
              />
              <Text style={styles.stepTitle}>Analyze</Text>
              <Text style={styles.stepText}>
                Get detailed information about size, depth, and severity of
                detected potholes.
              </Text>
            </View>
            <View style={styles.stepBox}>
              <Ionicons
                name="document-text"
                size={24}
                color="#01406D"
                style={styles.stepIcon}
              />
              <Text style={styles.stepTitle}>Report</Text>
              <Text style={styles.stepText}>
                Save and access detection history with suggestions for
                maintenance.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#01406D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#01B4BA",
    fontWeight: "500",
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#01B4BA",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  uploadContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF7A0F",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#FF7A0F",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  uploadText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  stepBox: {
    flex: 1,
    borderColor: "#01B4BA",
    borderWidth: 1,
    padding: 15,
    height: 180,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#01406D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepIcon: {
    marginBottom: 10,
  },
  stepTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    color: "#01406D",
  },
  stepText: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    lineHeight: 16,
  },
});

export default HomeScreen;