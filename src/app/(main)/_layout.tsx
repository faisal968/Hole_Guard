import { View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const MainLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack  >
        <Stack.Screen name="(tab)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Profile", headerTintColor: "#333" ,headerShown:false}} />
        <Stack.Screen name="info" options={{ title: "Information", headerTintColor: "#333",headerShown:false }} />
        <Stack.Screen name="ChangePassword" options={{ title: "Change Password", headerTintColor: "#D32F2F" ,headerShown:false}} />
       <Stack.Screen name='HomeScreen' options={{headerShown:false}}/>
       <Stack.Screen name='SettingsScreen' options={{headerShown:false}}/>
       <Stack.Screen name='TermsScreen' options={{headerShown:false}}/>
       <Stack.Screen name='PatholeDetection' options={{headerShown:false}}/>
       
       
       </Stack>
    </View>
  );
};

export default MainLayout;
