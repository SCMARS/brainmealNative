import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface AnalyticsProps {
  mealPlanData: any;
  userStats: any;
}

interface StatItemProps {
  icon: string;
  title: string;
  value: string;
  trend: 'positive' | 'negative' | 'neutral';
}

const StatItem: React.FC<StatItemProps> = ({ icon, title, value, trend }) => (
  <View style={styles.statItem}>
    <MaterialIcons 
      name={icon as any} 
      size={24} 
      color="#FF6B00" 
    />
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
    {trend !== 'neutral' && (
      <MaterialIcons 
        name={trend === 'positive' ? 'arrow-upward' : 'arrow-downward'} 
        size={16} 
        color={trend === 'positive' ? '#4CAF50' : '#F44336'} 
      />
    )}
  </View>
);

const ProgressCircle = ({ percentage }: { percentage: number }) => (
  <View style={styles.progressCircle}>
    <View style={styles.progressInner}>
      <Text style={styles.progressText}>{percentage}%</Text>
    </View>
  </View>
);

export const AdvancedAnalytics: React.FC<AnalyticsProps> = ({ mealPlanData, userStats }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Карточка общего прогресса */}
      <View style={styles.progressCard}>
        <LinearGradient
          colors={['#FF6B00', '#FF8E3C']}
          style={styles.gradientHeader}
        >
          <Text style={styles.headerTitle}>Прогресс к цели</Text>
          <ProgressCircle percentage={75} />
        </LinearGradient>
        
        <View style={styles.statsGrid}>
          <StatItem
            icon="trending-up"
            title="Прогресс веса"
            value="-2.5 кг"
            trend="positive"
          />
          <StatItem
            icon="fitness-center"
            title="Белок"
            value="82%"
            trend="neutral"
          />
          <StatItem
            icon="local-fire-department"
            title="Калории"
            value="1850/2000"
            trend="positive"
          />
          <StatItem
            icon="water-drop"
            title="Вода"
            value="2.1/2.5л"
            trend="neutral"
          />
        </View>
      </View>

      {/* График трендов */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Тренды питания</Text>
        <LineChart
          data={{
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            datasets: [
              {
                data: [2100, 1950, 2000, 2200, 1800, 2300, 2000],
                color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
                strokeWidth: 2
              }
            ]
          }}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#1E1E1E',
            backgroundGradientFrom: '#1E1E1E',
            backgroundGradientTo: '#1E1E1E',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#FF6B00'
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Распределение макронутриентов */}
      <View style={styles.macrosCard}>
        <Text style={styles.chartTitle}>Макронутриенты</Text>
        <PieChart
          data={[
            {
              name: 'Белки',
              population: 30,
              color: '#FF6B00',
              legendFontColor: '#FFF',
            },
            {
              name: 'Жиры',
              population: 25,
              color: '#FF8E3C',
              legendFontColor: '#FFF',
            },
            {
              name: 'Углеводы',
              population: 45,
              color: '#FFA764',
              legendFontColor: '#FFF',
            },
          ]}
          width={width - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

      {/* Анализ приемов пищи */}
      <View style={styles.mealAnalysisCard}>
        <Text style={styles.chartTitle}>Анализ приемов пищи</Text>
        <BarChart
          data={{
            labels: ['Завтрак', 'Обед', 'Ужин', 'Перекусы'],
            datasets: [{
              data: [500, 800, 600, 300]
            }]
          }}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#1E1E1E',
            backgroundGradientFrom: '#1E1E1E',
            backgroundGradientTo: '#1E1E1E',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>

      {/* Рекомендации */}
      <View style={styles.recommendationsCard}>
        <Text style={styles.chartTitle}>Рекомендации AI</Text>
        <RecommendationItem
          icon="trending-up"
          title="Увеличьте потребление белка"
          description="Для достижения целей рекомендуется увеличить потребление белка на 20г"
        />
        <RecommendationItem
          icon="schedule"
          title="Оптимальное время приема пищи"
          description="Перенесите ужин на более раннее время для лучшего усвоения"
        />
      </View>
    </ScrollView>
  );
};

const RecommendationItem = ({ icon, title, description }) => (
  <View style={styles.recommendationItem}>
    <MaterialIcons name={icon} size={24} color="#FF6B00" />
    <View style={styles.recommendationText}>
      <Text style={styles.recommendationTitle}>{title}</Text>
      <Text style={styles.recommendationDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  progressCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
    overflow: 'hidden',
  },
  gradientHeader: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statItem: {
    width: '50%',
    padding: 10,
    alignItems: 'center',
  },
  statTitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  statValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  chartTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  macrosCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  mealAnalysisCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  recommendationsCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  recommendationText: {
    marginLeft: 10,
    flex: 1,
  },
  recommendationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recommendationDescription: {
    color: '#666',
    fontSize: 14,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 15,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AdvancedAnalytics; 