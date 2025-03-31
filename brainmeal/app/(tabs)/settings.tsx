import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Switch, ScrollView, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { userProfileService } from '../services/firestore';
import { notificationService } from '../services/notifications';
import type { UserProfile } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

export default function Settings() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('ru');

  // Состояния для целей
  const [caloriesGoal, setCaloriesGoal] = useState('2000');
  const [proteinGoal, setProteinGoal] = useState('150');
  const [waterGoal, setWaterGoal] = useState('2.5');

  // Состояния для уведомлений
  const [waterReminders, setWaterReminders] = useState(true);
  const [progressUpdates, setProgressUpdates] = useState(true);

  // Состояния для предпочтений
  const [dietType, setDietType] = useState('balanced');
  const [excludedIngredients, setExcludedIngredients] = useState([]);

  const dietTypes = [
    { id: 'balanced', name: 'Сбалансированное' },
    { id: 'low-carb', name: 'Низкоуглеводное' },
    { id: 'high-protein', name: 'Высокобелковое' },
    { id: 'vegetarian', name: 'Вегетарианское' },
    { id: 'vegan', name: 'Веганское' }
  ];

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
        {/* Профиль */}
        <LinearGradient
          colors={['#FF6B00', '#FF8E3C']}
          style={styles.profileHeader}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>ИП</Text>
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>Иван Петров</Text>
              <Text style={styles.profileEmail}>ivan@example.com</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Редактировать профиль</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Основные настройки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Основные настройки</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={24} color="#666" />
              <Text style={styles.settingText}>Уведомления</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#FF6B00' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="dark-mode" size={24} color="#666" />
              <Text style={styles.settingText}>Темная тема</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#FF6B00' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="language" size={24} color="#666" />
              <Text style={styles.settingText}>Язык</Text>
            </View>
            <View style={styles.languageButtons}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  style={[
                    styles.languageButton,
                    language === lang.value && styles.languageButtonActive
                  ]}
                  onPress={() => setLanguage(lang.value)}
                >
                  <Text style={[
                    styles.languageButtonText,
                    language === lang.value && styles.languageButtonTextActive
                  ]}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Уведомления */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Уведомления</Text>
          <View style={styles.notificationsContainer}>
            {profile?.preferences?.notifications && (
              <>
                <View style={styles.notificationRow}>
                  <Text style={styles.notificationText}>Напоминания о еде</Text>
                  <Switch
                    value={profile.preferences.notifications.meals}
                    onValueChange={(value) => updateProfile({
                      notifications: { ...profile.preferences.notifications, meals: value },
                    })}
                    trackColor={{ false: '#767577', true: '#FF6B00' }}
                    disabled={loading}
                  />
                </View>

                <View style={styles.notificationRow}>
                  <Text style={styles.notificationText}>Напоминания о воде</Text>
                  <Switch
                    value={profile.preferences.notifications.water}
                    onValueChange={(value) => updateProfile({
                      notifications: { ...profile.preferences.notifications, water: value },
                    })}
                    trackColor={{ false: '#767577', true: '#FF6B00' }}
                    disabled={loading}
                  />
                </View>
              </>
            )}
          </View>
        </View>

        {/* Единицы измерения */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Единицы измерения</Text>
          <View style={styles.optionsContainer}>
            {units.map((unit) => (
              <TouchableOpacity
                key={unit.value}
                style={[
                  styles.optionButton,
                  profile?.preferences?.units === unit.value && styles.selectedOption,
                ]}
                onPress={() => updateProfile({ units: unit.value as UserProfile['preferences']['units'] })}
                disabled={loading}
              >
                <Ionicons name={unit.icon as any} size={24} color={profile?.preferences?.units === unit.value ? '#fff' : '#666'} />
                <Text style={[
                  styles.optionText,
                  profile?.preferences?.units === unit.value && styles.selectedOptionText,
                ]}>{unit.label}</Text>
              </TouchableOpacity>
            ))}
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileText: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    marginLeft: 'auto',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FF6B00',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  languageButtonActive: {
    backgroundColor: '#FFF5EC',
    borderColor: '#FF6B00',
    borderWidth: 1,
  },
  languageButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: '#FF6B00',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
  subSettingText: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedLanguageButton: {
    backgroundColor: '#FF6B00',
  },
  selectedLanguageButtonText: {
    color: '#fff',
  },
}); 