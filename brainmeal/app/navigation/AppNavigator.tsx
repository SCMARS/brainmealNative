import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdvancedAnalytics from '../components/analytics/AdvancedAnalytics';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Analytics" 
        component={AdvancedAnalytics} 
      />
      {/* Другие экраны */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
