import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

export default function MealPlan() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    type: 'breakfast',
    name: '',
    time: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    ingredients: [],
  });

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    if (!user) return;
    
    try {
      const q = query(collection(db, 'meals'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const loadedMeals = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Meal[];
      setMeals(loadedMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const handleAddMeal = async () => {
    if (!user) return;

    try {
      const mealData = {
        ...newMeal,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };
      
      await addDoc(collection(db, 'meals'), mealData);
      await loadMeals();
      setShowAddModal(false);
      setNewMeal({
        type: 'breakfast',
        name: '',
        time: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        ingredients: [],
      });
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const updateAchievements = async (totalProtein: number) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return;

      const userData = userDoc.data();
      const achievements = userData.achievements || [];

      // Update protein master achievement
      const proteinAchievement = achievements.find((a: any) => a.id === 'protein_master');
      if (proteinAchievement) {
        proteinAchievement.progress = Math.max(proteinAchievement.progress, totalProtein);
        if (proteinAchievement.progress >= proteinAchievement.total && !proteinAchievement.unlocked) {
          proteinAchievement.unlocked = true;
          proteinAchievement.dateUnlocked = new Date().toISOString();
          Alert.alert(
            'Achievement Unlocked! 🎉',
            'Protein Master: You reached 100g protein in a day!'
          );
        }
      }

      // Update meal planner achievement
      const mealPlannerAchievement = achievements.find((a: any) => a.id === 'meal_planner');
      if (mealPlannerAchievement) {
        mealPlannerAchievement.progress += 1;
        if (mealPlannerAchievement.progress >= mealPlannerAchievement.total && !mealPlannerAchievement.unlocked) {
          mealPlannerAchievement.unlocked = true;
          mealPlannerAchievement.dateUnlocked = new Date().toISOString();
          Alert.alert(
            'Achievement Unlocked! 🎉',
            'Meal Planner: You created 5 meal plans!'
          );
        }
      }

      // Update first meal achievement
      const firstMealAchievement = achievements.find((a: any) => a.id === 'first_meal');
      if (firstMealAchievement && !firstMealAchievement.unlocked) {
        firstMealAchievement.unlocked = true;
        firstMealAchievement.dateUnlocked = new Date().toISOString();
        Alert.alert(
          'Achievement Unlocked! 🎉',
          'First Meal: You tracked your first meal!'
        );
      }

      // Calculate total points
      const totalPoints = achievements.reduce((total: number, achievement: any) => 
        total + (achievement.unlocked ? achievement.points : 0), 0);

      // Update user document
      await updateDoc(doc(db, 'users', userId), {
        achievements,
        totalPoints,
        level: Math.floor(totalPoints / 100) + 1
      });
    } catch (error) {
      console.error('Error updating achievements:', error);
    }
  };

  const generateNewPlan = async () => {
    try {
      // TODO: Implement Gemini API integration
      // For now, we'll just update achievements with the current meal plan
      const totalProtein = meals.reduce((total, meal) => total + meal.protein, 0);
      await updateAchievements(totalProtein);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      Alert.alert('Error', 'Failed to generate meal plan. Please try again.');
    }
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'free-breakfast';
      case 'lunch':
        return 'restaurant';
      case 'dinner':
        return 'dinner-dining';
      case 'snack':
        return 'local-cafe';
      default:
        return 'restaurant';
    }
  };

  const getMealColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '#FFB74D';
      case 'lunch':
        return '#4CAF50';
      case 'dinner':
        return '#2196F3';
      case 'snack':
        return '#9C27B0';
      default:
        return '#666';
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-2xl font-bold text-white">План питания</Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className="bg-blue-500 p-2 rounded-full"
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {meals.map((meal) => (
          <View key={meal.id} className="bg-gray-800 m-2 p-4 rounded-lg">
            <View className="flex-row items-center">
              <MaterialIcons name={getMealIcon(meal.type)} size={24} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">{meal.name}</Text>
              <Text className="text-gray-400 ml-auto">{meal.time}</Text>
            </View>
            
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-400">Калории: {meal.calories}</Text>
              <Text className="text-gray-400">Белки: {meal.protein}g</Text>
              <Text className="text-gray-400">Углеводы: {meal.carbs}g</Text>
              <Text className="text-gray-400">Жиры: {meal.fat}g</Text>
            </View>

            <View className="mt-2">
              <Text className="text-gray-400">Ингредиенты:</Text>
              <Text className="text-white">{meal.ingredients.join(', ')}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-gray-800 rounded-t-3xl p-4">
            <Text className="text-white text-xl font-bold mb-4">Добавить прием пищи</Text>
            
            <View className="flex-row justify-between mb-4">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setNewMeal({ ...newMeal, type: type as Meal['type'] })}
                  className={`p-2 rounded-lg ${
                    newMeal.type === type ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                >
                  <MaterialIcons
                    name={getMealIcon(type)}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Название"
              placeholderTextColor="#9CA3AF"
              value={newMeal.name}
              onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
              className="bg-gray-700 text-white p-2 rounded-lg mb-2"
            />

            <TextInput
              placeholder="Время (например, 08:00)"
              placeholderTextColor="#9CA3AF"
              value={newMeal.time}
              onChangeText={(text) => setNewMeal({ ...newMeal, time: text })}
              className="bg-gray-700 text-white p-2 rounded-lg mb-2"
            />

            <View className="flex-row justify-between mb-2">
              <TextInput
                placeholder="Калории"
                placeholderTextColor="#9CA3AF"
                value={newMeal.calories?.toString()}
                onChangeText={(text) => setNewMeal({ ...newMeal, calories: Number(text) })}
                keyboardType="numeric"
                className="bg-gray-700 text-white p-2 rounded-lg flex-1 mr-1"
              />
              <TextInput
                placeholder="Белки"
                placeholderTextColor="#9CA3AF"
                value={newMeal.protein?.toString()}
                onChangeText={(text) => setNewMeal({ ...newMeal, protein: Number(text) })}
                keyboardType="numeric"
                className="bg-gray-700 text-white p-2 rounded-lg flex-1 ml-1"
              />
            </View>

            <View className="flex-row justify-between mb-2">
              <TextInput
                placeholder="Углеводы"
                placeholderTextColor="#9CA3AF"
                value={newMeal.carbs?.toString()}
                onChangeText={(text) => setNewMeal({ ...newMeal, carbs: Number(text) })}
                keyboardType="numeric"
                className="bg-gray-700 text-white p-2 rounded-lg flex-1 mr-1"
              />
              <TextInput
                placeholder="Жиры"
                placeholderTextColor="#9CA3AF"
                value={newMeal.fat?.toString()}
                onChangeText={(text) => setNewMeal({ ...newMeal, fat: Number(text) })}
                keyboardType="numeric"
                className="bg-gray-700 text-white p-2 rounded-lg flex-1 ml-1"
              />
            </View>

            <TextInput
              placeholder="Ингредиенты (через запятую)"
              placeholderTextColor="#9CA3AF"
              value={newMeal.ingredients?.join(', ')}
              onChangeText={(text) => setNewMeal({ ...newMeal, ingredients: text.split(',').map(i => i.trim()) })}
              className="bg-gray-700 text-white p-2 rounded-lg mb-4"
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="bg-gray-700 p-3 rounded-lg flex-1 mr-2"
              >
                <Text className="text-white text-center">Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddMeal}
                className="bg-blue-500 p-3 rounded-lg flex-1 ml-2"
              >
                <Text className="text-white text-center">Добавить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  generateButton: {
    padding: 8,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#FF6B00',
  },
  dayText: {
    fontSize: 16,
  },
  selectedDayText: {
    color: '#fff',
  },
  mealsContainer: {
    padding: 20,
  },
  mealCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
  },
  mealTime: {
    fontSize: 14,
  },
  caloriesBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  caloriesText: {
    color: '#fff',
    fontWeight: '600',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  ingredientsContainer: {
    marginTop: 10,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ingredientText: {
    fontSize: 14,
  },
}); 