import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useChangeUserPasswordMutation } from '@/services/UserAuthApi';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getToken } from '@/services/AsyncStorageService';
import { router } from 'expo-router';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { LinearGradient } from 'expo-linear-gradient';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [securePassword2, setSecurePassword2] = useState(true);
  const [errors, setErrors] = useState({ password: '', password2: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [ChangeUserPassword, { isSuccess, error }] = useChangeUserPasswordMutation();

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

  const handleBack = () => {
    router.push('/(main)/profile');
  };

  const sendData = async () => {
    setErrors({ password: '', password2: '' });
    
    let hasValidationError = false;
    let newErrors = { password: '', password2: '' };

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
      hasValidationError = true;
    }

    const confirmPasswordError = validateConfirmPassword(password, password2);
    if (confirmPasswordError) {
      newErrors.password2 = confirmPasswordError;
      hasValidationError = true;
    }

    if (hasValidationError) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    let token = await getToken();
    if (token) {
      try {
        let result = await ChangeUserPassword({
          formData: { password, password2 },
          access: token.access
        });
        
        if (result.error && "data" in result.error) {
          const apiError = result.error as FetchBaseQueryError & { data: { errors?: Record<string, string[]> } };
          
          if (apiError.data?.errors) {
            setErrors({
              password: apiError.data.errors.password ? apiError.data.errors.password[0] : "",
              password2: apiError.data.errors.password2 ? apiError.data.errors.password2[0] : ""
            });
          } else {
            Alert.alert("Error", "Failed to change password. Please try again.");
          }
        }
      } catch (error) {
        console.error("Change password error:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  const handlePassword2Change = (text: string) => {
    setPassword2(text);
    
    if (errors.password2) {
      setErrors({ ...errors, password2: "" });
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (isSuccess) {
      // Show success alert and navigate back to profile
      Alert.alert(
        "Success", 
        "Password changed successfully!", 
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate back to profile screen
              router.replace('/(main)/profile');
            }
          }
        ]
      );
    }
  }, [isSuccess]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['#01406D', '#01406D']}
              style={styles.headerGradient}
            >
              
              <View style={styles.headerTopContainer}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <MaterialIcons name="arrow-back" size={scale(24)} color="white" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerText}>Change Password</Text>
                  <Text style={styles.subHeader}>Create a strong and secure password</Text>
                </View>
                
                <View style={styles.placeholder} />
              </View>
            </LinearGradient>
          </View>

          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.formContainer}>
              
              <View style={styles.inputContainer}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF7A0F' }]}>
                  <AntDesign name="lock" size={scale(16)} color="#FFFFFF" />
                </View>
                <TextInput
                  placeholder="New Password"
                  placeholderTextColor="#95a5a6"
                  style={styles.input}
                  secureTextEntry={securePassword}
                  onChangeText={handlePasswordChange}
                  value={password}
                  autoCapitalize="none"
                  editable={!isLoading}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <TouchableOpacity 
                  onPress={() => setSecurePassword(!securePassword)}
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  <AntDesign 
                    name={securePassword ? "eyeo" : "eye"} 
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

              
              <View style={styles.inputContainer}>
                <View style={[styles.iconContainer, { backgroundColor: '#01B4BA' }]}>
                  <AntDesign name="lock" size={scale(16)} color="#FFFFFF" />
                </View>
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#95a5a6"
                  style={styles.input}
                  secureTextEntry={securePassword2}
                  onChangeText={handlePassword2Change}
                  value={password2}
                  autoCapitalize="none"
                  editable={!isLoading}
                  returnKeyType="done"
                  onSubmitEditing={dismissKeyboard}
                />
                <TouchableOpacity 
                  onPress={() => setSecurePassword2(!securePassword2)}
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  <AntDesign 
                    name={securePassword2 ? "eyeo" : "eye"} 
                    size={scale(18)} 
                    color="#01B4BA" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password2 ? <Text style={styles.errorText}>{errors.password2}</Text> : null}

              
              {password2.length > 0 && (
                <View style={styles.matchIndicator}>
                  <View style={[
                    styles.matchIndicatorBox,
                    password === password2 && password.length > 0 ? styles.matchIndicatorValid : styles.matchIndicatorInvalid
                  ]}>
                    <Text style={[
                      styles.indicatorText,
                      password === password2 && password.length > 0 ? styles.indicatorValid : styles.indicatorInvalid
                    ]}>
                      {password === password2 && password.length > 0 ? "✓ Passwords Match" : "✗ Passwords Do Not Match"}
                    </Text>
                  </View>
                </View>
              )}

              
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <View style={styles.requirementItem}>
                  <Text style={[
                    styles.requirementText,
                    password.length >= 6 && password.length <= 10 ? styles.requirementMet : styles.requirementNotMet
                  ]}>• 6-10 characters length</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Text style={[
                    styles.requirementText,
                    /[a-zA-Z]/.test(password) ? styles.requirementMet : styles.requirementNotMet
                  ]}>• At least one letter</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Text style={[
                    styles.requirementText,
                    /\d/.test(password) ? styles.requirementMet : styles.requirementNotMet
                  ]}>• At least one number</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Text style={[
                    styles.requirementText,
                    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? styles.requirementMet : styles.requirementNotMet
                  ]}>• At least one special character</Text>
                </View>
              </View>

              
              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={sendData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="refresh" size={scale(18)} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Processing...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.buttonText}>CHANGE PASSWORD</Text>
                    <Ionicons name="arrow-forward" size={scale(18)} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            
            <View style={styles.footer}>
              <Text style={styles.footerText}>HoleGuard v1.0.0</Text>
              <Text style={styles.footerSubtext}>Advanced Road Safety</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  headerContainer: {
    zIndex: 10,
  },
  headerGradient: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(15),
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: "#01406D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTopContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  backButton: {
    padding: scale(8),
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: scale(10),
  },
  headerText: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
  subHeader: {
    fontSize: moderateScale(13),
    color: '#01B4BA',
    textAlign: 'center',
    fontWeight: '500',
  },
  placeholder: {
    width: scale(40),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  formContainer: {
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(20),
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
  requirementsContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: 'rgba(1, 180, 186, 0.2)',
    elevation: 3,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requirementsTitle: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#01406D',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  requirementItem: {
    marginBottom: verticalScale(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  requirementMet: {
    color: '#27ae60',
  },
  requirementNotMet: {
    color: '#01B4BA',
  },
  matchIndicator: {
    width: '100%',
    marginBottom: verticalScale(15),
  },
  matchIndicatorBox: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(15),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  matchIndicatorValid: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  matchIndicatorInvalid: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  footer: {
    alignItems: "center",
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(10),
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

export default ChangePassword;