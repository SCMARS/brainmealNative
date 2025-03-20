import { View, Text, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'vegan';
  isPremium: boolean;
  notifications: {
    meals: boolean;
    water: boolean;
    activity: boolean;
  };
  language: 'en' | 'uk';
  theme: 'light' | 'dark' | 'system';
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.displayName || 'User',
    age: 28,
    weight: 75,
    height: 180,
    goal: 'maintenance',
    isPremium: false,
    notifications: {
      meals: true,
      water: true,
      activity: true,
    },
    language: 'en',
    theme: 'system',
  });

  const toggleNotification = (type: keyof UserProfile['notifications']) => {
    setProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [type]: !profile.notifications[type],
      },
    });
  };

  const handleUpgrade = () => {
    // TODO: Implement Stripe integration
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#FF6B00', '#FF8533']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
          <Text style={[styles.name, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            {profile.name}
          </Text>
        </View>

        {!profile.isPremium && (
          <TouchableOpacity
            style={styles.premiumCard}
            onPress={handleUpgrade}
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.premiumGradient}
            >
              <View style={styles.premiumContent}>
                <Ionicons name="star" size={24} color="#fff" />
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumPrice}>$2.99/month</Text>
                <Text style={styles.premiumFeatures}>
                  Get access to all features and personalized meal plans
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Personal Information
          </Text>
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                Age
              </Text>
              <Text style={[styles.infoValue, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                {profile.age} years
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                Weight
              </Text>
              <Text style={[styles.infoValue, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                {profile.weight} kg
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                Height
              </Text>
              <Text style={[styles.infoValue, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                {profile.height} cm
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                Goal
              </Text>
              <Text style={[styles.infoValue, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                {profile.goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Notifications
          </Text>
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
            <View style={styles.notificationRow}>
              <Text style={[styles.notificationLabel, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Meal Reminders
              </Text>
              <Switch
                value={profile.notifications.meals}
                onValueChange={() => toggleNotification('meals')}
                trackColor={{ false: '#767577', true: '#FF6B00' }}
                thumbColor={profile.notifications.meals ? '#fff' : '#f4f3f4'}
              />
            </View>
            <View style={styles.notificationRow}>
              <Text style={[styles.notificationLabel, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Water Reminders
              </Text>
              <Switch
                value={profile.notifications.water}
                onValueChange={() => toggleNotification('water')}
                trackColor={{ false: '#767577', true: '#FF6B00' }}
                thumbColor={profile.notifications.water ? '#fff' : '#f4f3f4'}
              />
            </View>
            <View style={styles.notificationRow}>
              <Text style={[styles.notificationLabel, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Activity Reminders
              </Text>
              <Switch
                value={profile.notifications.activity}
                onValueChange={() => toggleNotification('activity')}
                trackColor={{ false: '#767577', true: '#FF6B00' }}
                thumbColor={profile.notifications.activity ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Settings
          </Text>
          <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Language
              </Text>
              <Text style={[styles.settingValue, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                {profile.language.toUpperCase()}
              </Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Theme
              </Text>
              <Text style={[styles.settingValue, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                {profile.theme.charAt(0).toUpperCase() + profile.theme.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={signOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  premiumCard: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: 20,
  },
  premiumContent: {
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  premiumPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  premiumFeatures: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  card: {
    borderRadius: 12,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  notificationLabel: {
    fontSize: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
  signOutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 