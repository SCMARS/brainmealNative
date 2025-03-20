import { View, Text, ScrollView, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const colorScheme = useColorScheme();

  const caloriesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [2100, 2300, 2000, 2200, 2400, 1900, 2100],
      },
    ],
  };

  const macrosData = [
    {
      name: 'Protein',
      population: 30,
      color: '#FF6B00',
      legendFontColor: colorScheme === 'dark' ? '#fff' : '#000',
    },
    {
      name: 'Carbs',
      population: 40,
      color: '#4CAF50',
      legendFontColor: colorScheme === 'dark' ? '#fff' : '#000',
    },
    {
      name: 'Fat',
      population: 30,
      color: '#2196F3',
      legendFontColor: colorScheme === 'dark' ? '#fff' : '#000',
    },
  ];

  const chartConfig = {
    backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff',
    backgroundGradientFrom: colorScheme === 'dark' ? '#1E1E1E' : '#fff',
    backgroundGradientTo: colorScheme === 'dark' ? '#1E1E1E' : '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${colorScheme === 'dark' ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Statistics
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Weekly Calories
          </Text>
          <View style={[styles.chartContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff' }]}>
            <LineChart
              data={caloriesData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Macro Distribution
          </Text>
          <View style={[styles.chartContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff' }]}>
            <PieChart
              data={macrosData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chart}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
            Weekly Summary
          </Text>
          <View style={styles.summaryContainer}>
            <View style={[styles.summaryCard, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
              <Text style={[styles.summaryTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Average Daily Calories
              </Text>
              <Text style={[styles.summaryValue, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                2,200
              </Text>
              <Text style={[styles.summarySubtitle, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                Target: 2,500
              </Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
              <Text style={[styles.summaryTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Water Intake
              </Text>
              <Text style={[styles.summaryValue, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                2.1L
              </Text>
              <Text style={[styles.summarySubtitle, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                Target: 2.5L
              </Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
              <Text style={[styles.summaryTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Activity Minutes
              </Text>
              <Text style={[styles.summaryValue, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                45
              </Text>
              <Text style={[styles.summarySubtitle, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                Target: 60
              </Text>
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
  header: {
    padding: 20,
  },
  title: {
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
  chartContainer: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summaryContainer: {
    gap: 15,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 15,
  },
  summaryTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summarySubtitle: {
    fontSize: 14,
  },
}); 