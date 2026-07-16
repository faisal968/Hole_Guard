import { SplashScreen, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { getToken, removeToken } from "@/services/AsyncStorageService";
import { View, ActivityIndicator } from "react-native";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "expo-router";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const tokenData = await getToken();
        if (!tokenData?.access) return setIsLogin(false);

        const decodedAccess: JwtPayload = jwtDecode(tokenData.access);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedAccess.exp && decodedAccess.exp > currentTime) {
          setIsLogin(true);
        } else {
          await removeToken();
          setIsLogin(false);
        }
      } catch {
        setIsLogin(false);
      }
    };

    checkAuthStatus();
  }, []);  

  useEffect(() => {
    if (isLogin !== null) {
      const navigate = async () => {
        await router.replace(isLogin ? "/(main)/(tab)" : "/(auth)");
        await SplashScreen.hideAsync();
      };
      navigate();
    }
  }, [isLogin]);  

  if (isLogin === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
};

export default RootLayout;
