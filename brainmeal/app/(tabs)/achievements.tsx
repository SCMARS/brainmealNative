import React from 'react';
import { View, StyleSheet } from 'react-native';
import Achievements from '../components/Achievements';

export default function AchievementsScreen() {
  return (
    <View style={styles.container}>
      <Achievements />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
}); 