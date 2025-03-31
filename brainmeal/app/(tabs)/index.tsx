import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Приветствие */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Привет, Пользователь! 👋</Text>
        <Text style={styles.subtitle}>Готовы к здоровому питанию?</Text>
      </View>

      {/* Карточка прогресса */}
      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>Ваш прогресс сегодня</Text>
        <View style={styles.progressStats}>
          <View style={styles.stat}>
            <MaterialIcons name="local-fire-department" size={24} color="#FF6B00" />
            <Text style={styles.statValue}>1200</Text>
            <Text style={styles.statLabel}>ккал</Text>
          </View>
          <View style={styles.stat}>
            <MaterialIcons name="fitness-center" size={24} color="#FF6B00" />
            <Text style={styles.statValue}>65g</Text>
            <Text style={styles.statLabel}>белка</Text>
          </View>
          <View style={styles.stat}>
            <MaterialIcons name="water-drop" size={24} color="#FF6B00" />
            <Text style={styles.statValue}>1.5L</Text>
            <Text style={styles.statLabel}>воды</Text>
          </View>
        </View>
      </View>

      {/* Быстрые действия */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard}>
          <MaterialIcons name="restaurant-menu" size={32} color="#FF6B00" />
          <Text style={styles.actionText}>План питания</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <MaterialIcons name="camera-alt" size={32} color="#FF6B00" />
          <Text style={styles.actionText}>Измерить порцию</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <MaterialIcons name="analytics" size={32} color="#FF6B00" />
          <Text style={styles.actionText}>Аналитика</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <MaterialIcons name="emoji-events" size={32} color="#FF6B00" />
          <Text style={styles.actionText}>Достижения</Text>
        </TouchableOpacity>
      </View>

      {/* Рекомендации */}
      <View style={styles.recommendationsSection}>
        <Text style={styles.sectionTitle}>Рекомендации</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Советы по питанию</Text>
            <Text style={styles.recommendationText}>
              Попробуйте добавить больше белка в свой рацион
            </Text>
          </View>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Напоминание</Text>
            <Text style={styles.recommendationText}>
              Не забудьте выпить воды
            </Text>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  progressCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    color: '#666',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  actionCard: {
    backgroundColor: '#fff',
    width: '47%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 10,
    fontWeight: '500',
  },
  recommendationsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recommendationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: 250,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationText: {
    color: '#666',
  },
}); 