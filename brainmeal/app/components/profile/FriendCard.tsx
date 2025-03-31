import React from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { Friend } from '../../types';

interface FriendCardProps {
    friend: Friend;
    fadeAnim: Animated.Value;
}

export const FriendCard: React.FC<FriendCardProps> = ({ friend, fadeAnim }) => (
    <Animated.View style={[styles.friendCard, { opacity: fadeAnim }]}>
        <View style={styles.friendInfo}>
            <Image 
                source={{ uri: friend.photoURL }} 
                style={styles.friendAvatar}
            />
            <View style={styles.friendStatusContainer}>
                <View style={[
                    styles.friendStatus,
                    { backgroundColor: friend.status === 'online' ? '#4CAF50' : '#666' }
                ]} />
            </View>
        </View>
        <Text style={styles.friendName}>{friend.name}</Text>
        <Text style={styles.friendStatusText}>
            {friend.status === 'online' ? 'Online' : 'Offline'}
        </Text>
    </Animated.View>
);

const styles = StyleSheet.create({
    // ... копируем соответствующие стили из основного файла ...
});

export default FriendCard; 