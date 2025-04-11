import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter, type Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { userProfileService } from '../services/firestore';
import type { UserProfile } from '../../types';

type QuickAction = {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: Href<string>;
};

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const userProfile = await userProfileService.get(user.uid);
        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const quickActions: QuickAction[] = [
    {
      title: 'Дневник питания',
      icon: 'restaurant',
      route: '/(tabs)/journal' as Href<string>,
    },
    {
      title: 'План питания',
      icon: 'event-note',
      route: '/(tabs)/meal-plan' as Href<string>,
    },
    {
      title: 'Достижения',
      icon: 'emoji-events',
      route: '/(tabs)/achievements' as Href<string>,
    },
    {
      title: 'Статистика',
      icon: 'bar-chart',
      route: '/(tabs)/stats' as Href<string>,
    },
  ];

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Приветствие */}
      <View className="p-5 bg-white">
        <Text className="text-2xl font-bold text-gray-800">
          Привет, {profile?.displayName || 'Пользователь'}! 👋
        </Text>
        <Text className="text-gray-600 mt-1">
          Готовы к здоровому питанию?
        </Text>
      </View>

      {/* Карточка прогресса */}
      <View className="m-4 p-5 bg-white rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Ваш прогресс сегодня
        </Text>
        <View className="flex-row justify-around">
          <View className="items-center">
            <MaterialIcons name="local-fire-department" size={24} color="#FF6B00" />
            <Text className="text-lg font-bold mt-1">
              {profile?.goals?.calories || 0}
            </Text>
            <Text className="text-gray-600">ккал</Text>
          </View>
          <View className="items-center">
            <MaterialIcons name="fitness-center" size={24} color="#FF6B00" />
            <Text className="text-lg font-bold mt-1">
              {profile?.goals?.protein || 0}g
            </Text>
            <Text className="text-gray-600">белка</Text>
          </View>
          <View className="items-center">
            <MaterialIcons name="water-drop" size={24} color="#FF6B00" />
            <Text className="text-lg font-bold mt-1">
              {profile?.goals?.water || 0}L
            </Text>
            <Text className="text-gray-600">воды</Text>
          </View>
        </View>
      </View>

      {/* Быстрые действия */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Быстрые действия
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.title}
              className="w-[48%] p-4 bg-white rounded-xl shadow-sm mb-4 items-center"
              onPress={() => router.push(action.route)}
            >
              <MaterialIcons name={action.icon} size={32} color="#FF6B00" />
              <Text className="text-gray-800 mt-2 text-center font-medium">
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Рекомендации */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Рекомендации
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="mr-4 p-4 bg-white rounded-xl shadow-sm w-64">
            <Text className="font-bold text-gray-800 mb-2">
              План питания
            </Text>
            <Text className="text-gray-600">
              Сгенерируйте персональный план питания на основе ваших целей
            </Text>
            <TouchableOpacity
              className="mt-3 bg-orange-100 p-2 rounded-lg"
              onPress={() => router.push('/(tabs)/meal-plan')}
            >
              <Text className="text-orange-600 text-center font-medium">
                Создать план
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mr-4 p-4 bg-white rounded-xl shadow-sm w-64">
            <Text className="font-bold text-gray-800 mb-2">
              Аналитика
            </Text>
            <Text className="text-gray-600">
              Просмотрите вашу статистику и прогресс
            </Text>
            <TouchableOpacity
              className="mt-3 bg-orange-100 p-2 rounded-lg"
              onPress={() => router.push('/(tabs)/analytics')}
            >
              <Text className="text-orange-600 text-center font-medium">
                Смотреть
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
} 