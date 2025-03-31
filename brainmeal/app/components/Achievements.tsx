import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Image,
    Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    points: number;
    category: 'nutrition' | 'fitness' | 'social' | 'streak';
    progress: number;
    total: number;
    unlocked: boolean;
    dateUnlocked?: string;
}

interface UserStats {
    totalPoints: number;
    level: number;
    streak: number;
    achievements: Achievement[];
}

const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_meal',
        title: 'First Meal',
        description: 'Track your first meal',
        icon: 'restaurant',
        points: 10,
        category: 'nutrition',
        progress: 0,
        total: 1,
        unlocked: false
    },
    {
        id: 'protein_master',
        title: 'Protein Master',
        description: 'Reach 100g protein in a day',
        icon: 'fitness-center',
        points: 50,
        category: 'nutrition',
        progress: 0,
        total: 100,
        unlocked: false
    },
    {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: 'local-fire-department',
        points: 100,
        category: 'streak',
        progress: 0,
        total: 7,
        unlocked: false
    },
    {
        id: 'meal_planner',
        title: 'Meal Planner',
        description: 'Create 5 meal plans',
        icon: 'calendar-today',
        points: 75,
        category: 'nutrition',
        progress: 0,
        total: 5,
        unlocked: false
    },
    {
        id: 'social_butterfly',
        title: 'Social Butterfly',
        description: 'Add 5 friends',
        icon: 'people',
        points: 50,
        category: 'social',
        progress: 0,
        total: 5,
        unlocked: false
    }
];

const Achievements = () => {
    const [userStats, setUserStats] = useState<UserStats>({
        totalPoints: 0,
        level: 1,
        streak: 0,
        achievements: ACHIEVEMENTS
    });
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadUserStats();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadUserStats = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserStats({
                    totalPoints: data.totalPoints || 0,
                    level: data.level || 1,
                    streak: data.streak || 0,
                    achievements: data.achievements || ACHIEVEMENTS
                });
            } else {
                // Initialize user stats
                await setDoc(doc(db, 'users', userId), {
                    totalPoints: 0,
                    level: 1,
                    streak: 0,
                    achievements: ACHIEVEMENTS
                });
            }
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    };

    const updateAchievement = async (achievementId: string, progress: number) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const updatedAchievements = userStats.achievements.map(achievement => {
                if (achievement.id === achievementId) {
                    const newProgress = achievement.progress + progress;
                    const unlocked = !achievement.unlocked && newProgress >= achievement.total;
                    return {
                        ...achievement,
                        progress: newProgress,
                        unlocked,
                        dateUnlocked: unlocked ? new Date().toISOString() : achievement.dateUnlocked
                    };
                }
                return achievement;
            });

            const newTotalPoints = updatedAchievements.reduce((total, achievement) => 
                total + (achievement.unlocked ? achievement.points : 0), 0);

            await updateDoc(doc(db, 'users', userId), {
                achievements: updatedAchievements,
                totalPoints: newTotalPoints,
                level: Math.floor(newTotalPoints / 100) + 1
            });

            setUserStats(prev => ({
                ...prev,
                achievements: updatedAchievements,
                totalPoints: newTotalPoints,
                level: Math.floor(newTotalPoints / 100) + 1
            }));

            // Check for newly unlocked achievements
            const newlyUnlocked = updatedAchievements.find(
                achievement => achievement.id === achievementId && achievement.unlocked && !userStats.achievements.find(a => a.id === achievementId)?.unlocked
            );

            if (newlyUnlocked) {
                Alert.alert(
                    'Achievement Unlocked! 🎉',
                    `${newlyUnlocked.title}\n${newlyUnlocked.description}\n+${newlyUnlocked.points} points!`
                );
            }
        } catch (error) {
            console.error('Error updating achievement:', error);
        }
    };

    const filteredAchievements = userStats.achievements.filter(achievement => 
        selectedCategory === 'all' || achievement.category === selectedCategory
    );

    const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
        <View style={[
            styles.achievementCard,
            achievement.unlocked && styles.achievementCardUnlocked
        ]}>
            <View style={styles.achievementIcon}>
                <MaterialIcons 
                    name={achievement.icon as any} 
                    size={32} 
                    color={achievement.unlocked ? '#FF6B00' : '#666'} 
                />
            </View>
            <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill,
                                { width: `${Math.min((achievement.progress / achievement.total) * 100, 100)}%` }
                            ]} 
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {achievement.progress}/{achievement.total}
                    </Text>
                </View>
                {achievement.unlocked && (
                    <Text style={styles.pointsText}>+{achievement.points} points</Text>
                )}
            </View>
        </View>
    );

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userStats.level}</Text>
                    <Text style={styles.statLabel}>Level</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userStats.totalPoints}</Text>
                    <Text style={styles.statLabel}>Points</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{userStats.streak}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
            </View>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        selectedCategory === 'all' && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory('all')}
                >
                    <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === 'all' && styles.categoryButtonTextActive
                    ]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        selectedCategory === 'nutrition' && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory('nutrition')}
                >
                    <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === 'nutrition' && styles.categoryButtonTextActive
                    ]}>Nutrition</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        selectedCategory === 'fitness' && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory('fitness')}
                >
                    <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === 'fitness' && styles.categoryButtonTextActive
                    ]}>Fitness</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        selectedCategory === 'social' && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory('social')}
                >
                    <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === 'social' && styles.categoryButtonTextActive
                    ]}>Social</Text>
                </TouchableOpacity>
            </ScrollView>

            <ScrollView style={styles.achievementsList}>
                {filteredAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
            </ScrollView>
        </Animated.View>
    );
};

export default Achievements;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: '#FF6B00',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        color: '#666',
        fontSize: 14,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryButton: {
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 10,
    },
    categoryButtonActive: {
        backgroundColor: '#FF6B00',
    },
    categoryButtonText: {
        color: '#666',
        fontSize: 14,
    },
    categoryButtonTextActive: {
        color: 'white',
    },
    achievementsList: {
        flex: 1,
    },
    achievementCard: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        opacity: 0.7,
    },
    achievementCardUnlocked: {
        opacity: 1,
        borderColor: '#FF6B00',
        borderWidth: 1,
    },
    achievementIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#2A2A2A',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    achievementInfo: {
        flex: 1,
    },
    achievementTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    achievementDescription: {
        color: '#666',
        fontSize: 14,
        marginBottom: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#2A2A2A',
        borderRadius: 2,
        marginRight: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FF6B00',
        borderRadius: 2,
    },
    progressText: {
        color: '#666',
        fontSize: 12,
    },
    pointsText: {
        color: '#FF6B00',
        fontSize: 12,
        fontWeight: 'bold',
    },
}); 