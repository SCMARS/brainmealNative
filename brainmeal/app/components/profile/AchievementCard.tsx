import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Achievement } from '../../types';

interface AchievementCardProps {
    achievement: Achievement;
    fadeAnim: Animated.Value;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, fadeAnim }) => (
    <Animated.View style={[styles.achievementCard, { opacity: fadeAnim }]}>
        <MaterialIcons name={achievement.icon as any} size={24} color="#FF6B00" />
        <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
            <View style={styles.progressBar}>
                <View 
                    style={[
                        styles.progressFill,
                        { width: `${(achievement.progress / achievement.total) * 100}%` }
                    ]} 
                />
            </View>
            <Text style={styles.progressText}>
                {achievement.progress}/{achievement.total}
            </Text>
        </View>
    </Animated.View>
);

const styles = StyleSheet.create({
    // ... копируем соответствующие стили из основного файла ...
});

export default AchievementCard; 