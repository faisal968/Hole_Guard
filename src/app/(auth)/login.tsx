import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  Alert
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useLoginUserMutation } from "@/services/UserAuthApi";
import { storeToken } from "@/services/AsyncStorageService";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ 
    email: "", 
    password: "",
    nonField: "" 
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [loginUser] = useLoginUserMutation();
  
  const validatePassword = (password: string): string => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (password.length > 10) {
      return "Password cannot exceed 10 characters";
    }
    return "";
  };

  const handleSubmit = async () => {
    setErrors({ email: "", password: "", nonField: "" });
    
    let hasValidationError = false;
    let newErrors = { email: "", password: "", nonField: "" };
    
    if (!email) {
      newErrors.email = "Email is required";
      hasValidationError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      hasValidationError = true;
    }
    
    if (!password) {
      newErrors.password = "Password is required";
      hasValidationError = true;
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) {
        newErrors.password = passwordError;
        hasValidationError = true;
      }
    }

    if (hasValidationError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const formData = { email, password };

    try {
      const result = await loginUser(formData);

      if (result.data) {
        await storeToken(result.data.token);
        router.replace("/(main)/(tab)");
        return;
      }

      if (result.error) {
        if ("status" in result.error && result.error.status === 404) {
          setErrors(prev => ({ ...prev, nonField: "User not found or invalid credentials" }));
          return;
        }

        if ("data" in result.error) {
          const apiError = result.error as FetchBaseQueryError & { 
            data: { 
              errors?: { 
                email?: string[], 
                password?: string[],
                non_field_errors?: string[] 
              },
              message?: string
            } 
          };

          if (apiError.data?.errors) {
            setErrors({
              email: apiError.data.errors.email?.[0] || "",
              password: apiError.data.errors.password?.[0] || "",
              nonField: apiError.data.errors.non_field_errors?.[0] || ""
            });
          } else if (apiError.data?.message) {
            Alert.alert("Login Failed", apiError.data.message);
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors({ ...errors, email: "" });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        
        <View style={styles.contentContainer}>
          
          
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Ionicons name="shield-checkmark" size={scale(40)} color="#01406D" />
            </View>
            <Text style={styles.headerText}>Welcome Back!</Text>
            <Text style={styles.subHeaderText}>Sign in to continue with HoleGuard</Text>
          </View>

          
          <View style={styles.formContainer}>
            
            <View style={styles.inputContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#01B4BA' }]}>
                <AntDesign name="mail" size={scale(16)} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                keyboardType="email-address"
                placeholderTextColor="#95a5a6"
                autoCapitalize="none"
                onChangeText={handleEmailChange}
                value={email}
                returnKeyType="next"
                editable={!isLoading}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            
            <View style={styles.inputContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF7A0F' }]}>
                <AntDesign name="lock" size={scale(16)} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#95a5a6"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                onChangeText={handlePasswordChange}
                value={password}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                editable={!isLoading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <AntDesign 
                  name={showPassword ? "eye" : "eyeo"} 
                  size={scale(18)} 
                  color="#01B4BA" 
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            
            {password.length > 0 && (
              <View style={styles.passwordIndicator}>
                <Text style={[
                  styles.indicatorText,
                  password.length >= 6 && password.length <= 10 
                    ? styles.indicatorValid 
                    : styles.indicatorInvalid
                ]}>
                  {password.length}/10 characters
                  {password.length >= 6 && password.length <= 10 && " ✓"}
                </Text>
              </View>
            )}

            
            {errors.nonField ? <Text style={styles.errorText}>{errors.nonField}</Text> : null}

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="refresh" size={scale(18)} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Signing In...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.buttonText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={scale(18)} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <Link href="/(auth)/Signup" style={styles.signupLink} replace>
                <Text style={styles.signupLinkText}>Create Account</Text>
              </Link>
            </View>
          </View>
        </View>

        
        <View style={styles.footer}>
          <Text style={styles.footerText}>HoleGuard v1.0.0</Text>
          <Text style={styles.footerSubtext}>Advanced Road Safety</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#F5FEFE" 
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: verticalScale(40),
  },
  logoContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: moderateScale(30),
    backgroundColor: "rgba(1, 64, 109, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  headerText: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#01406D",
    marginBottom: verticalScale(6),
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: moderateScale(13),
    color: "#01B4BA",
    textAlign: "center",
    fontWeight: "500",
  },
  formContainer: {
    width: "100%",
    maxWidth: scale(320),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    marginBottom: verticalScale(12),
    height: verticalScale(48),
    shadowColor: "#01406D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(6),
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(1, 64, 109, 0.1)",
  },
  iconContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: moderateScale(16),
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(10),
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: moderateScale(15),
    color: "#01406D",
    fontWeight: "500",
  },
  eyeIcon: {
    padding: scale(6),
  },
  button: {
    backgroundColor: "#FF7A0F",
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#FF7A0F",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(6),
    elevation: 5,
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
  },
  buttonDisabled: {
    backgroundColor: "#FFA557",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
    marginRight: moderateScale(6),
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#01406D",
    fontSize: moderateScale(13),
  },
  signupLink: {
    marginLeft: moderateScale(4),
  },
  signupLinkText: {
    color: "#FF7A0F",
    fontSize: moderateScale(13),
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: moderateScale(11),
    marginTop: verticalScale(-8),
    marginBottom: verticalScale(8),
    marginLeft: moderateScale(12),
    alignSelf: "flex-start",
  },
  passwordIndicator: {
    marginBottom: verticalScale(10),
    paddingLeft: moderateScale(12),
  },
  indicatorText: {
    fontSize: moderateScale(11),
    fontWeight: "500",
  },
  indicatorValid: {
    color: "#4CAF50",
  },
  indicatorInvalid: {
    color: "#FF6B6B",
  },
  footer: {
    alignItems: "center",
    paddingBottom: verticalScale(20),
  },
  footerText: {
    fontSize: moderateScale(12),
    color: "#01406D",
    fontWeight: "600",
    marginBottom: verticalScale(2),
  },
  footerSubtext: {
    fontSize: moderateScale(10),
    color: "#01B4BA",
    fontWeight: "500",
  },
});

export default LoginScreen;