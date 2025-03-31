import { useNavigation } from '@react-navigation/native';
import AdvancedAnalytics from '../components/analytics/AdvancedAnalytics';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <AdvancedAnalytics />
    </View>
  );
} 