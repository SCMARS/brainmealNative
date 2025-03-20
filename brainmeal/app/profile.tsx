import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
    // Mock user data
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        stats: {
            meals: 28,
            calories: 2100,
            protein: 82
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <LinearGradient
                        colors={['#FF6B00', '#FF8E3C']}
                        style={styles.avatarGradient}
                    >
                        <Text style={styles.avatarText}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                    </LinearGradient>
                </View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{user.stats.meals}</Text>
                    <Text style={styles.statLabel}>Meals</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{user.stats.calories}</Text>
                    <Text style={styles.statLabel}>Avg. Calories</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{user.stats.protein}g</Text>
                    <Text style={styles.statLabel}>Avg. Protein</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingItem, styles.logoutButton]}>
                    <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
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
    statLabel: {
        color: '#666',
        fontSize: 14,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingItem: {
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
}); 