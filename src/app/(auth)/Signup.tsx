import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Checkbox from "expo-checkbox";
import { useRegisterUserMutation } from "@/services/UserAuthApi";
import { storeToken } from "@/services/AsyncStorageService";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

const SignupScreen = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [tc, setTc] = useState<null | boolean>(null);
  const [errors, setErrors] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    password2: "", 
    tc: "" 
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [registerUser] = useRegisterUserMutation();

  const validatePassword = (password: string): string => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (password.length > 10) {
      return "Password cannot exceed 10 characters";
    }
    if (!/(?=.*[a-zA-Z])/.test(password)) {
      return "Password must contain at least one letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async () => {
    let newError = { name: "", email: "", password: "", password2: "", tc: "" };
    let hasValidationError = false;

    const passwordError = validatePassword(password);
    if (passwordError) {
      newError.password = passwordError;
      hasValidationError = true;
    }

    const confirmPasswordError = validateConfirmPassword(password, password2);
    if (confirmPasswordError) {
      newError.password2 = confirmPasswordError;
      hasValidationError = true;
    }

    if (!tc) {
      newError.tc = "You must agree to terms and conditions";
      hasValidationError = true;
    }

    if (!name.trim()) {
      newError.name = "Name is required";
      hasValidationError = true;
    }

    if (!email.trim()) {
      newError.email = "Email is required";
      hasValidationError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newError.email = "Email is invalid";
      hasValidationError = true;
    }

    if (hasValidationError) {
      setErrors(newError);
      return;
    }

    setIsLoading(true);
    const formData = { name, email, password, password2, tc };

    try {
      const result = await registerUser(formData);

      if (result.data) {
        await storeToken(result.data.token);
        
        Alert.alert(
          "Account Created Successfully!",
          "Your account has been created. Please login to continue.",
          [
            {
              text: "Go to Login",
              onPress: () => {
                router.replace("/login");
              }
            }
          ]
        );
        
        setName("");
        setEmail("");
        setPassword("");
        setPassword2("");
        setTc(null);
      }

      if (result.error && "data" in result.error) {
        const apiError = result.error as FetchBaseQueryError & { data: { errors?: any, message?: string } };

        if (apiError.data?.errors) {
          newError.name = apiError.data.errors.name ? apiError.data.errors.name[0] : "";
          newError.email = apiError.data.errors.email ? apiError.data.errors.email[0] : "";
          newError.password = apiError.data.errors.password ? apiError.data.errors.password[0] : "";
          newError.password2 = apiError.data.errors.password2 ? apiError.data.errors.password2[0] : "";
          newError.tc = apiError.data.errors.tc ? apiError.data.errors.tc[0] : "";
        } else if (apiError.data?.message) {
          Alert.alert("Registration Failed", apiError.data.message);
        }

        setErrors(newError);
      }
    } catch (error) {
      console.error("Registration error:", error);
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

  const handleConfirmPasswordChange = (text: string) => {
    setPassword2(text);
    if (errors.password2) {
      setErrors({ ...errors, password2: "" });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={scale(40)} color="#01406D" />
          </View>
          <Text style={styles.headerText}>Create Account</Text>
          <Text style={styles.subHeaderText}>Join HoleGuard for smart road safety</Text>
        </View>

        
        <View style={styles.formContainer}>
          
          <View style={styles.inputContainer}>
            <View style={[styles.iconContainer, { backgroundColor: '#01406D' }]}>
              <AntDesign name="user" size={scale(16)} color="#FFFFFF" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#95a5a6"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          
          <View style={styles.inputContainer}>
            <View style={[styles.iconContainer, { backgroundColor: '#01B4BA' }]}>
              <AntDesign name="mail" size={scale(16)} color="#FFFFFF" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              placeholderTextColor="#95a5a6"
              value={email}
              autoCapitalize="none"
              onChangeText={setEmail}
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
              value={password}
              autoCapitalize="none"
              onChangeText={handlePasswordChange}
              editable={!isLoading}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
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

          
          <View style={styles.inputContainer}>
            <View style={[styles.iconContainer, { backgroundColor: '#01406D' }]}>
              <AntDesign name="lock" size={scale(16)} color="#FFFFFF" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#95a5a6"
              secureTextEntry={!showPassword}
              value={password2}
              autoCapitalize="none"
              onChangeText={handleConfirmPasswordChange}
              editable={!isLoading}
            />
          </View>
          {errors.password2 ? <Text style={styles.errorText}>{errors.password2}</Text> : null}

          
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password must have:</Text>
            <View style={styles.requirementsRow}>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={password.length >= 6 && password.length <= 10 ? "checkmark-circle" : "ellipse-outline"} 
                  size={scale(12)} 
                  color={password.length >= 6 && password.length <= 10 ? "#4CAF50" : "#95a5a6"} 
                />
                <Text style={[
                  styles.requirementText,
                  password.length >= 6 && password.length <= 10 ? styles.requirementMet : styles.requirementNotMet
                ]}>6-10 chars</Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={/[a-zA-Z]/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                  size={scale(12)} 
                  color={/[a-zA-Z]/.test(password) ? "#4CAF50" : "#95a5a6"} 
                />
                <Text style={[
                  styles.requirementText,
                  /[a-zA-Z]/.test(password) ? styles.requirementMet : styles.requirementNotMet
                ]}>Letter</Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={/\d/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                  size={scale(12)} 
                  color={/\d/.test(password) ? "#4CAF50" : "#95a5a6"} 
                />
                <Text style={[
                  styles.requirementText,
                  /\d/.test(password) ? styles.requirementMet : styles.requirementNotMet
                ]}>Number</Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                  size={scale(12)} 
                  color={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "#4CAF50" : "#95a5a6"} 
                />
                <Text style={[
                  styles.requirementText,
                  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? styles.requirementMet : styles.requirementNotMet
                ]}>Special</Text>
              </View>
            </View>
          </View>

          
          <View style={styles.checkboxContainer}>
            <Checkbox 
              value={tc ?? false}  
              onValueChange={(newValue) => {
                if (!isLoading) {
                  setTc(newValue ? true : null);
                  if (errors.tc) {
                    setErrors({ ...errors, tc: "" });
                  }
                }
              }}  
              color={tc ? "#FF7A0F" : undefined}
              disabled={isLoading}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxText}>
              I agree to <Text style={styles.termsText}>Terms & Conditions</Text>
            </Text>
          </View>
          {errors.tc ? <Text style={styles.errorText}>{errors.tc}</Text> : null}

          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="refresh" size={scale(18)} color="#FFFFFF" />
                <Text style={styles.buttonText}>Creating Account...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.buttonText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={scale(18)} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/login" style={styles.loginLink} replace>
              <Text style={styles.loginLinkText}>Login</Text>
            </Link>
          </View>
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
    justifyContent: "center",
    paddingHorizontal: moderateScale(20),
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: verticalScale(30),
    paddingTop: verticalScale(10),
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
  errorText: {
    color: "#FF6B6B",
    fontSize: moderateScale(11),
    marginTop: verticalScale(-8),
    marginBottom: verticalScale(8),
    marginLeft: moderateScale(12),
    alignSelf: "flex-start",
  },
  requirementsContainer: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(12),
    shadowColor: "#01406D",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3),
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#01B4BA",
  },
  requirementsTitle: {
    fontSize: moderateScale(12),
    fontWeight: "bold",
    color: "#01406D",
    marginBottom: verticalScale(8),
  },
  requirementsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  requirementText: {
    fontSize: moderateScale(10),
    marginLeft: moderateScale(4),
  },
  requirementMet: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  requirementNotMet: {
    color: "#95a5a6",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(15),
    paddingHorizontal: moderateScale(2),
  },
  checkbox: {
    transform: [{ scale: 0.9 }],
  },
  checkboxText: {
    fontSize: moderateScale(13),
    marginLeft: moderateScale(8),
    color: "#01406D",
    flex: 1,
  },
  termsText: {
    color: "#FF7A0F",
    fontWeight: "600",
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#01406D",
    fontSize: moderateScale(13),
  },
  loginLink: {
    marginLeft: moderateScale(4),
  },
  loginLinkText: {
    color: "#FF7A0F",
    fontSize: moderateScale(13),
    fontWeight: "bold",
  },
});

export default SignupScreen;