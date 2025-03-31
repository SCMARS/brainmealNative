import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { UserStats } from '../../types';

interface StatCardProps {
    number: number;
    label: keyof UserStats;
    onPress: () => void;
    fadeAnim: Animated.Value;
}

export const getUnitForStat = (label: string) => {
    switch(label) {
        case 'protein': return 'g';
        case 'calories': return 'kcal';
        case 'weight': return 'kg';
        case 'height': return 'cm';
        default: return '';
    }
};

export const formatLabel = (label: string) => {
    return label.charAt(0).toUpperCase() + label.slice(1);
};

export const StatCard = () => {
    // ... существующий код ...
};

export default StatCard;

const styles = StyleSheet.create({
    statCard: {
        alignItems: 'center',
    },
    statNumber: {
        color: '#FF6B00',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        color: '#666',
        fontSize: 14,
    },
}); 