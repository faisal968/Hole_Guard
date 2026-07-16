import React from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { router } from 'expo-router';

export default function TermsScreen() {
  const handleBack = () => {
    router.back(); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#01406D" />
      
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scale(24)} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
        </View>
        
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <View style={styles.logoContainer}>
              <Ionicons name="shield-checkmark" size={scale(32)} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>HoleGuard - Terms and Conditions</Text>
            <Text style={styles.subtitle}>Advanced Road Safety System</Text>
          </View>

        
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumberContainer}>
                <Text style={styles.sectionNumber}>1</Text>
              </View>
              <Text style={styles.heading}>Acceptance of Terms</Text>
            </View>
            <Text style={styles.paragraph}>
              By accessing and using the HoleGuard application, you agree to be bound 
              by these Terms and Conditions. If you do not agree with any part of these terms,
              please do not use our services.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumberContainer}>
                <Text style={styles.sectionNumber}>2</Text>
              </View>
              <Text style={styles.heading}>Description of Service</Text>
            </View>
            <Text style={styles.paragraph}>
              HoleGuard is an advanced pothole detection and analysis system using 
              AI to improve road safety and maintenance. The application provides 
              users with tools to detect, analyze, and report potholes through image 
              and video upload capabilities.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumberContainer}>
                <Text style={styles.sectionNumber}>3</Text>
              </View>
              <Text style={styles.heading}>User Contributions</Text>
            </View>
            <Text style={styles.paragraph}>
              You are responsible for any content, including images and videos,
              that you submit through our service. You agree not to upload any
              content that is illegal, harmful, threatening, abusive, or otherwise objectionable.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumberContainer}>
                <Text style={styles.sectionNumber}>4</Text>
              </View>
              <Text style={styles.heading}>Data Privacy</Text>
            </View>
            <Text style={styles.paragraph}>
              We collect and process data in accordance with our Privacy Policy.
              By using HoleGuard, you consent to the collection and use of
              information as described in our Privacy Policy.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumberContainer}>
                <Text style={styles.sectionNumber}>5</Text>
              </View>
              <Text style={styles.heading}>Intellectual Property</Text>
            </View>
            <Text style={styles.paragraph}>
              All content, features, and functionality within the HoleGuard application,
              including but not limited to text, graphics, logos, icons, and software, 
              are owned by HoleGuard and protected by intellectual property laws.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumberContainer}>
                <Text style={styles.sectionNumber}>6</Text>
              </View>
              <Text style={styles.heading}>Limitation of Liability</Text>
            </View>
            <Text style={styles.paragraph}>
              HoleGuard and its developers shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting 
              from your access to or use of, or inability to access or use, the service.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumberContainer}>
                <Text style={styles.sectionNumber}>7</Text>
              </View>
              <Text style={styles.heading}>Changes to Terms</Text>
            </View>
            <Text style={styles.paragraph}>
              We reserve the right to modify these Terms and Conditions at any time.
              We will provide notice of any significant changes by updating the date
              at the top of these terms or by other means as determined by us.
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.divider} />
            <Text style={styles.footerText}>
              Last updated: {new Date().toLocaleDateString()}
            </Text>
            <Text style={styles.versionText}>HoleGuard v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#01406D',
  },
  header: {
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(20),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    backgroundColor: '#01406D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backButton: {
    padding: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: scale(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholder: {
    width: scale(40),
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FEFE',
  },
  scrollContent: {
    padding: scale(20),
    paddingBottom: verticalScale(30),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(20),
    padding: scale(25),
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(1, 64, 109, 0.1)',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
    paddingBottom: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(1, 64, 109, 0.1)',
  },
  logoContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: moderateScale(30),
    backgroundColor: '#FF7A0F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    elevation: 4,
    shadowColor: '#FF7A0F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: '#01406D',
    textAlign: 'center',
    marginBottom: verticalScale(8),
    lineHeight: scale(30),
  },
  subtitle: {
    fontSize: scale(14),
    color: '#01B4BA',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: verticalScale(20),
    padding: scale(18),
    backgroundColor: '#FAFBFC',
    borderRadius: moderateScale(16),
    borderLeftWidth: scale(4),
    borderLeftColor: '#01B4BA',
    elevation: 2,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  sectionNumberContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: moderateScale(16),
    backgroundColor: '#01406D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  sectionNumber: {
    color: '#FFFFFF',
    fontSize: scale(14),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heading: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#01406D',
    flex: 1,
  },
  paragraph: {
    fontSize: scale(14),
    color: '#01406D',
    lineHeight: scale(20),
    textAlign: 'justify',
    opacity: 0.8,
  },
  footer: {
    paddingTop: verticalScale(20),
    marginTop: verticalScale(10),
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(1, 64, 109, 0.1)',
    width: '100%',
    marginBottom: verticalScale(15),
  },
  footerText: {
    fontSize: scale(12),
    color: '#01B4BA',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: verticalScale(4),
  },
  versionText: {
    fontSize: scale(11),
    color: '#01406D',
    textAlign: 'center',
    fontWeight: '500',
  },
});