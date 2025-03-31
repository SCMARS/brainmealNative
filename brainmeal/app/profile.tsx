import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Animated,
    Dimensions,
    RefreshControl,
    Platform,
    Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { signOut, updateEmail, updateProfile } from 'firebase/auth';
import { auth, storage, db } from './config/firebase';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import * as Haptics from 'expo-haptics';
import { LineChart } from 'react-native-chart-kit';
import PortionCalculator from './components/PortionCalculator';
import MealPlanGenerator from './components/MealPlanGenerator';
import { StatCard } from './components/profile/StatCard';
import { StatsModal } from './components/profile/StatsModal';
import { AchievementCard } from './components/profile/AchievementCard';
import { FriendCard } from './components/profile/FriendCard';
import { User } from './types';

const { width } = Dimensions.get('window');

interface Friend {
    id: string;
    name: string;
    photoURL?: string;
    status: 'online' | 'offline';
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    progress: number;
    total: number;
}

interface UserStats {
    meals: number;
    calories: number;
    protein: number;
    weight?: number;
    height?: number;
    age?: number;
    goal?: string;
    history: {
        date: string;
        calories: number;
        protein: number;
    }[];
}

interface User {
    name: string;
    email: string;
    stats: UserStats;
    photoURL?: string;
    achievements: Achievement[];
    friends: Friend[];
}

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [user, setUser] = useState<User>({
        name: 'John Doe',
        email: 'john@example.com',
        stats: {
            meals: 28,
            calories: 2100,
            protein: 82,
            history: [
                { date: '2024-03-25', calories: 2000, protein: 75 },
                { date: '2024-03-26', calories: 2200, protein: 85 },
                { date: '2024-03-27', calories: 2100, protein: 82 },
                { date: '2024-03-28', calories: 2300, protein: 90 },
                { date: '2024-03-29', calories: 2100, protein: 82 },
            ]
        },
        achievements: [
            {
                id: '1',
                title: 'Meal Master',
                description: 'Track 50 meals',
                icon: 'restaurant',
                progress: 28,
                total: 50
            },
            {
                id: '2',
                title: 'Protein Pro',
                description: 'Reach 100g protein',
                icon: 'fitness-center',
                progress: 82,
                total: 100
            }
        ],
        friends: [
            {
                id: '1',
                name: 'Alice Smith',
                status: 'online',
                photoURL: 'https://randomuser.me/api/portraits/women/1.jpg'
            },
            {
                id: '2',
                name: 'Bob Johnson',
                status: 'offline',
                photoURL: 'https://randomuser.me/api/portraits/men/1.jpg'
            }
        ]
    });
    const [editedUser, setEditedUser] = useState<User>(user);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [modalVisible, setModalVisible] = useState(false);
    const [editingStats, setEditingStats] = useState<UserStats | null>(null);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Here would be the logic to refresh data
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const handleEdit = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsEditing(true);
        setEditedUser(user);
    };

    const handleSave = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setUser(editedUser);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
    };

    const handleCancel = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsEditing(false);
        setEditedUser(user);
    };

    const handleLogout = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await signOut(auth);
            router.replace('/(auth)/login');
        } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            try {
                const response = await fetch(result.assets[0].uri);
                const blob = await response.blob();
                const storageRef = ref(storage, `profile_photos/${auth.currentUser?.uid}`);
                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);
                setEditedUser({ ...editedUser, photoURL: downloadURL });
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                Alert.alert('Error', 'Failed to upload photo. Please try again.');
            }
        }
    };

    const handleOpenModal = () => {
        setEditingStats(user.stats);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setEditingStats(null);
    };

    const handleSaveStats = () => {
        if (editingStats) {
            setUser({
                ...user,
                stats: editingStats
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            handleCloseModal();
            Alert.alert('Success', 'Stats updated successfully!');
        }
    };

    // New functions for user data change
    const handleOpenProfileModal = () => {
        setEditedUser({...user});
        setErrorMessage('');
        setProfileModalVisible(true);
    };

    const handleCloseProfileModal = () => {
        setProfileModalVisible(false);
    };

    const handleUpdateUserProfile = async () => {
        if (!auth.currentUser) {
            Alert.alert('Error', 'You must be logged in to update your profile.');
            return;
        }

        // Basic validation
        if (!editedUser.name.trim()) {
            setErrorMessage('Name cannot be empty');
            return;
        }

        if (!editedUser.email.trim() || !editedUser.email.includes('@')) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            // Update user profile in Firebase Auth
            await updateProfile(auth.currentUser, {
                displayName: editedUser.name,
                photoURL: editedUser.photoURL || auth.currentUser.photoURL,
            });

            // Update email if changed
            if (editedUser.email !== user.email) {
                await updateEmail(auth.currentUser, editedUser.email);
            }

            // Update user data in Firestore if needed
            if (auth.currentUser.uid) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, {
                    name: editedUser.name,
                    email: editedUser.email,
                    photoURL: editedUser.photoURL,
                    // Add any other fields you want to update
                });
            }

            // Update local state
            setUser(editedUser);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            handleCloseProfileModal();
            Alert.alert('Success', 'Profile information updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setErrorMessage(error.message || 'Failed to update profile. Please try again.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsLoading(false);
        }
    };

    interface StatCardProps {
        number: number;
        label: keyof UserStats;
        onEdit: () => void;
    }

    const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
        <Animated.View 
            style={[
                styles.achievementCard,
                { opacity: fadeAnim }
            ]}
        >
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

    const chartConfig = {
        backgroundColor: '#1E1E1E',
        backgroundGradientFrom: '#1E1E1E',
        backgroundGradientTo: '#1E1E1E',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#FF6B00'
        }
    };

    const chartData = {
        labels: user.stats.history.map(h => h.date.slice(-5)),
        datasets: [
            {
                data: user.stats.history.map(h => h.calories),
                color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
                strokeWidth: 2
            }
        ],
        legend: ['Calories']
    };

    return (
        <>
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Animated.View 
                    style={[
                        styles.header, 
                        { 
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    <TouchableOpacity 
                        style={styles.avatarContainer}
                        onPress={isEditing ? pickImage : undefined}
                    >
                        {editedUser.photoURL ? (
                            <Image 
                                source={{ uri: editedUser.photoURL }} 
                                style={styles.avatarImage}
                            />
                        ) : (
                            <LinearGradient
                                colors={['#FF6B00', '#FF8E3C']}
                                style={styles.avatarGradient}
                            >
                                <Text style={styles.avatarText}>
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </Text>
                            </LinearGradient>
                        )}
                        {isEditing && (
                            <View style={styles.editPhotoButton}>
                                <MaterialIcons name="camera-alt" size={20} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                    {isEditing ? (
                        <TextInput
                            style={styles.nameInput}
                            value={editedUser.name}
                            onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                        />
                    ) : (
                        <Text style={styles.name}>{user.name}</Text>
                    )}
                    <Text style={styles.email}>{user.email}</Text>
                </Animated.View>

                <View style={styles.statsContainer}>
                    <StatCard number={user.stats.meals} label="meals" onEdit={() => {}} />
                    <StatCard number={user.stats.calories} label="calories" onEdit={() => {}} />
                    <StatCard number={user.stats.protein} label="protein" onEdit={() => {}} />
                </View>

                <View style={styles.statsContainer}>
                    <StatCard number={user.stats.weight || 0} label="weight" onEdit={() => {}} />
                    <StatCard number={user.stats.height || 0} label="height" onEdit={() => {}} />
                    <StatCard number={user.stats.age || 0} label="age" onEdit={() => {}} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Progress</Text>
                    <View style={styles.chartContainer}>
                        <LineChart
                            data={chartData}
                            width={width - 40}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Meal Plan</Text>
                    <MealPlanGenerator />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Meal Calculator</Text>
                    <PortionCalculator />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Friends</Text>
                        <TouchableOpacity 
                            style={styles.addFriendButton}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="person-add" size={24} color="#FF6B00" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.friendsList}
                    >
                        {user.friends.map(friend => (
                            <FriendCard key={friend.id} friend={friend} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    {user.achievements.map(achievement => (
                        <AchievementCard 
                            key={achievement.id} 
                            achievement={achievement} 
                        />
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Settings</Text>
                        {!isEditing ? (
                            <TouchableOpacity 
                                onPress={handleEdit} 
                                style={styles.editButton}
                                activeOpacity={0.7}
                            >
                                <MaterialIcons name="edit" size={24} color="#FF6B00" />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.editActions}>
                                <TouchableOpacity 
                                    onPress={handleCancel} 
                                    style={styles.cancelButton}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons name="close" size={24} color="#FF6B00" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={handleSave} 
                                    style={styles.saveButton}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons name="check" size={24} color="#FF6B00" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity 
                        style={styles.settingItem}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.settingText}>Notifications</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.settingItem}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.settingText}>Privacy</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.settingItem, styles.logoutButton]}
                        onPress={handleLogout}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
                        <MaterialIcons name="logout" size={24} color="#FF6B00" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Stats</Text>
                            <TouchableOpacity 
                                onPress={handleCloseModal}
                                style={styles.modalCloseButton}
                            >
                                <MaterialIcons name="close" size={24} color="#FF6B00" />
                            </TouchableOpacity>
                        </View>

                        {editingStats && (
                            <>
                                <View style={styles.modalInputGroup}>
                                    <Text style={styles.modalLabel}>Meals</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={editingStats.meals.toString()}
                                        onChangeText={(text) => setEditingStats({
                                            ...editingStats,
                                            meals: parseInt(text) || 0
                                        })}
                                        keyboardType="numeric"
                                        placeholder="Enter meals"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <View style={styles.modalInputGroup}>
                                    <Text style={styles.modalLabel}>Calories (kcal)</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={editingStats.calories.toString()}
                                        onChangeText={(text) => setEditingStats({
                                            ...editingStats,
                                            calories: parseInt(text) || 0
                                        })}
                                        keyboardType="numeric"
                                        placeholder="Enter calories"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <View style={styles.modalInputGroup}>
                                    <Text style={styles.modalLabel}>Protein (g)</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={editingStats.protein.toString()}
                                        onChangeText={(text) => setEditingStats({
                                            ...editingStats,
                                            protein: parseInt(text) || 0
                                        })}
                                        keyboardType="numeric"
                                        placeholder="Enter protein"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <View style={styles.modalInputGroup}>
                                    <Text style={styles.modalLabel}>Weight (kg)</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={editingStats.weight?.toString() || ''}
                                        onChangeText={(text) => setEditingStats({
                                            ...editingStats,
                                            weight: parseInt(text) || 0
                                        })}
                                        keyboardType="numeric"
                                        placeholder="Enter weight"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <View style={styles.modalInputGroup}>
                                    <Text style={styles.modalLabel}>Height (cm)</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={editingStats.height?.toString() || ''}
                                        onChangeText={(text) => setEditingStats({
                                            ...editingStats,
                                            height: parseInt(text) || 0
                                        })}
                                        keyboardType="numeric"
                                        placeholder="Enter height"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <View style={styles.modalInputGroup}>
                                    <Text style={styles.modalLabel}>Age</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        value={editingStats.age?.toString() || ''}
                                        onChangeText={(text) => setEditingStats({
                                            ...editingStats,
                                            age: parseInt(text) || 0
                                        })}
                                        keyboardType="numeric"
                                        placeholder="Enter age"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.modalSaveButton}
                                    onPress={handleSaveStats}
                                >
                                    <Text style={styles.modalSaveButtonText}>Save Changes</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    avatarContainer: {
        marginBottom: 20,
        position: 'relative',
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    editPhotoButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#FF6B00',
        borderRadius: 15,
        padding: 8,
        borderWidth: 2,
        borderColor: '#121212',
    },
    avatarText: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
    },
    name: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    nameInput: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#FF6B00',
        padding: 5,
    },
    email: {
        color: '#666',
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#1E1E1E',
        marginVertical: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statCard: {
        alignItems: 'center',
    },
    statNumber: {
        color: '#FF6B00',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statEditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statInput: {
        color: '#FF6B00',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#FF6B00',
        width: 60,
        padding: 2,
    },
    statUnit: {
        color: '#666',
        marginLeft: 4,
        fontSize: 14,
    },
    statLabel: {
        color: '#666',
        fontSize: 14,
    },
    section: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    editButton: {
        padding: 5,
    },
    editActions: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelButton: {
        padding: 5,
    },
    saveButton: {
        padding: 5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    settingText: {
        color: 'white',
        fontSize: 16,
    },
    logoutButton: {
        marginTop: 20,
        borderBottomWidth: 0,
    },
    logoutText: {
        color: '#FF6B00',
    },
    achievementCard: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    achievementInfo: {
        flex: 1,
        marginLeft: 15,
    },
    achievementTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    achievementDescription: {
        color: '#666',
        fontSize: 14,
        marginBottom: 8,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        marginBottom: 4,
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
    chartContainer: {
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 15,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    friendsList: {
        flexDirection: 'row',
        marginTop: 10,
    },
    friendCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        marginRight: 15,
        width: 120,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    friendInfo: {
        position: 'relative',
        marginBottom: 10,
    },
    friendAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    friendStatusContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        padding: 2,
    },
    friendStatus: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    friendName: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    friendStatusText: {
        color: '#666',
        fontSize: 12,
    },
    addFriendButton: {
        padding: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalCloseButton: {
        padding: 5,
    },
    modalInputGroup: {
        marginBottom: 15,
    },
    modalLabel: {
        color: '#666',
        fontSize: 14,
        marginBottom: 5,
    },
    modalInput: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 12,
        color: 'white',
        fontSize: 16,
    },
    modalSaveButton: {
        backgroundColor: '#FF6B00',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    modalSaveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 