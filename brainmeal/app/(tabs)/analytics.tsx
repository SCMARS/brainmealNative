import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week'); // 'week' | 'month' | 'year'
  const [selectedMetric, setSelectedMetric] = useState('calories'); // 'calories' | 'protein' | 'water'

  const chartData = {
    week: {
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      datasets: [{
        data: [1800, 2000, 1950, 1850, 2100, 1900, 2000],
      }]
    },
    month: {
      labels: ['1н', '2н', '3н', '4н'],
      datasets: [{
        data: [1900, 1950, 2000, 1850],
      }]
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Переключатель периода */}
      <View style={styles.timeRangeSelector}>
        <TouchableOpacity 
          style={[styles.timeRangeButton, timeRange === 'week' && styles.timeRangeButtonActive]}
          onPress={() => setTimeRange('week')}
        >
          <Text style={[styles.timeRangeText, timeRange === 'week' && styles.timeRangeTextActive]}>
            Неделя
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeRangeButton, timeRange === 'month' && styles.timeRangeButtonActive]}
          onPress={() => setTimeRange('month')}
        >
          <Text style={[styles.timeRangeText, timeRange === 'month' && styles.timeRangeTextActive]}>
            Месяц
          </Text>
        </TouchableOpacity>
      </View>

      {/* Основные метрики */}
      <View style={styles.metricsContainer}>
        <MetricCard
          title="Калории"
          value="1,850"
          target="2,000"
          icon="local-fire-department"
          percentage={85}
          isSelected={selectedMetric === 'calories'}
          onPress={() => setSelectedMetric('calories')}
        />
        <MetricCard
          title="Белок"
          value="82"
          target="100"
          icon="fitness-center"
          percentage={82}
          isSelected={selectedMetric === 'protein'}
          onPress={() => setSelectedMetric('protein')}
        />
        <MetricCard
          title="Вода"
          value="2.1"
          target="2.5"
          icon="water-drop"
          percentage={84}
          isSelected={selectedMetric === 'water'}
          onPress={() => setSelectedMetric('water')}
        />
      </View>

      {/* График */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Динамика показателей</Text>
        <LineChart
          data={chartData[timeRange]}
          width={width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#FF6B00"
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Достижения */}
      <View style={styles.achievementsCard}>
        <Text style={styles.sectionTitle}>Достижения недели</Text>
        <View style={styles.achievementsGrid}>
          <AchievementItem
            icon="star"
            title="Цель по калориям"
            subtitle="5 дней подряд"
          />
          <AchievementItem
            icon="emoji-events"
            title="Белковая цель"
            subtitle="3 дня подряд"
          />
          <AchievementItem
            icon="local-fire-department"
            title="Сожжено калорий"
            subtitle="10000 ккал"
          />
        </View>
      </View>

      {/* Рекомендации */}
      <View style={styles.recommendationsCard}>
        <Text style={styles.sectionTitle}>Рекомендации ИИ</Text>
        <RecommendationItem
          icon="trending-up"
          title="Увеличьте белок"
          description="Добавьте 20г белка для лучших результатов"
          actionText="Подробнее"
        />
        <RecommendationItem
          icon="schedule"
          title="Оптимальное время приема пищи"
          description="Рекомендуется обедать раньше"
          actionText="Настроить"
        />
      </View>
    </ScrollView>
  );
}

// Компонент карточки метрики
const MetricCard = ({ title, value, target, icon, percentage, isSelected, onPress }) => (
  <TouchableOpacity 
    style={[styles.metricCard, isSelected && styles.metricCardSelected]} 
    onPress={onPress}
  >
    <MaterialIcons name={icon} size={24} color={isSelected ? '#FF6B00' : '#666'} />
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricTarget}>из {target}</Text>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${percentage}%` }]} />
    </View>
  </TouchableOpacity>
);

// Компонент достижения
const AchievementItem = ({ icon, title, subtitle }) => (
  <View style={styles.achievementItem}>
    <View style={styles.achievementIcon}>
      <MaterialIcons name={icon} size={24} color="#FF6B00" />
    </View>
    <Text style={styles.achievementTitle}>{title}</Text>
    <Text style={styles.achievementSubtitle}>{subtitle}</Text>
  </View>
);

// Компонент рекомендации
const RecommendationItem = ({ icon, title, description, actionText }) => (
  <View style={styles.recommendationItem}>
    <MaterialIcons name={icon} size={24} color="#FF6B00" />
    <View style={styles.recommendationContent}>
      <View style={styles.recommendationText}>
        <Text style={styles.recommendationTitle}>{title}</Text>
        <Text style={styles.recommendationDescription}>{description}</Text>
      </View>
      <TouchableOpacity style={styles.recommendationAction}>
        <Text style={styles.recommendationActionText}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: '#FF6B00',
  },
  timeRangeText: {
    color: '#666',
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#FFFFFF',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    width: width / 3.5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricCardSelected: {
    backgroundColor: '#FFF5EC',
    borderColor: '#FF6B00',
    borderWidth: 1,
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  metricTarget: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 2,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  achievementsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementItem: {
    alignItems: 'center',
    width: width / 3.5,
  },
  achievementIcon: {
    backgroundColor: '#FFF5EC',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  recommendationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recommendationContent: {
    flex: 1,
    marginLeft: 12,
  },
  recommendationText: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  recommendationAction: {
    marginTop: 8,
  },
  recommendationActionText: {
    color: '#FF6B00',
    fontWeight: '500',
  },
}); 