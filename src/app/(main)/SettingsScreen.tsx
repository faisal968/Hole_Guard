import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { router } from "expo-router";

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const notif = await AsyncStorage.getItem("notificationsEnabled");
      if (notif !== null) setNotificationsEnabled(notif === "true");
    };
    loadSettings();
  }, []);


  const toggleNotifications = async () => {
    const newVal = !notificationsEnabled;
    if (newVal) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Enable notifications in your device settings.");
        return;
      }
    }
    setNotificationsEnabled(newVal);
    await AsyncStorage.setItem("notificationsEnabled", String(newVal));

    if (newVal) {
      Alert.alert("Notifications Enabled", "You will receive important alerts about detection results and updates.");
    } else {
      Alert.alert("Notifications Disabled", "You will no longer receive alerts.");
    }
  };


  const handleClearHistory = () => {
    Alert.alert("Clear History", "This will delete all your detection history. A backup will be created automatically.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          const existingHistory = await AsyncStorage.getItem("detectionHistory");
          if (existingHistory) {
            
            await AsyncStorage.setItem("backupDetectionHistory", existingHistory);
          }
          await AsyncStorage.removeItem("detectionHistory");
          Alert.alert("Success", "Detection history cleared and backup saved!");
        },
      },
    ]);
  };

  
  const handleBackupRestore = async () => {
    const backup = await AsyncStorage.getItem("backupDetectionHistory");
    if (!backup) {
      Alert.alert("No Backup Found", "You have no backup detection history to restore.");
      return;
    }

    Alert.alert("Restore Backup", "This will replace your current detection history with the backup.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Restore",
        onPress: async () => {
          await AsyncStorage.setItem("detectionHistory", backup);
          Alert.alert("Success", "Your detection history has been restored successfully.");
        },
      },
    ]);
  };

  
  const handleClearCache = () => {
    Alert.alert("Clear Cache", "This will clear all app data including settings and preferences.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          Alert.alert("Success", "Cache cleared successfully!");
        },
      },
    ]);
  };

  
  const handleFeedback = () => {
    Linking.openURL("mailto:holeguard.support@gmail.com?subject=HoleGuard Feedback&body=Hello HoleGuard Team,\n\n");
  };

  
  const handleContactSupport = () => {
    Linking.openURL("mailto:holeguard.support@gmail.com?subject=HoleGuard Support Request");
  };

  
  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      `HoleGuard Privacy Policy\n\n` +
      `1. Data Collection\n` +
      `• We collect images and videos you upload for pothole detection\n` +
      `• Detection results and analysis data are stored locally on your device\n` +
      `• No personal data is shared with third parties\n\n` +
      `2. Data Usage\n` +
      `• Images/videos are processed locally when possible\n` +
      `• Cloud processing only occurs when necessary for advanced analysis\n` +
      `• Detection history is stored securely on your device\n\n` +
      `3. Data Protection\n` +
      `• Your data is encrypted during transmission\n` +
      `• Local storage uses device security features\n` +
      `• You can clear your data anytime from settings\n\n` +
      `4. Your Rights\n` +
      `• Access and delete your detection history\n` +
      `• Opt-out of data collection features\n` +
      `• Request data export\n\n` +
      `For questions: holeguard.support@gmail.com`,
      [{ text: "OK", style: "default" }]
    );
  };

  
  const handleTerms = () => {
    Alert.alert(
      "Terms & Conditions",
      `HoleGuard Terms of Service\n\n` +
      `1. Acceptance of Terms\n` +
      `By using HoleGuard, you agree to these terms and our privacy policy.\n\n` +
      `2. Service Description\n` +
      `HoleGuard provides AI-powered pothole detection using uploaded images and videos.\n\n` +
      `3. User Responsibilities\n` +
      `• Only upload content you have rights to\n` +
      `• Ensure safe usage while capturing road images\n` +
      `• Maintain device security\n\n` +
      `4. Limitations\n` +
      `• Detection accuracy may vary\n` +
      `• Service depends on device capabilities\n` +
      `• Internet required for some features\n\n` +
      `5. Contact\n` +
      `Email: holeguard.support@gmail.com`,
      [{ text: "OK", style: "default" }]
    );
  };

  
  const handleAbout = () => {
    Alert.alert(
      "About HoleGuard",
      "HoleGuard v1.0.0\n\n" +
      "Advanced AI-powered pothole detection system using YOLOv8 technology.\n\n" +
      "Developed by Faisal Qayyum and Team\n" +
      "Final Year Project 2025\n\n" +
      "Department of Computer Science\n" +
      "University of Mianwali",
      [{ text: "OK", style: "default" }]
    );
  };

  
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout? All unsaved data will be lost.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scale(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerIcon}>
          <Ionicons name="settings-outline" size={scale(20)} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF7A0F' }]}>
                <Ionicons name="notifications-outline" size={scale(20)} color="#FFFFFF" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.label}>Push Notifications</Text>
                <Text style={styles.subLabel}>Get alerts about detection results</Text>
              </View>
              <Switch 
                value={notificationsEnabled} 
                onValueChange={toggleNotifications}
                trackColor={{ false: '#E0E0E0', true: '#01B4BA' }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          
          <TouchableOpacity style={styles.settingCard} onPress={handleClearHistory}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#01406D' }]}>
                <MaterialIcons name="history" size={scale(20)} color="#FFFFFF" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.label}>Clear Detection History</Text>
                <Text style={styles.subLabel}>Delete all your past detections</Text>
              </View>
              <Ionicons name="chevron-forward" size={scale(20)} color="#01B4BA" />
            </View>
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.settingCard} onPress={handleBackupRestore}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#01B4BA' }]}>
                <Ionicons name="cloud-upload-outline" size={scale(20)} color="#FFFFFF" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.label}>Backup & Restore</Text>
                <Text style={styles.subLabel}>Restore your detection history</Text>
              </View>
              <Ionicons name="chevron-forward" size={scale(20)} color="#01B4BA" />
            </View>
          </TouchableOpacity>

        
          <TouchableOpacity style={styles.settingCard} onPress={handleClearCache}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF6B6B' }]}>
                <Ionicons name="trash-outline" size={scale(20)} color="#FFFFFF" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.label}>Clear Cache</Text>
                <Text style={styles.subLabel}>Free up storage space</Text>
              </View>
              <Ionicons name="chevron-forward" size={scale(20)} color="#01B4BA" />
            </View>
          </TouchableOpacity>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          
          <TouchableOpacity style={styles.settingCard} onPress={handleFeedback}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="chatbubble-ellipses-outline" size={scale(20)} color="#FFFFFF" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.label}>Send Feedback</Text>
                <Text style={styles.subLabel}>Share your experience with us</Text>
              </View>
              <Ionicons name="chevron-forward" size={scale(20)} color="#01B4BA" />
            </View>
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.settingCard} onPress={handleContactSupport}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
                <Ionicons name="call-outline" size={scale(20)} color="#FFFFFF" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.label}>Contact Support</Text>
                <Text style={styles.subLabel}>Get help from our team</Text>
              </View>
              <Ionicons name="chevron-forward" size={scale(20)} color="#01B4BA" />
            </View>
          </TouchableOpacity>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          
          <TouchableOpacity style={styles.settingCard} onPress={handlePrivacyPolicy}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#9C27B0' }]}>
                <Ionicons name="shield-checkmark-outline" size={scale(20)} color="#FFFFFF" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.label}>Privacy Policy</Text>
                <Text style={styles.subLabel}>How we handle your data</Text>
              </View>
              <Ionicons name="chevron-forward" size={scale(20)} color="#01B4BA" />
            </View>
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.settingCard} onPress={handleTerms}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF9800' }]}>
                <Ionicons name="document-text-outline" size={scale(20)} color="#FFFFFF" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.label}>Terms & Conditions</Text>
                <Text style={styles.subLabel}>App usage terms</Text>
              </View>
              <Ionicons name="chevron-forward" size={scale(20)} color="#01B4BA" />
            </View>
          </TouchableOpacity>

      
          <TouchableOpacity style={styles.settingCard} onPress={handleAbout}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#607D8B' }]}>
                <Ionicons name="information-circle-outline" size={scale(20)} color="#FFFFFF" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.label}>About HoleGuard</Text>
                <Text style={styles.subLabel}>App version and information</Text>
              </View>
              <Ionicons name="chevron-forward" size={scale(20)} color="#01B4BA" />
            </View>
          </TouchableOpacity>
        </View>

    
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={scale(20)} color="#FFFFFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>HoleGuard v1.0.0</Text>
          <Text style={styles.versionSubtext}>Advanced Road Safety Solution</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#F5FEFE" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#01406D",
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    elevation: 8,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backButton: { 
    padding: scale(8) 
  },
  headerTitle: { 
    color: "#FFFFFF", 
    fontSize: scale(20), 
    fontWeight: "bold",
    textAlign: 'center',
    flex: 1,
  },
  headerIcon: {
    padding: scale(8),
    opacity: 0.8,
  },
  container: { 
    flex: 1, 
    padding: moderateScale(16) 
  },
  section: {
    marginBottom: verticalScale(25),
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#01406D',
    marginBottom: verticalScale(12),
    marginLeft: scale(8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(8),
    padding: scale(16),
    elevation: 2,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#01B4BA',
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  settingTextContainer: {
    flex: 1,
  },
  label: { 
    fontSize: scale(16), 
    color: "#01406D",
    fontWeight: '500',
    marginBottom: verticalScale(2),
  },
  subLabel: { 
    fontSize: scale(12), 
    color: "#01B4BA",
    fontWeight: '400',
  },
  logoutBtn: {
    backgroundColor: "#FF7A0F",
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
    elevation: 4,
    shadowColor: '#FF7A0F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutText: { 
    color: "#FFFFFF", 
    fontSize: scale(16), 
    fontWeight: "600", 
    marginLeft: scale(8) 
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  versionText: {
    fontSize: scale(14),
    color: '#01406D',
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  versionSubtext: {
    fontSize: scale(12),
    color: '#01B4BA',
    fontWeight: '400',
  },
});

export default SettingsScreen;