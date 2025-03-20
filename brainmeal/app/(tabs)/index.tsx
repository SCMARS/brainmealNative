import { View, Text, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Welcome back, {user?.displayName || 'User'}!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Today's Overview
          </Text>
          
          <View style={styles.cardsContainer}>
            <LinearGradient
              colors={['#FF6B00', '#FF8533']}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>Calories</Text>
              <Text style={styles.cardValue}>2,100</Text>
              <Text style={styles.cardSubtitle}>of 2,500 kcal</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#4CAF50', '#81C784']}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>Water</Text>
              <Text style={styles.cardValue}>1.5L</Text>
              <Text style={styles.cardSubtitle}>of 2.5L</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#2196F3', '#64B5F6']}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>Activity</Text>
              <Text style={styles.cardValue}>45min</Text>
              <Text style={styles.cardSubtitle}>of 60min</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Next Meal
          </Text>
          <View style={[styles.mealCard, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
            <Text style={[styles.mealTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              Lunch
            </Text>
            <Text style={[styles.mealTime, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
              12:30 PM
            </Text>
            <Text style={[styles.mealDescription, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              Grilled Chicken Salad with Avocado
            </Text>
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
  header: {
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  cardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 12,
  },
  mealCard: {
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  mealTime: {
    fontSize: 14,
    marginBottom: 5,
  },
  mealDescription: {
    fontSize: 16,
  },
}); 