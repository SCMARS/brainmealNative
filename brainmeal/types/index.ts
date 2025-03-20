export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: {
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
    goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'vegan';
    dietaryRestrictions: string[];
    units: 'metric' | 'imperial';
    language: 'en' | 'uk';
    theme: 'light' | 'dark' | 'system';
    notifications: {
      meals: boolean;
      water: boolean;
      activity: boolean;
    };
  };
  subscription: {
    isPremium: boolean;
    expiresAt?: Date;
    plan?: 'monthly' | 'yearly';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPlan {
  id: string;
  userId: string;
  date: Date;
  meals: Meal[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  calories: number;
  macros: MacroNutrients;
  ingredients: string[];
  recipe?: string;
  image?: string;
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: Date;
  type: 'meal' | 'water' | 'activity' | 'weight' | 'note';
  title: string;
  description: string;
  value?: number;
  unit?: string;
  calories?: number;
  duration?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  date: Date;
  type: string;
  duration: number;
  calories: number;
  distance?: number;
  steps?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaterLog {
  id: string;
  userId: string;
  date: Date;
  amount: number;
  unit: 'ml' | 'oz';
  createdAt: Date;
}

export interface NutritionGoals {
  id: string;
  userId: string;
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  waterIntake: number;
  activityMinutes: number;
  updatedAt: Date;
}

export interface AIResponse {
  id: string;
  userId: string;
  query: string;
  response: string;
  type: 'meal_suggestion' | 'nutrition_advice' | 'recipe' | 'general';
  createdAt: Date;
}

export interface AppError {
  id: string;
  userId?: string;
  error: string;
  stack?: string;
  context?: any;
  createdAt: Date;
} 