import { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { userProfileService } from '../services/firestore';
import type { UserProfile } from '../../types';

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'light', label: 'Light (exercise 1-3 times/week)' },
  { value: 'moderate', label: 'Moderate (exercise 3-5 times/week)' },
  { value: 'very', label: 'Very Active (exercise 6-7 times/week)' },
  { value: 'extra', label: 'Extra Active (very active & physical job)' },
];

const goals = [
  { value: 'weight_loss', label: 'Weight Loss', icon: 'trending-down' },
  { value: 'muscle_gain', label: 'Muscle Gain', icon: 'barbell' },
  { value: 'maintenance', label: 'Maintenance', icon: 'fitness' },
  { value: 'vegan', label: 'Vegan Lifestyle', icon: 'leaf' },
];

export default function Onboarding() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    email: user?.email || '',
    displayName: user?.displayName || '',
    preferences: {
      height: 170,
      weight: 70,
      age: 25,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintenance',
      dietaryRestrictions: [],
      units: 'metric',
      language: 'en',
      theme: 'system',
      notifications: {
        meals: true,
        water: true,
        activity: true,
      },
    },
    subscription: {
      isPremium: false,
    },
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await userProfileService.create({
        ...profile,
        id: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserProfile);
      router.replace('/');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              Welcome to BrainMeal! 👋
            </Text>
            <Text style={[styles.stepDescription, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
              Let's personalize your experience. We'll need some basic information to create your custom meal plans and track your progress.
            </Text>
            <View style={styles.form}>
              <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
                <TextInput
                  style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
                  placeholder="Full Name"
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                  value={profile.displayName}
                  onChangeText={(text) => setProfile({ ...profile, displayName: text })}
                />
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              Physical Details 📏
            </Text>
            <View style={styles.form}>
              <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
                <TextInput
                  style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
                  placeholder="Age"
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                  keyboardType="numeric"
                  value={profile.preferences?.age?.toString()}
                  onChangeText={(text) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences!,
                      age: parseInt(text) || 0,
                    },
                  })}
                />
              </View>
              <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
                <TextInput
                  style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
                  placeholder="Height (cm)"
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                  keyboardType="numeric"
                  value={profile.preferences?.height?.toString()}
                  onChangeText={(text) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences!,
                      height: parseInt(text) || 0,
                    },
                  })}
                />
              </View>
              <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
                <TextInput
                  style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
                  placeholder="Weight (kg)"
                  placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                  keyboardType="numeric"
                  value={profile.preferences?.weight?.toString()}
                  onChangeText={(text) => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences!,
                      weight: parseInt(text) || 0,
                    },
                  })}
                />
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              Activity Level 🏃‍♂️
            </Text>
            <View style={styles.activityContainer}>
              {activityLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.activityButton,
                    { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' },
                    profile.preferences?.activityLevel === level.value && styles.selectedActivity,
                  ]}
                  onPress={() => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences!,
                      activityLevel: level.value as UserProfile['preferences']['activityLevel'],
                    },
                  })}
                >
                  <Text
                    style={[
                      styles.activityText,
                      { color: colorScheme === 'dark' ? '#fff' : '#000' },
                      profile.preferences?.activityLevel === level.value && styles.selectedActivityText,
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              Your Goal 🎯
            </Text>
            <View style={styles.goalsContainer}>
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.value}
                  style={[
                    styles.goalButton,
                    { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' },
                    profile.preferences?.goal === goal.value && styles.selectedGoal,
                  ]}
                  onPress={() => setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences!,
                      goal: goal.value as UserProfile['preferences']['goal'],
                    },
                  })}
                >
                  <Ionicons
                    name={goal.icon as any}
                    size={24}
                    color={profile.preferences?.goal === goal.value ? '#fff' : (colorScheme === 'dark' ? '#fff' : '#000')}
                  />
                  <Text
                    style={[
                      styles.goalText,
                      { color: colorScheme === 'dark' ? '#fff' : '#000' },
                      profile.preferences?.goal === goal.value && styles.selectedGoalText,
                    ]}
                  >
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progress}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                { backgroundColor: colorScheme === 'dark' ? '#333' : '#ddd' },
                i === step && styles.activeProgressDot,
              ]}
            />
          ))}
        </View>

        {renderStep()}

        <View style={styles.buttons}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={handleBack}
            >
              <Text style={[styles.buttonText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                Back
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.nextButton, { opacity: loading ? 0.5 : 1 }]}
            onPress={handleNext}
            disabled={loading}
          >
            <LinearGradient
              colors={['#FF6B00', '#FF8533']}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {step === 4 ? (loading ? 'Creating Profile...' : 'Complete') : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeProgressDot: {
    backgroundColor: '#FF6B00',
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    gap: 15,
  },
  inputContainer: {
    borderRadius: 12,
    padding: 15,
  },
  input: {
    fontSize: 16,
  },
  activityContainer: {
    gap: 10,
  },
  activityButton: {
    borderRadius: 12,
    padding: 15,
  },
  selectedActivity: {
    backgroundColor: '#FF6B00',
  },
  activityText: {
    fontSize: 16,
  },
  selectedActivityText: {
    color: '#fff',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  goalButton: {
    width: '45%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  selectedGoal: {
    backgroundColor: '#FF6B00',
  },
  goalText: {
    fontSize: 16,
    marginTop: 10,
  },
  selectedGoalText: {
    color: '#fff',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  backButton: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
  },
  nextButton: {
    borderRadius: 12,
  },
  nextButtonGradient: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 