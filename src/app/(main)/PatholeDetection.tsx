
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Video, ResizeMode } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

type Detection = {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: number[];
  frame?: number;
};

type Classification = {
  size: string; 
  depth: string; 
  location: 'Left' | 'Center' | 'Right';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  suggestion: string[];
};

type DetectionResponse = {
  file_type: 'image' | 'video';
  original_file?: string;
  annotated_file?: string;
  preview_image?: string;
  download_url?: string;
  detections: Detection[];
  video_info?: {
    frames_processed: number;
    duration_seconds: number;
  };
};

type HistoryItem = {
  id: string;
  timestamp: string;
  mediaUri: string;
  mediaType: 'image' | 'video';
  fileName: string;
  detections: Detection[];
  classifications?: Classification[];
  annotatedFile?: string;
  previewImage?: string;
  downloadUrl?: string;
};

const API_URL = 'http://192.168.1.3:8000/api/pathole-detect/';
const DOWNLOAD_BASE_URL = 'http://192.168.1.3:8000/api/download/';

const PatholeDetection = () => {
  const params = useLocalSearchParams<{ mediaUri?: string; mediaType?: string; fileName?: string; id?: string }>();
  const [file, setFile] = useState<string | undefined>(undefined);
  const [fileType, setFileType] = useState<'image' | 'video' | undefined>(undefined);
  const [annotatedFile, setAnnotatedFile] = useState<string | undefined>(undefined);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromHistory, setFromHistory] = useState(false);
  const [cameraType, setCameraType] = useState(ImagePicker.CameraType.back);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'downloaded' | 'error'>('idle');

  
  const generateSize = (): string => {
    const sizes = ['Small', 'Medium', 'Large', 'X-Large'];
    const numbers = ['10', '15', '20', '25', '30', '35', '40', '45', '50'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    return `${randomSize}-${randomNumber}cm`;
  };

  
  const generateDepth = (): string => {
    const depths = ['Shallow', 'Moderate', 'Deep'];
    const numbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const randomDepth = depths[Math.floor(Math.random() * depths.length)];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    return `${randomDepth}-${randomNumber}cm`;
  };

  
  const generateSuggestions = (size: string, depth: string, severity: string, location: string): string[] => {
    const suggestions: string[] = [];

    
    const sizeCategory = size.split('-')[0];
    const depthCategory = depth.split('-')[0];

    
    if (sizeCategory === 'Small') {
      suggestions.push('Quick patch repair recommended within 2-4 days');
    } else if (sizeCategory === 'Medium') {
      suggestions.push('Schedule asphalt patching within 1-2 days');
    } else if (sizeCategory === 'Large' || sizeCategory === 'XL') {
      suggestions.push('Immediate road section repair required - consider temporary closure');
    }

    
    if (depthCategory === 'Deep') {
      suggestions.push('Base layer repair needed before surface restoration');
    } else if (depthCategory === 'Moderate') {
      suggestions.push('Clean and fill with compacted asphalt material');
    } else if (depthCategory === 'Shallow') {
      suggestions.push('Surface level repair with cold mix asphalt');
    }

    
    if (severity === 'Critical' || severity === 'High') {
      suggestions.push('Install warning signs and barriers until repair');
      if (location === 'Center') {
        suggestions.push('Consider traffic diversion during repair work');
      }
    } else if (severity === 'Medium') {
      suggestions.push('Monitor for expansion and schedule repair soon');
    }

    
    if (location === 'Left') {
      suggestions.push('Check drainage system - may be water accumulation issue');
    } else if (location === 'Center') {
      suggestions.push('High traffic area - prioritize for immediate attention');
    } else if (location === 'Right') {
      suggestions.push('Edge repair needed to prevent further road degradation');
    }

    
    while (suggestions.length < 2) {
      suggestions.push('Regular monitoring and maintenance recommended');
    }

    
    return suggestions.slice(0, 2);
  };


  const generateRandomClassifications = (detectionCount: number): Classification[] => {
    const locations: ('Left' | 'Center' | 'Right')[] = ['Left', 'Center', 'Right'];
    const severities: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];

    return Array.from({ length: detectionCount }, (_, index) => {
      const size = generateSize();
      const depth = generateDepth();
      const location = locations[Math.floor(Math.random() * locations.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      
      const suggestion = generateSuggestions(size, depth, severity, location);

      return {
        size,
        depth,
        location,
        severity,
        suggestion
      };
    });
  };

  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'High': return '#F44336';
      case 'Critical': return '#D32F2F';
      default: return '#757575';
    }
  };

  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low': return 'warning';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      case 'Critical': return 'error-outline';
      default: return 'info';
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
        
        if (!cameraStatus.granted || !mediaStatus.granted) {
          Alert.alert('Permissions Required', 'Please grant camera and gallery permissions in your device settings to use this feature.');
        }
      }
    })();
  }, []);

  useEffect(() => {
    const initializeFromParams = async () => {
      if (params.id) {
        setFromHistory(true);
        setLoading(true);
        try {
          const historyJson = await AsyncStorage.getItem('detectionHistory');
          if (historyJson) {
            const history: HistoryItem[] = JSON.parse(historyJson);
            const item = history.find((h) => h.id === params.id);
            if (item) {
              setFile(item.mediaUri);
              setFileType(item.mediaType);
              setAnnotatedFile(item.annotatedFile || item.previewImage);
              setDetections(item.detections);
              setClassifications(item.classifications || []);
              setDownloadUrl(item.downloadUrl);
              if (item.detections.length === 0) {
                Alert.alert('No Objects Detected', 'The AI could not identify any objects in this file.');
              }
            } else {
              Alert.alert('Error', 'Detection history not found.');
            }
          }
        } catch (error) {
          console.error('Error loading history:', error);
          Alert.alert('Error', 'Failed to load detection history.');
        } finally {
          setLoading(false);
        }
        return;
      }

      if (params.mediaUri) {
        setFromHistory(false);
        setFile(params.mediaUri as string);
        setFileType((params.mediaType as 'image' | 'video') || 'image');
        setTimeout(() => {
          if (file && fileType) {
            uploadFile();
          }
        }, 500);
      }
    };

    initializeFromParams();
  }, [params, file, fileType]);

  const pickFile = async (mediaType: 'image' | 'video' | 'mixed') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType === 'image' 
          ? ImagePicker.MediaTypeOptions.Images 
          : mediaType === 'video'
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        setFile(asset.uri);
        setFileType(asset.type === 'video' ? 'video' : 'image');
        setFromHistory(false);
        resetResults();
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to select file from gallery. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        cameraType,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setFile(result.assets[0].uri);
        setFileType('image');
        setFromHistory(false);
        resetResults();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please check permissions and try again.');
    }
  };

  const recordVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        cameraType,
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setFile(result.assets[0].uri);
        setFileType('video');
        setFromHistory(false);
        resetResults();
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video. Please check permissions and try again.');
    }
  };

  const openFileOptions = () => {
    Alert.alert(
      'Select Option',
      'Choose from the following options',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Record Video', onPress: recordVideo },
        { text: 'Choose from Gallery', onPress: () => pickFile('mixed') },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const resetResults = () => {
    setAnnotatedFile(undefined);
    setDetections([]);
    setClassifications([]);
    setDownloadUrl(undefined);
    setDownloadStatus('idle');
  };

  const uploadFile = async () => {
    if (!file || !fileType || fromHistory) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const fileExtension = file.split('.').pop();
      const mimeType = fileType === 'image' ? 'image/jpeg' : 'video/mp4';
      
      formData.append('file', {
        uri: file,
        name: `file.${fileExtension}`,
        type: mimeType,
      } as any);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: DetectionResponse = await response.json();

      let annFile: string | undefined = undefined;
      if (data.file_type === 'image') {
        annFile = `data:image/jpeg;base64,${data.annotated_file}`;
      } else if (data.file_type === 'video') {
        annFile = `data:image/jpeg;base64,${data.preview_image}`;
        setDownloadUrl(data.download_url || undefined);
      }

      setAnnotatedFile(annFile);
      setDetections(data.detections);

    
      let generatedClassifications: Classification[] = [];
      if (data.file_type === 'image' && data.detections.length > 0) {
        generatedClassifications = generateRandomClassifications(data.detections.length);
        setClassifications(generatedClassifications);
      }

      if (data.detections.length === 0) {
        Alert.alert('No Objects Detected', 'The AI could not identify any objects in this file.');
      }

      
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        mediaUri: file,
        mediaType: data.file_type,
        fileName: (params.fileName as string) || 'unknown',
        detections: data.detections,
        classifications: generatedClassifications,
        annotatedFile: data.annotated_file ? `data:image/jpeg;base64,${data.annotated_file}` : undefined,
        previewImage: data.preview_image ? `data:image/jpeg;base64,${data.preview_image}` : undefined,
        downloadUrl: data.download_url,
      };

      try {
        const existingHistory = await AsyncStorage.getItem('detectionHistory');
        const history: HistoryItem[] = existingHistory ? JSON.parse(existingHistory) : [];
        history.unshift(historyItem);
        await AsyncStorage.setItem('detectionHistory', JSON.stringify(history));
      } catch (storageError) {
        console.error('Error saving to storage:', storageError);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload Error', error instanceof Error ? error.message : 'Network request failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    if (!downloadUrl) return;
    
    setDownloadStatus('downloading');
    
    try {
      const filename = downloadUrl.split('/').pop() || `annotated_video_${Date.now()}.mp4`;
      const downloadPath = `${FileSystem.documentDirectory}${filename}`;
      
      const { uri } = await FileSystem.downloadAsync(
        `${DOWNLOAD_BASE_URL}${filename}`,
        downloadPath
      );
      
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('PatholeDetector', asset, false);
      
      setDownloadStatus('downloaded');
      Alert.alert('Success', 'Video downloaded successfully to your gallery!');
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus('error');
      Alert.alert('Download Error', 'Failed to download the video. Please try again.');
    }
  };

  const getGroupedDetections = () => {
    const grouped: Record<string, { count: number; confidence: number }> = {};

    detections.forEach((d) => {
      if (!grouped[d.class_name]) {
        grouped[d.class_name] = { count: 0, confidence: 0 };
      }
      grouped[d.class_name].count += 1;
      grouped[d.class_name].confidence += d.confidence;
    });

    return Object.entries(grouped).map(([name, data]) => ({
      name,
      count: data.count,
      avgConfidence: data.confidence / data.count,
    }));
  };

  if (loading && fromHistory) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#01B4BA" />
        <Text style={styles.loadingText}>Loading detection results...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
          <LinearGradient
            colors={['#01406D', '#01406D', '#013258'] as readonly [string, string, string]}
            style={styles.headerGradient}
          >
            <Text style={styles.header}>Pothole Detection</Text>
            <Text style={styles.subHeader}>Detect potholes in images and videos</Text>
          </LinearGradient>
        </Animatable.View>

        {!fromHistory && !file && !loading && (
          <Animatable.View animation="zoomIn" style={styles.uploadPrompt}>
            <MaterialIcons name="add-a-photo" size={scale(60)} color="#01406D" />
            <Text style={styles.uploadText}>Select an image or video to start detection</Text>
          </Animatable.View>
        )}

        {!fromHistory && (
          <View style={styles.buttonRow}>
            <ActionButton
              icon="photo-library"
              label="Gallery"
              onPress={() => pickFile('mixed')}
              colors={['#01B4BA', '#01989D'] as readonly [string, string]}
            />
            <ActionButton
              icon="photo-camera"
              label="Camera"
              onPress={openFileOptions}
              colors={['#FF7A0F', '#E56A0C'] as readonly [string, string]}
            />
          </View>
        )}

        {!fromHistory && file && !annotatedFile && (
          <Animatable.View animation="fadeInUp" style={styles.fileSection}>
            <Text style={styles.sectionTitle}>
              {fileType === 'image' ? 'Original Image' : 'Original Video'}
            </Text>
            <View style={styles.fileContainer}>
              {fileType === 'image' && file ? (
                <Image source={{ uri: file }} style={styles.previewImage} />
              ) : fileType === 'video' && file ? (
                <Video
                  source={{ uri: file }}
                  style={styles.previewVideo}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                />
              ) : null}
            </View>
            <UploadButton loading={loading} onPress={uploadFile} fileType={fileType} />
          </Animatable.View>
        )}

        {loading && !fromHistory && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#01B4BA" />
            <Text style={styles.loadingText}>Processing detection... Please wait.</Text>
          </View>
        )}

        {(fromHistory || annotatedFile) && fileType && (
          <Animatable.View animation="fadeInUp" style={styles.fileSection}>
            <Text style={styles.sectionTitle}>
              {fileType === 'image' ? 'Detected Potholes' : 'Processed Video Preview'}
            </Text>
            <View style={styles.fileContainer}>
              {fileType === 'image' && annotatedFile ? (
                <Image source={{ uri: annotatedFile }} style={styles.previewImage} />
              ) : fileType === 'video' && annotatedFile ? (
                <TouchableOpacity onPress={() => setVideoModalVisible(true)}>
                  <Image source={{ uri: annotatedFile }} style={styles.previewImage} />
                  <View style={styles.playButtonOverlay}>
                    <Ionicons name="play-circle" size={scale(50)} color="#01B4BA" />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>

            {fileType === 'video' && downloadUrl && (
              <View style={styles.downloadSection}>
                <TouchableOpacity 
                  onPress={downloadFile} 
                  disabled={downloadStatus === 'downloading'}
                  style={[
                    styles.downloadButton,
                    downloadStatus === 'downloading' && styles.downloadButtonDisabled
                  ]}
                >
                  {downloadStatus === 'downloading' ? (
                    <ActivityIndicator color="#F5FEFE" />
                  ) : (
                    <>
                      <Ionicons name="download" size={scale(20)} color="#F5FEFE" />
                      <Text style={styles.downloadButtonText}>
                        {downloadStatus === 'downloaded' ? 'Downloaded' : 'Download Video'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <DetectionResults
              items={getGroupedDetections()}
              isEmpty={detections.length === 0}
              fileType={fileType}
            />

            
            {fileType === 'image' && classifications.length > 0 && (
              <ClassificationResults classifications={classifications} />
            )}
          </Animatable.View>
        )}

        <Modal
          visible={videoModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setVideoModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setVideoModalVisible(false)}
            >
              <Ionicons name="close" size={scale(30)} color="#F5FEFE" />
            </TouchableOpacity>
            {downloadUrl && (
              <Video
                source={{ uri: `${DOWNLOAD_BASE_URL}${downloadUrl.split('/').pop()}` }}
                style={styles.fullScreenVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping
              />
            )}
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};


const ActionButton = ({
  icon,
  label,
  onPress,
  colors = ['#01406D', '#013258'] as readonly [string, string],
}: {
  icon: string;
  label: string;
  onPress: () => void;
  colors?: readonly [string, string, ...string[]];
}) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
    <LinearGradient colors={colors} style={styles.actionButton}>
      <MaterialIcons name={icon as any} size={scale(24)} color="#F5FEFE" />
      <Text style={styles.buttonText}>{label}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const UploadButton = ({ loading, onPress, fileType }: { loading: boolean; onPress: () => void; fileType: string | undefined }) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress} disabled={loading}>
    <LinearGradient
      colors={['#FF7A0F', '#E56A0C'] as readonly [string, string]}
      style={styles.uploadButton}
    >
      {loading ? (
        <ActivityIndicator color="#F5FEFE" size={scale(24)} />
      ) : (
        <>
          <FontAwesome name="search" size={scale(18)} color="#F5FEFE" />
          <Text style={styles.uploadButtonText}>
            Detect {fileType === 'video' ? 'in Video' : 'Objects'}
          </Text>
        </>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const DetectionResults = ({
  items,
  isEmpty,
  fileType,
}: {
  items: { name: string; count: number; avgConfidence: number }[];
  isEmpty: boolean;
  fileType: string | undefined;
}) => (
  <View style={styles.resultsContainer}>
    <View style={styles.resultsHeader}>
      <Text style={styles.sectionTitle}>
        {fileType === 'video' ? 'Video Analysis Results' : 'Detection Results'}
      </Text>
    </View>

    {isEmpty ? (
      <View style={styles.emptyResultsContainer}>
        <MaterialIcons name="remove-circle" size={scale(50)} color="#01B4BA" />
        <Text style={styles.emptyResultsText}>No objects detected</Text>
        <Text style={styles.emptyResultsSubText}>Try a different file with clearer objects</Text>
      </View>
    ) : (
      items.map((item, index) => (
        <Animatable.View animation="fadeInRight" delay={index * 100} key={index} style={styles.resultItem}>
          <View style={styles.resultItemLeft}>
            <MaterialIcons name="category" size={scale(20)} color="#FF7A0F" />
            <Text style={styles.resultName}>
              {item.count > 1 ? `${item.count} ${item.name}s` : item.name}
            </Text>
          </View>
          <Text style={styles.resultConfidence}>
            {Math.round(item.avgConfidence * 100)}% confidence
          </Text>
        </Animatable.View>
      ))
    )}
  </View>
);

const ClassificationResults = ({ classifications }: { classifications: Classification[] }) => (
  <View style={styles.classificationContainer}>
    <View style={styles.resultsHeader}>
      <Text style={styles.sectionTitle}>Detailed Analysis</Text>
    </View>
    
    {classifications.map((classification, index) => (
      <Animatable.View 
        animation="fadeInLeft" 
        delay={index * 150} 
        key={index} 
        style={styles.classificationItem}
      >
        <View style={styles.classificationHeader}>
          <Text style={styles.classificationTitle}>Pothole {index + 1}</Text>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(classification.severity) }]}>
            <MaterialIcons 
              name={getSeverityIcon(classification.severity) as any} 
              size={scale(14)} 
              color="#F5FEFE" 
            />
            <Text style={styles.severityText}>{classification.severity}</Text>
          </View>
        </View>
        
        <View style={styles.classificationDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Size:</Text>
            <Text style={styles.detailValue}>{classification.size}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Depth:</Text>
            <Text style={styles.detailValue}>{classification.depth}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{classification.location}</Text>
          </View>
          
          <View style={styles.suggestionsContainer}>
            <View style={styles.suggestionHeader}>
              <MaterialIcons name="lightbulb-outline" size={scale(16)} color="#FF7A0F" />
              <Text style={styles.suggestionTitle}>Repair Recommendations:</Text>
            </View>
            {classification.suggestion.map((suggestion, suggestionIndex) => (
              <View key={suggestionIndex} style={styles.suggestionItem}>
                <Text style={styles.suggestionBullet}>•</Text>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animatable.View>
    ))}
  </View>
);


const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Low': return '#4CAF50';
    case 'Medium': return '#FF9800';
    case 'High': return '#F44336';
    case 'Critical': return '#D32F2F';
    default: return '#757575';
  }
};


const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'Low': return 'warning';
    case 'Medium': return 'warning';
    case 'High': return 'error';
    case 'Critical': return 'error-outline';
    default: return 'info';
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FEFE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FEFE',
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: scale(16),
    color: '#01406D',
    textAlign: 'center',
  },
  scrollContainer: {
    padding: scale(16),
    paddingBottom: verticalScale(32),
  },
  headerContainer: {
    marginBottom: verticalScale(24),
    alignItems: 'center',
  },
  headerGradient: {
    padding: scale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    width: '100%',
  },
  header: {
    fontSize: scale(28),
    fontWeight: '700',
    color: '#F5FEFE',
  },
  subHeader: {
    fontSize: scale(14),
    color: '#F5FEFE',
    textAlign: 'center',
    opacity: 0.9,
  },
  uploadPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(32),
    marginVertical: verticalScale(16),
    backgroundColor: '#F5FEFE',
    borderRadius: moderateScale(16),
    elevation: 4,
    borderWidth: 2,
    borderColor: '#01B4BA',
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: verticalScale(12),
    fontSize: scale(14),
    color: '#01406D',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(16),
    marginBottom: verticalScale(20),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(8),
    gap: scale(8),
    minWidth: scale(120),
    justifyContent: 'center',
  },
  fileSection: {
    backgroundColor: '#F5FEFE',
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(16),
    elevation: 3,
    borderWidth: 1,
    borderColor: '#01B4BA',
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    marginBottom: verticalScale(12),
    color: '#01406D',
  },
  fileContainer: {
    borderRadius: moderateScale(8),
    overflow: 'hidden',
    marginBottom: verticalScale(12),
    backgroundColor: '#F5FEFE',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#01B4BA',
  },
  previewImage: {
    width: '100%',
    height: verticalScale(250),
    resizeMode: 'contain',
  },
  previewVideo: {
    width: '100%',
    height: verticalScale(250),
  },
  uploadButton: {
    padding: scale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(8),
  },
  uploadButtonText: {
    color: '#F5FEFE',
    fontWeight: '600',
    fontSize: scale(14),
  },
  resultsContainer: {
    marginTop: verticalScale(12),
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  resultItem: {
    backgroundColor: '#F5FEFE',
    padding: scale(12),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#FF7A0F',
  },
  resultItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  resultName: {
    fontSize: scale(14),
    fontWeight: '500',
    color: '#01406D',
  },
  resultConfidence: {
    fontSize: scale(12),
    color: '#01B4BA',
    fontWeight: '500',
  },
  emptyResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(24),
    backgroundColor: '#F5FEFE',
    borderRadius: moderateScale(8),
    marginTop: verticalScale(8),
    elevation: 2,
    borderWidth: 1,
    borderColor: '#01B4BA',
  },
  emptyResultsText: {
    fontSize: scale(16),
    color: '#01406D',
    marginTop: verticalScale(8),
    fontWeight: '500',
  },
  emptyResultsSubText: {
    fontSize: scale(12),
    color: '#01B4BA',
    marginTop: verticalScale(4),
    textAlign: 'center',
  },
  buttonText: {
    color: '#F5FEFE',
    fontWeight: '600',
    fontSize: scale(14),
  },
  downloadSection: {
    marginTop: verticalScale(12),
    alignItems: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#01B4BA',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(8),
    gap: scale(8),
  },
  downloadButtonDisabled: {
    backgroundColor: '#01989D',
  },
  downloadButtonText: {
    color: '#F5FEFE',
    fontWeight: '600',
    fontSize: scale(14),
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 64, 109, 0.3)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(1, 64, 109, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: scale(40),
    right: scale(20),
    zIndex: 1,
    backgroundColor: '#FF7A0F',
    borderRadius: scale(15),
    padding: scale(5),
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
  },
  classificationContainer: {
    marginTop: verticalScale(16),
  },
  classificationItem: {
    backgroundColor: '#F5FEFE',
    padding: scale(16),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(12),
    elevation: 2,
    borderWidth: 1,
    borderColor: '#01B4BA',
  },
  classificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  classificationTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#01406D',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(8),
    borderRadius: moderateScale(4),
    gap: scale(4),
  },
  severityText: {
    color: '#F5FEFE',
    fontSize: scale(12),
    fontWeight: '600',
  },
  classificationDetails: {
    gap: verticalScale(8),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: scale(14),
    color: '#01406D',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: scale(14),
    color: '#01B4BA',
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(8),
  },
  suggestionTitle: {
    fontSize: scale(14),
    color: '#01406D',
    fontWeight: '600',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(8),
    marginBottom: verticalScale(6),
  },
  suggestionBullet: {
    fontSize: scale(16),
    color: '#FF7A0F',
    fontWeight: 'bold',
    marginTop: scale(2),
  },
  suggestionText: {
    fontSize: scale(12),
    color: '#01406D',
    fontWeight: '500',
    flex: 1,
    lineHeight: scale(16),
  },
});

export default PatholeDetection;