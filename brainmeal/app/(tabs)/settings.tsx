import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { userProfileService } from '../services/firestore';
import { notificationService } from '../services/notifications';
import type { UserProfile } from '../../types';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'uk', label: 'Українська' },
];

const themes = [
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

const units = [
  { value: 'metric', label: 'Metric (kg, cm)', icon: 'scale-outline' },
  { value: 'imperial', label: 'Imperial (lb, in)', icon: 'american-football-outline' },
];

export default function SettingsScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userProfile = await userProfileService.get(user.uid);
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile['preferences']>) => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      const updatedPreferences = {
        ...profile.preferences,
        ...updates,
      };

      await userProfileService.update(user.uid, {
        preferences: updatedPreferences,
        updatedAt: new Date(),
      });

      setProfile({
        ...profile,
        preferences: updatedPreferences,
      });

      // Update notification settings if they were changed
      if ('notifications' in updates) {
        await notificationService.updateNotificationSettings({
          ...profile,
          preferences: updatedPreferences,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Language
          </Text>
          <View style={styles.optionsContainer}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                style={[
                  styles.optionButton,
                  { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' },
                  profile.preferences.language === lang.value && styles.selectedOption,
                ]}
                onPress={() => updateProfile({ language: lang.value as UserProfile['preferences']['language'] })}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colorScheme === 'dark' ? '#fff' : '#000' },
                    profile.preferences.language === lang.value && styles.selectedOptionText,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Theme
          </Text>
          <View style={styles.optionsContainer}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.value}
                style={[
                  styles.optionButton,
                  { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' },
                  profile.preferences.theme === theme.value && styles.selectedOption,
                ]}
                onPress={() => updateProfile({ theme: theme.value as UserProfile['preferences']['theme'] })}
                disabled={loading}
              >
                <Ionicons
                  name={theme.icon as any}
                  size={24}
                  color={
                    profile.preferences.theme === theme.value
                      ? '#fff'
                      : (colorScheme === 'dark' ? '#fff' : '#000')
                  }
                />
                <Text
                  style={[
                    styles.optionText,
                    { color: colorScheme === 'dark' ? '#fff' : '#000' },
                    profile.preferences.theme === theme.value && styles.selectedOptionText,
                  ]}
                >
                  {theme.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Units
          </Text>
          <View style={styles.optionsContainer}>
            {units.map((unit) => (
              <TouchableOpacity
                key={unit.value}
                style={[
                  styles.optionButton,
                  { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' },
                  profile.preferences.units === unit.value && styles.selectedOption,
                ]}
                onPress={() => updateProfile({ units: unit.value as UserProfile['preferences']['units'] })}
                disabled={loading}
              >
                <Ionicons
                  name={unit.icon as any}
                  size={24}
                  color={
                    profile.preferences.units === unit.value
                      ? '#fff'
                      : (colorScheme === 'dark' ? '#fff' : '#000')
                  }
                />
                <Text
                  style={[
                    styles.optionText,
                    { color: colorScheme === 'dark' ? '#fff' : '#000' },
                    profile.preferences.units === unit.value && styles.selectedOptionText,
                  ]}
                >
                  {unit.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Notifications
          </Text>
          <View style={[styles.notificationsContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
            <View style={styles.notificationRow}>
              <Text style={[styles.notificationText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Meal Reminders
              </Text>
              <Switch
                value={profile.preferences.notifications.meals}
                onValueChange={(value) => updateProfile({
                  notifications: { ...profile.preferences.notifications, meals: value },
                })}
                trackColor={{ false: '#767577', true: '#FF6B00' }}
                thumbColor={profile.preferences.notifications.meals ? '#fff' : '#f4f3f4'}
                disabled={loading}
              />
            </View>

            <View style={styles.notificationRow}>
              <Text style={[styles.notificationText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Water Reminders
              </Text>
              <Switch
                value={profile.preferences.notifications.water}
                onValueChange={(value) => updateProfile({
                  notifications: { ...profile.preferences.notifications, water: value },
                })}
                trackColor={{ false: '#767577', true: '#FF6B00' }}
                thumbColor={profile.preferences.notifications.water ? '#fff' : '#f4f3f4'}
                disabled={loading}
              />
            </View>

            <View style={styles.notificationRow}>
              <Text style={[styles.notificationText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Activity Reminders
              </Text>
              <Switch
                value={profile.preferences.notifications.activity}
                onValueChange={(value) => updateProfile({
                  notifications: { ...profile.preferences.notifications, activity: value },
                })}
                trackColor={{ false: '#767577', true: '#FF6B00' }}
                thumbColor={profile.preferences.notifications.activity ? '#fff' : '#f4f3f4'}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  selectedOption: {
    backgroundColor: '#FF6B00',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#fff',
  },
  notificationsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  notificationText: {
    fontSize: 16,
  },
}); 