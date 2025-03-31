import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdvancedAnalytics from '../components/analytics/AdvancedAnalytics';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      {/* ... other tabs ... */}
      <Tab.Screen
        name="Analytics"
        component={AdvancedAnalytics}
        options={{
          tabBarLabel: 'Аналитика',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="analytics" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
} 