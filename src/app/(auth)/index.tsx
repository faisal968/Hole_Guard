import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Advanced Pothole Detection',
    description: 'Leverage AI technology to accurately detect and analyze road potholes with precision using YOLOv8',
    image: 'https://imagevision.ai/wp-content/uploads/2024/01/Pothole-Detection-Section-2.jpg',
    icon: 'scan-circle-outline',
  },
  {
    id: '2',
    title: 'Real-time Analysis',
    description: 'Get instant results with detailed information about pothole size, depth, and severity levels',
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop',
    icon: 'analytics-outline',
  },
  {
    id: '3',
    title: 'Smart Road Safety',
    description: 'Generate comprehensive reports and maintenance suggestions for better road infrastructure',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    icon: 'shield-checkmark-outline',
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/(auth)/Signup');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/login');
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FEFE" />
      
     
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id} style={styles.slide}>
            
            <Animatable.View 
              animation="zoomIn"
              duration={1000}
              delay={index * 300}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(1, 64, 109, 0.3)', 'rgba(1, 180, 186, 0.2)']}
                style={styles.imageOverlay}
              />
            </Animatable.View>

            
            <Animatable.View 
              animation="fadeInUp"
              duration={800}
              delay={index * 400}
              style={styles.contentContainer}
            >
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#01406D', '#01B4BA']}
                  style={styles.iconGradient}
                >
                  <Ionicons 
                    name={item.icon as any} 
                    size={scale(32)} 
                    color="#FFFFFF" 
                  />
                </LinearGradient>
              </View>
              
              
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
                  {item.title}
                </Text>
              </View>
              
              
              <View style={styles.descriptionContainer}>
                <Text style={styles.description} numberOfLines={3}>
                  {item.description}
                </Text>
              </View>
            </Animatable.View>
          </View>
        ))}
      </ScrollView>

      
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      
      <Animatable.View 
        animation={currentIndex === onboardingData.length - 1 ? "bounceIn" : "fadeInUp"}
        duration={1000}
        style={styles.buttonContainer}
      >
        <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FF7A0F', '#FF914D']}
            style={styles.nextButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={scale(20)} 
              color="#FFFFFF" 
              style={styles.arrowIcon}
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FEFE',
  },
  scrollContent: {
    flexGrow: 1,
  },
  skipButton: {
    position: 'absolute',
    top: verticalScale(50),
    right: scale(20),
    zIndex: 1,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: 'rgba(1, 64, 109, 0.1)',
    elevation: 3,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  skipText: {
    color: '#01406D',
    fontSize: scale(14),
    fontWeight: '600',
  },
  slide: {
    width,
    height: height * 0.85,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: verticalScale(20),
  },
  imageContainer: {
    width: '90%',
    height: verticalScale(280), 
    position: 'relative',
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    marginBottom: verticalScale(20),
    elevation: 5,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: scale(25),
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  iconContainer: {
    marginBottom: verticalScale(5),
    elevation: 5,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconGradient: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: verticalScale(15),
    width: '100%',
    minHeight: verticalScale(70), 
    justifyContent: 'center',
  },
  title: {
    fontSize: scale(24), 
    fontWeight: 'bold',
    color: '#01406D',
    textAlign: 'center',
    lineHeight: scale(32),
  },
  descriptionContainer: {
    width: '100%',
    minHeight: verticalScale(2), 
    justifyContent: 'center',
  },
  description: {
    fontSize: scale(15), 
    color: '#01B4BA',
    textAlign: 'center',
    lineHeight: scale(22), 
    fontWeight: '500',
    paddingHorizontal: scale(5),
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(10),
  },
  indicator: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#E0E0E0',
    marginHorizontal: scale(4),
  },
  activeIndicator: {
    backgroundColor: '#FF7A0F',
    width: scale(24),
  },
  buttonContainer: {
    paddingHorizontal: scale(40),
    marginBottom: verticalScale(55),
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(30),
    borderRadius: moderateScale(25),
    elevation: 8,
    shadowColor: '#FF7A0F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    minWidth: scale(200),
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: scale(10),
  },

});

export default OnboardingScreen;