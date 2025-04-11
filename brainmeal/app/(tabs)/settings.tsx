import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { userProfileService } from '../services/firestore';
import notificationService from '../services/notifications';
import type { UserProfile } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';

// Add type definitions for NativeWind
declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface SafeAreaViewProps {
    className?: string;
  }
}

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
    { id: 'balanced' as const, name: 'Сбалансированное' },
    { id: 'low-carb' as const, name: 'Низкоуглеводное' },
    { id: 'high-protein' as const, name: 'Высокобелковое' },
    { id: 'vegetarian' as const, name: 'Вегетарианское' },
    { id: 'vegan' as const, name: 'Веганское' }
  ];

  const loadProfile = useCallback(async () => {
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
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile['preferences']>) => {
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
  }, [user, profile]);

  const handleGoalUpdate = useCallback(async (field: string, value: string) => {
    if (!user || !profile) return;
    try {
      setLoading(true);
      const updatedGoals = {
        ...profile.goals,
        [field]: Number(value),
      };
      await userProfileService.update(user.uid, {
        goals: updatedGoals,
        updatedAt: new Date(),
      });
      setProfile({
        ...profile,
        goals: updatedGoals,
      });
    } catch (error) {
      console.error('Error updating goals:', error);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  const handleDietTypeUpdate = useCallback(async (type: UserProfile['preferences']['dietType']) => {
    if (!user || !profile) return;
    try {
      setLoading(true);
      await userProfileService.update(user.uid, {
        preferences: {
          ...profile.preferences,
          dietType: type,
        },
        updatedAt: new Date(),
      });
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          dietType: type,
        },
      });
    } catch (error) {
      console.error('Error updating diet type:', error);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-text">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        {/* Профиль */}
        <View className="bg-primary p-5 rounded-b-3xl">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-white justify-center items-center">
              <Text className="text-primary font-bold text-lg">ИП</Text>
            </View>
            <View className="ml-3">
              <Text className="text-white font-bold text-lg">Иван Петров</Text>
              <Text className="text-white/80">ivan@example.com</Text>
            </View>
          </View>
          <TouchableOpacity className="mt-4 bg-white/20 rounded-lg p-3">
            <Text className="text-white text-center font-bold">Редактировать профиль</Text>
          </TouchableOpacity>
        </View>

        {/* Основные настройки */}
        <View className="p-5">
          <Text className="text-xl font-bold text-text mb-4">Основные настройки</Text>
          
          <View className="flex-row justify-between items-center p-4 bg-white rounded-lg mb-2">
            <View className="flex-row items-center">
              <MaterialIcons name="notifications" size={24} color="#666" />
              <Text className="ml-3 text-text">Уведомления</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#FF6B00' }}
            />
          </View>

          <View className="flex-row justify-between items-center p-4 bg-white rounded-lg mb-2">
            <View className="flex-row items-center">
              <MaterialIcons name="dark-mode" size={24} color="#666" />
              <Text className="ml-3 text-text">Темная тема</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#FF6B00' }}
            />
          </View>

          <View className="p-4 bg-white rounded-lg">
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="language" size={24} color="#666" />
              <Text className="ml-3 text-text">Язык</Text>
            </View>
            <View className="flex-row space-x-2">
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  className={`px-3 py-2 rounded-lg ${
                    language === lang.value ? 'bg-primary' : 'bg-gray-100'
                  }`}
                  onPress={() => setLanguage(lang.value)}
                >
                  <Text className={`${
                    language === lang.value ? 'text-white' : 'text-text-light'
                  }`}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Уведомления */}
        <View className="p-5">
          <Text className="text-xl font-bold text-text mb-4">Уведомления</Text>
          <View className="bg-white rounded-lg overflow-hidden">
            {profile?.preferences?.notifications && (
              <>
                <View className="flex-row justify-between items-center p-4 border-b border-border">
                  <Text className="text-text">Напоминания о еде</Text>
                  <Switch
                    value={profile.preferences.notifications.meals}
                    onValueChange={(value) => updateProfile({
                      notifications: { ...profile.preferences.notifications, meals: value },
                    })}
                    trackColor={{ false: '#767577', true: '#FF6B00' }}
                    disabled={loading}
                  />
                </View>

                <View className="flex-row justify-between items-center p-4">
                  <Text className="text-text">Напоминания о воде</Text>
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
        <View className="p-5">
          <Text className="text-xl font-bold text-text mb-4">Единицы измерения</Text>
          <View className="flex-row flex-wrap gap-2">
            {units.map((unit) => (
              <TouchableOpacity
                key={unit.value}
                className={`flex-1 min-w-[45%] p-4 rounded-lg flex-row items-center justify-center ${
                  profile?.preferences?.units === unit.value ? 'bg-primary' : 'bg-white'
                }`}
                onPress={() => updateProfile({ units: unit.value as UserProfile['preferences']['units'] })}
                disabled={loading}
              >
                <Ionicons 
                  name={unit.icon as any} 
                  size={24} 
                  color={profile?.preferences?.units === unit.value ? '#fff' : '#666'} 
                />
                <Text className={`ml-2 ${
                  profile?.preferences?.units === unit.value ? 'text-white' : 'text-text-light'
                }`}>{unit.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Цели */}
        <View className="p-5">
          <Text className="text-xl font-bold text-text mb-4">Цели</Text>
          <View className="bg-white rounded-lg p-4 space-y-4">
            <View>
              <Text className="text-text mb-2">Калории (ккал)</Text>
              <TextInput
                className="border border-border rounded-lg p-3"
                value={profile?.goals?.calories?.toString() || ''}
                onChangeText={(value) => handleGoalUpdate('calories', value)}
                keyboardType="numeric"
                placeholder="Введите цель по калориям"
              />
            </View>
            <View>
              <Text className="text-text mb-2">Белок (г)</Text>
              <TextInput
                className="border border-border rounded-lg p-3"
                value={profile?.goals?.protein?.toString() || ''}
                onChangeText={(value) => handleGoalUpdate('protein', value)}
                keyboardType="numeric"
                placeholder="Введите цель по белку"
              />
            </View>
            <View>
              <Text className="text-text mb-2">Вода (л)</Text>
              <TextInput
                className="border border-border rounded-lg p-3"
                value={profile?.goals?.water?.toString() || ''}
                onChangeText={(value) => handleGoalUpdate('water', value)}
                keyboardType="numeric"
                placeholder="Введите цель по воде"
              />
            </View>
          </View>
        </View>

        {/* Тип питания */}
        <View className="p-5">
          <Text className="text-xl font-bold text-text mb-4">Тип питания</Text>
          <View className="flex-row flex-wrap gap-2">
            {dietTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                className={`flex-1 min-w-[45%] p-4 rounded-lg flex-row items-center justify-center ${
                  profile?.preferences?.dietType === type.id ? 'bg-primary' : 'bg-white'
                }`}
                onPress={() => handleDietTypeUpdate(type.id)}
                disabled={loading}
              >
                <Text className={`${
                  profile?.preferences?.dietType === type.id ? 'text-white' : 'text-text-light'
                }`}>{type.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Исключенные ингредиенты */}
        <View className="p-5">
          <Text className="text-xl font-bold text-text mb-4">Исключенные ингредиенты</Text>
          <View className="bg-white rounded-lg p-4">
            <TextInput
              className="border border-border rounded-lg p-3"
              placeholder="Введите ингредиенты через запятую"
              value={profile?.preferences?.excludedIngredients?.join(', ') || ''}
              onChangeText={(value) => {
                const ingredients = value.split(',').map(item => item.trim());
                if (profile) {
                  updateProfile({ excludedIngredients: ingredients });
                }
              }}
            />
          </View>
        </View>

        {/* Дополнительные настройки */}
        <View className="p-5">
          <Text className="text-xl font-bold text-text mb-4">Дополнительные настройки</Text>
          <View className="bg-white rounded-lg overflow-hidden">
            <View className="flex-row justify-between items-center p-4 border-b border-border">
              <Text className="text-text">Напоминания о воде</Text>
              <Switch
                value={profile?.preferences?.notifications?.water || false}
                onValueChange={(value) => updateProfile({
                  notifications: { ...profile?.preferences?.notifications, water: value }
                })}
                trackColor={{ false: '#767577', true: '#FF6B00' }}
                disabled={loading}
              />
            </View>
            <View className="flex-row justify-between items-center p-4">
              <Text className="text-text">Обновления прогресса</Text>
              <Switch
                value={profile?.preferences?.notifications?.progress || false}
                onValueChange={(value) => updateProfile({
                  notifications: { ...profile?.preferences?.notifications, progress: value }
                })}
                trackColor={{ false: '#767577', true: '#FF6B00' }}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 