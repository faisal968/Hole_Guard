import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { router } from "expo-router";
import HomeScreen from "../HomeScreen";

const App = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const drawerItems = [
  
    { label: "pathole detection", icon: "car-outline", route: "/(main)/PatholeDetection" },
    { label: "detection history", icon: "time-outline", route: "/(main)/(tab)/other" },
    { label: "terms & conditions", icon: "document-text-outline", route: "/(main)/TermsScreen" },
    { label: "settings", icon: "settings-outline", route: "/(main)/SettingsScreen" },
  ];

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  const handleInfo = (route: string) => {
    router.push(route as any);
    toggleDrawer();
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
        <Ionicons name="menu-outline" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      
      <Modal
        visible={drawerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleDrawer}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.drawer}>
            
            <View style={styles.drawerHeader}>
              <View style={styles.logoContainer}>
                <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
                <Text style={styles.appName}>HoleGuard</Text>
              </View>
              <TouchableOpacity onPress={toggleDrawer} style={styles.closeButton}>
                <Ionicons name="close-outline" size={28} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
              {drawerItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleInfo(item.route)}
                  style={styles.drawerItemButton}
                >
                  <View style={styles.drawerItemRow}>
                    <View style={[
                      styles.iconContainer,
                      { 
                        backgroundColor: 
                          index === 0 ? '#FF7A0F' : 
                          index === 1 ? '#01B4BA' : 
                          index === 2 ? '#FF7A0F' :
                          index === 3 ? '#01B4BA': 
                          index === 4 ? '#FF7A0F' :
                          'rgba(255,255,255,0.2)' 
                      }
                    ]}>
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color="white"
                      />
                    </View>
                    <Text style={styles.drawerItem}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            
            <View style={styles.versionContainer}>
              <View style={styles.divider} />
              <Text style={styles.versionText}>HoleGuard v1.0.0</Text>
              <Text style={styles.versionSubtext}>Advanced Road Safety</Text>
            </View>
          </View>
        </View>
      </Modal>

     
      <View style={styles.mainContent}>
        <HomeScreen setGlobalLoading={setLoading} />
      </View>

      
      <View style={styles.topRightContainer}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push("/(main)/profile")}
        >
          <Ionicons
            name="person-circle-outline"
            size={32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#FF7A0F" />
            <Text style={styles.loadingText}>Processing your media...</Text>
            <Text style={styles.loadingSubtext}>This may take a few moments</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FEFE",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topRightContainer: {
    position: "absolute",
    top: verticalScale(27),
    right: scale(20),
    zIndex: 10,
  },
  profileButton: {
    padding: scale(5),
    backgroundColor: '#01406D',
    borderRadius: moderateScale(20),
    elevation: 4,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuButton: {
    position: "absolute",
    top: verticalScale(27),
    left: scale(20),
    padding: scale(5),
    backgroundColor: '#01406D',
    borderRadius: moderateScale(20),
    elevation: 4,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
  },
  drawer: {
    backgroundColor: "#01406D",
    width: "80%",
    height: "100%",
    borderTopRightRadius: moderateScale(25),
    borderBottomRightRadius: moderateScale(25),
    paddingHorizontal: scale(20),
    elevation: 10,
    shadowColor: '#01406D',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    marginBottom: verticalScale(10),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  appName: {
    color: "white",
    fontSize: scale(20),
    fontWeight: "bold",
  },
  closeButton: {
    padding: scale(5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: moderateScale(20),
  },
  scrollView: {
    flex: 1,
    marginTop: verticalScale(10),
  },
  drawerItemButton: {
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  drawerItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(15),
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerItem: {
    color: "white",
    fontSize: scale(16),
    textTransform: "capitalize",
    fontWeight: '500',
    flex: 1,
  },
  versionContainer: {
    paddingVertical: verticalScale(25),
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: '100%',
    marginBottom: verticalScale(15),
  },
  versionText: {
    color: "white",
    fontSize: scale(14),
    fontWeight: "bold",
    marginBottom: verticalScale(4),
  },
  versionSubtext: {
    color: "#01B4BA",
    fontSize: scale(12),
    fontWeight: "500",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(1, 64, 109, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: scale(30),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: '70%',
  },
  loadingText: {
    color: "#01406D",
    marginTop: verticalScale(20),
    fontSize: scale(16),
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    color: "#01B4BA",
    marginTop: verticalScale(8),
    fontSize: scale(12),
    textAlign: 'center',
  },
});

export default App;