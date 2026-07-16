import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; 

type Detection = {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: number[];
  frame?: number;
};

type HistoryItem = {
  id: string;
  timestamp: string;
  mediaUri: string;
  mediaType: 'image' | 'video';
  fileName: string;
  detections: Detection[];
  annotatedFile?: string;
  previewImage?: string;
  downloadUrl?: string;
};

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadHistory = async () => {
        try {
          const stored = await AsyncStorage.getItem('detectionHistory');
          if (stored) {
            setHistory(JSON.parse(stored));
          } else {
            setHistory([]);
          }
        } catch (error) {
          console.error('Error loading history:', error);
          setHistory([]);
        }
      };

      loadHistory();
    }, [])
  );

  const deleteItem = async (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this detection?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updated = (history || []).filter((item) => item.id !== id);
            setHistory(updated);
            await AsyncStorage.setItem('detectionHistory', JSON.stringify(updated));
          } catch (error) {
            console.error('Error deleting item:', error);
            Alert.alert('Error', 'Failed to delete item');
          }
        },
      },
    ]);
  };

  const clearHistory = async () => {
    Alert.alert('Clear All History', 'This will permanently delete all your detection history.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('detectionHistory');
            setHistory([]);
            Alert.alert('Success', 'All history cleared');
          } catch (error) {
            console.error('Error clearing history:', error);
            Alert.alert('Error', 'Failed to clear history');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/(main)/PatholeDetection',
          params: { 
            id: item.id,
            mediaUri: item.mediaUri,
            mediaType: item.mediaType,
            fileName: item.fileName
          },
        })
      }
    >
      <View style={styles.cardRow}>
        
        <View style={styles.thumbnailContainer}>
          {item.mediaType === 'image' ? (
            <Image
              source={{ uri: item.annotatedFile || item.mediaUri }}
              style={styles.thumbnail}
            />
          ) : (
            <View style={styles.videoThumbnail}>
              <Image
                source={{ uri: item.previewImage || item.mediaUri }}
                style={styles.thumbnail}
              />
              <View style={styles.videoOverlay}>
                <Ionicons name="play-circle" size={scale(20)} color="#FFFFFF" />
              </View>
            </View>
          )}
          <View style={[
            styles.mediaTypeBadge,
            item.mediaType === 'image' ? styles.imageBadge : styles.videoBadge
          ]}>
            <Ionicons 
              name={item.mediaType === 'image' ? 'image' : 'videocam'} 
              size={scale(12)} 
              color="#FFFFFF" 
            />
          </View>
        </View>

        
        <View style={styles.cardContent}>
          <Text style={styles.fileName} numberOfLines={1}>
            {item.fileName || 'Untitled'}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
          <View style={styles.detectionInfo}>
            <View style={styles.detectionCount}>
              <Ionicons name="analytics" size={scale(14)} color="#01B4BA" />
              <Text style={styles.detectionText}>
                {item.detections?.length || 0} potholes detected
              </Text>
            </View>
            {item.detections && item.detections.length > 0 && (
              <Text style={styles.confidenceText}>
                {Math.max(...item.detections.map(d => d.confidence * 100)).toFixed(0)}% confidence
              </Text>
            )}
          </View>
        </View>

        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteItem(item.id)}
        >
          <MaterialIcons name="delete-outline" size={scale(22)} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={scale(24)} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Detection History</Text>
          </View>
          {history.length > 0 && (
            <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
              <Ionicons name="trash-outline" size={scale(22)} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

      
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <MaterialIcons name="history" size={scale(80)} color="#01B4BA" />
            </View>
            <Text style={styles.emptyTitle}>No Detection History</Text>
            <Text style={styles.emptyText}>
              Your pothole detection results will appear here
            </Text>
            
          </View>
        ) : (
          <View style={styles.listContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyCount}>
                {history.length} detection{history.length !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.historySubtitle}>Tap to view details</Text>
            </View>
            <FlatList
              data={history || []}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
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
    backgroundColor: '#F5FEFE' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#01406D',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    elevation: 8,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: scale(8),
    marginRight: scale(12),
  },
  headerText: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  clearButton: {
    padding: scale(8),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: moderateScale(20),
  },
  listContainer: {
    flex: 1,
  },
  historyHeader: {
    padding: scale(16),
    backgroundColor: '#FFFFFF',
    margin: scale(16),
    borderRadius: moderateScale(12),
    elevation: 2,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  historyCount: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#01406D',
    marginBottom: verticalScale(4),
  },
  historySubtitle: {
    fontSize: scale(12),
    color: '#01B4BA',
  },
  list: {
    padding: scale(16),
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
    padding: scale(16),
    elevation: 3,
    shadowColor: '#01406D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#01B4BA',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: scale(12),
  },
  thumbnail: {
    width: scale(70),
    height: scale(70),
    borderRadius: moderateScale(8),
    backgroundColor: '#f8f9fa',
  },
  videoThumbnail: {
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: moderateScale(8),
  },
  mediaTypeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: scale(20),
    height: scale(20),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  imageBadge: {
    backgroundColor: '#4CAF50',
  },
  videoBadge: {
    backgroundColor: '#FF7A0F',
  },
  cardContent: {
    flex: 1,
  },
  fileName: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#01406D',
    marginBottom: verticalScale(4),
  },
  timestamp: { 
    fontSize: scale(12), 
    color: '#01B4BA',
    marginBottom: verticalScale(6),
  },
  detectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detectionCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  detectionText: {
    fontSize: scale(12),
    color: '#01406D',
    fontWeight: '500',
  },
  confidenceText: {
    fontSize: scale(11),
    color: '#FF7A0F',
    fontWeight: '600',
  },
  deleteButton: {
    padding: scale(8),
    marginLeft: scale(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(40),
  },
  emptyIcon: {
    marginBottom: verticalScale(20),
  },
  emptyTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#01406D',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  emptyText: {
    fontSize: scale(14),
    color: '#01B4BA',
    textAlign: 'center',
    marginBottom: verticalScale(30),
    lineHeight: scale(20),
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7A0F',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(25),
    elevation: 4,
    shadowColor: '#FF7A0F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    gap: scale(8),
  },
  detectButtonText: {
    color: '#FFFFFF',
    fontSize: scale(14),
    fontWeight: '600',
  },
});

export default History;