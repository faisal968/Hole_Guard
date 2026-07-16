import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { scale, verticalScale } from "react-native-size-matters";
import { getToken } from "@/services/AsyncStorageService";
import { router } from "expo-router";
import { useGetLoggedUserQuery } from "@/services/UserAuthApi";
import { LinearGradient } from "expo-linear-gradient";

const DEFAULT_PROFILE_IMAGE = require("..//..//assets/images/Owner_Profile.jpg");

const Account = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken?.access || null);
    };
    fetchToken();
  }, []);

  const { data } = useGetLoggedUserQuery(token, { skip: !token });

  const [profileImage, setProfileImage] = useState<any>(DEFAULT_PROFILE_IMAGE);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem("profileImage");
      if (storedImage) {
        setProfileImage({ uri: storedImage });
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setProfileImage({ uri: selectedUri });
      await AsyncStorage.setItem("profileImage", selectedUri);
      Alert.alert("Success", "Profile picture updated successfully!");
    }
  };

  const handleBack = () => {
    router.push("/(main)/(tab)");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("profileImage");
          router.push("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#01406D", "#01406D"]} style={styles.headerGradient}>
          <View style={styles.headerTopContainer}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={scale(24)} color="white" />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Profile</Text>
              <Text style={styles.headerSubtitle}>Manage your account settings</Text>
            </View>

            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileTitle}>Personal Information</Text>
          </View>

          <View style={styles.profileContent}>
            
            <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
              <Image source={profileImage} style={styles.profileImage} />
              <View style={styles.editIconContainer}>
                <MaterialIcons name="camera-alt" size={scale(20)} color="white" />
              </View>
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <MaterialIcons name="person" size={scale(20)} color="#01406D" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{data?.name || "Loading..."}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <MaterialIcons name="email" size={scale(20)} color="#01406D" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoValue}>{data?.email || "Loading..."}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <MaterialIcons name="verified-user" size={scale(20)} color="#01406D" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Account Status</Text>
                  <Text style={[styles.infoValue, styles.statusActive]}>Active</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => router.push("/(main)/ChangePassword")}
            style={styles.actionButton}
          >
            <LinearGradient colors={["#01B4BA", "#01B4BA"]} style={styles.actionButtonGradient}>
              <MaterialIcons name="lock" size={scale(20)} color="white" />
              <Text style={styles.actionButtonText}>Change Password</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={styles.actionButton}>
            <LinearGradient colors={["#FF7A0F", "#FF7A0F"]} style={styles.actionButtonGradient}>
              <MaterialIcons name="logout" size={scale(20)} color="white" />
              <Text style={styles.actionButtonText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FEFE" },
  headerContainer: { marginBottom: verticalScale(20) },
  headerGradient: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(15),
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTopContainer: { flexDirection: "row", alignItems: "center" },
  backButton: { padding: scale(8) },
  headerTextContainer: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: scale(28), color: "#fff", fontWeight: "bold" },
  headerSubtitle: { fontSize: scale(14), color: "#01B4BA" },
  placeholder: { width: scale(40) },
  content: { flex: 1, paddingHorizontal: scale(20) },
  profileCard: { backgroundColor: "#fff", borderRadius: 20 },
  profileHeader: { padding: scale(16) },
  profileTitle: { fontSize: scale(18), fontWeight: "bold", textAlign: "center" },
  profileContent: { alignItems: "center", padding: scale(20) },
  imageWrapper: { marginBottom: verticalScale(20) },
  profileImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    borderWidth: 4,
    borderColor: "#01B4BA",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#FF7A0F",
    borderRadius: 20,
    padding: 6,
  },
  infoContainer: { width: "100%" },
  infoItem: { flexDirection: "row", paddingVertical: 12 },
  infoTextContainer: { marginLeft: 12 },
  infoLabel: { fontSize: 12, color: "#01B4BA" },
  infoValue: { fontSize: 16, fontWeight: "600" },
  statusActive: { color: "#4CAF50" },
  actionsContainer: { marginTop: 20 },
  actionButton: { borderRadius: 15, overflow: "hidden", marginBottom: 12 },
  actionButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 10,
  },
  actionButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default Account;
