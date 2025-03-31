import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as Haptics from 'expo-haptics';

export const ARPortionMeasurement = () => {
  const [measuring, setMeasuring] = useState(false);
  const [result, setResult] = useState<any>(null);

  const measurePortion = async () => {
    try {
      setMeasuring(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Имитация измерения
      setTimeout(() => {
        const mockResult = {
          estimatedPortionSize: {
            grams: 200,
            calories: 300
          },
          confidence: 0.8
        };
        setResult(mockResult);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setMeasuring(false);
      }, 2000);

    } catch (error) {
      console.error('Error measuring portion:', error);
      Alert.alert('Error', 'Failed to measure portion. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setMeasuring(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {measuring ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B00" />
            <Text style={styles.loadingText}>Analyzing portion...</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.measureButton}
            onPress={measurePortion}
            disabled={measuring}
          >
            <Text style={styles.buttonText}>Measure Portion</Text>
          </TouchableOpacity>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              Estimated portion: {result.estimatedPortionSize.grams}g
            </Text>
            <Text style={styles.resultText}>
              Calories: {result.estimatedPortionSize.calories}
            </Text>
            <Text style={styles.confidenceText}>
              Confidence: {(result.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  measureButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginTop: 20,
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  confidenceText: {
    color: '#FF6B00',
    fontSize: 14,
  }
});

export default ARPortionMeasurement; 