import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from '../../types';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NOTIFICATION_STORAGE_KEY = '@notifications_token';

export const notificationService = {
  registerForPushNotifications: async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF6B00',
        });
      }

      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, token.data);
      return token.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      throw error;
    }
  },

  scheduleMealReminders: async (userProfile: UserProfile) => {
    if (!userProfile.preferences.notifications.meals) return;

    // Schedule breakfast reminder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Breakfast Time! 🍳',
        body: 'Start your day with a healthy breakfast',
        data: { type: 'meal', mealType: 'breakfast' },
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });

    // Schedule lunch reminder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lunch Break! 🥗',
        body: 'Time for your nutritious lunch',
        data: { type: 'meal', mealType: 'lunch' },
      },
      trigger: {
        hour: 13,
        minute: 0,
        repeats: true,
      },
    });

    // Schedule dinner reminder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Dinner Time! 🍽️',
        body: 'Enjoy your healthy dinner',
        data: { type: 'meal', mealType: 'dinner' },
      },
      trigger: {
        hour: 19,
        minute: 0,
        repeats: true,
      },
    });
  },

  scheduleWaterReminders: async (userProfile: UserProfile) => {
    if (!userProfile.preferences.notifications.water) return;

    // Schedule water reminders every 2 hours from 8 AM to 8 PM
    for (let hour = 8; hour <= 20; hour += 2) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Stay Hydrated! 💧',
          body: 'Time to drink some water',
          data: { type: 'water' },
        },
        trigger: {
          hour,
          minute: 0,
          repeats: true,
        },
      });
    }
  },

  scheduleActivityReminders: async (userProfile: UserProfile) => {
    if (!userProfile.preferences.notifications.activity) return;

    // Schedule morning activity reminder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Morning Activity! 🏃‍♂️',
        body: 'Start your day with some exercise',
        data: { type: 'activity', timing: 'morning' },
      },
      trigger: {
        hour: 7,
        minute: 0,
        repeats: true,
      },
    });

    // Schedule evening activity reminder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Evening Workout! 💪',
        body: 'Time for your daily exercise',
        data: { type: 'activity', timing: 'evening' },
      },
      trigger: {
        hour: 17,
        minute: 0,
        repeats: true,
      },
    });
  },

  cancelAllNotifications: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  updateNotificationSettings: async (userProfile: UserProfile) => {
    // Cancel all existing notifications
    await notificationService.cancelAllNotifications();

    // Reschedule notifications based on user preferences
    await Promise.all([
      notificationService.scheduleMealReminders(userProfile),
      notificationService.scheduleWaterReminders(userProfile),
      notificationService.scheduleActivityReminders(userProfile),
    ]);
  },
}; 