import { View, Text, ScrollView, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Meal {
  name: string;
  time: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: string[];
}

export default function MealPlanScreen() {
  const colorScheme = useColorScheme();
  const [selectedDay, setSelectedDay] = useState('Today');
  const [meals, setMeals] = useState<Meal[]>([
    {
      name: 'Breakfast',
      time: '8:00 AM',
      calories: 450,
      macros: {
        protein: 25,
        carbs: 45,
        fat: 15,
      },
      ingredients: ['Oatmeal', 'Banana', 'Almonds', 'Honey'],
    },
    {
      name: 'Lunch',
      time: '12:30 PM',
      calories: 650,
      macros: {
        protein: 35,
        carbs: 55,
        fat: 20,
      },
      ingredients: ['Grilled Chicken', 'Brown Rice', 'Broccoli', 'Olive Oil'],
    },
    {
      name: 'Dinner',
      time: '7:00 PM',
      calories: 550,
      macros: {
        protein: 30,
        carbs: 40,
        fat: 18,
      },
      ingredients: ['Salmon', 'Sweet Potato', 'Asparagus', 'Lemon'],
    },
  ]);

  const generateNewPlan = async () => {
    // TODO: Implement Gemini API integration
    // This will be implemented when we set up the Gemini API
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Meal Plan
          </Text>
          <TouchableOpacity onPress={generateNewPlan} style={styles.generateButton}>
            <Ionicons name="refresh-outline" size={24} color="#FF6B00" />
          </TouchableOpacity>
        </View>

        <View style={styles.daySelector}>
          {['Yesterday', 'Today', 'Tomorrow'].map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.selectedDay,
                { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' },
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: colorScheme === 'dark' ? '#fff' : '#000' },
                  selectedDay === day && styles.selectedDayText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.mealsContainer}>
          {meals.map((meal, index) => (
            <View
              key={index}
              style={[
                styles.mealCard,
                { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' },
              ]}
            >
              <View style={styles.mealHeader}>
                <Text style={[styles.mealName, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                  {meal.name}
                </Text>
                <Text style={[styles.mealTime, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                  {meal.time}
                </Text>
              </View>

              <LinearGradient
                colors={['#FF6B00', '#FF8533']}
                style={styles.caloriesBadge}
              >
                <Text style={styles.caloriesText}>{meal.calories} kcal</Text>
              </LinearGradient>

              <View style={styles.macrosContainer}>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroLabel, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                    Protein
                  </Text>
                  <Text style={[styles.macroValue, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                    {meal.macros.protein}g
                  </Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroLabel, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                    Carbs
                  </Text>
                  <Text style={[styles.macroValue, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                    {meal.macros.carbs}g
                  </Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroLabel, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                    Fat
                  </Text>
                  <Text style={[styles.macroValue, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                    {meal.macros.fat}g
                  </Text>
                </View>
              </View>

              <View style={styles.ingredientsContainer}>
                <Text style={[styles.ingredientsTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                  Ingredients:
                </Text>
                <View style={styles.ingredientsList}>
                  {meal.ingredients.map((ingredient, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.ingredientTag,
                        { backgroundColor: colorScheme === 'dark' ? '#333' : '#E0E0E0' },
                      ]}
                    >
                      <Text style={[styles.ingredientText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                        {ingredient}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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