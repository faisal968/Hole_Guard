 import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { scale, moderateScale } from 'react-native-size-matters';

const _layout = () => {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#01406D',
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        height: scale(70),
        paddingBottom: scale(10),
        paddingTop: scale(10),
      },
      tabBarItemStyle: {
        borderRadius: moderateScale(25),
        marginHorizontal: scale(5),
        marginVertical: scale(5),
      },
      tabBarActiveTintColor: '#FFFFFF',
      tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
      tabBarLabelStyle: {
        fontSize: scale(12),
        fontWeight: '600',
        marginTop: scale(4),
      },
      tabBarBackground: () => (
        <BlurView 
          intensity={20} 
          style={StyleSheet.absoluteFill}
          tint="dark"
        />
      ),
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: "View",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons 
                name="eye" 
                size={focused ? scale(22) : scale(20)} 
                color={focused ? '#01406D' : 'white'} 
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen 
        name="other" 
        options={{
          title: "Recent",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons 
                name="time-outline" 
                size={focused ? scale(22) : scale(20)} 
                color={focused ? '#01406D' : 'white'} 
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      
      <Tabs.Screen 
        name="profile" 
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons 
                name="person-outline" 
                size={focused ? scale(22) : scale(20)} 
                color={focused ? '#01406D' : 'white'} 
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen 
        name="settings" 
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons 
                name="settings-outline" 
                size={focused ? scale(22) : scale(20)} 
                color={focused ? '#01406D' : 'white'} 
              />
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: scale(25),
    height: scale(25),
    borderRadius: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabBarLabel: {
    fontSize: scale(12),
    fontWeight: '600',
    marginTop: scale(4),
  },
});

export default _layout;