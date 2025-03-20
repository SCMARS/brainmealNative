import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiService } from './firestore';
import type { AIResponse, UserProfile, NutritionGoals } from '../../types';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface GenerateMealPlanParams {
  userProfile: UserProfile;
  nutritionGoals: NutritionGoals;
  date: Date;
  preferences?: {
    cuisine?: string;
    excludeIngredients?: string[];
  };
}

export const aiMealService = {
  generateMealPlan: async (params: GenerateMealPlanParams): Promise<AIResponse> => {
    const { userProfile, nutritionGoals, date, preferences } = params;

    const prompt = `
      Generate a detailed meal plan for a person with the following characteristics:
      - Age: ${userProfile.preferences.age}
      - Gender: ${userProfile.preferences.gender}
      - Weight: ${userProfile.preferences.weight}kg
      - Height: ${userProfile.preferences.height}cm
      - Activity Level: ${userProfile.preferences.activityLevel}
      - Goal: ${userProfile.preferences.goal}
      - Dietary Restrictions: ${userProfile.preferences.dietaryRestrictions.join(', ')}
      
      Nutrition Goals:
      - Daily Calories: ${nutritionGoals.dailyCalories}
      - Protein: ${nutritionGoals.macroSplit.protein}g
      - Carbs: ${nutritionGoals.macroSplit.carbs}g
      - Fat: ${nutritionGoals.macroSplit.fat}g
      
      ${preferences?.cuisine ? `Preferred Cuisine: ${preferences.cuisine}` : ''}
      ${preferences?.excludeIngredients ? `Exclude Ingredients: ${preferences.excludeIngredients.join(', ')}` : ''}
      
      Please provide a meal plan with:
      1. Breakfast
      2. Lunch
      3. Dinner
      4. 2 Snacks
      
      For each meal include:
      - Name
      - Ingredients
      - Calories
      - Macronutrients (protein, carbs, fat)
      - Brief preparation instructions
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const aiResponse: Omit<AIResponse, 'id'> = {
        userId: userProfile.id,
        query: prompt,
        response,
        type: 'meal_suggestion',
        createdAt: new Date(),
      };

      return await aiService.create(aiResponse);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw error;
    }
  },

  getNutritionAdvice: async (
    userProfile: UserProfile,
    question: string
  ): Promise<AIResponse> => {
    const prompt = `
      As a nutrition expert, please provide advice for a person with the following characteristics:
      - Age: ${userProfile.preferences.age}
      - Gender: ${userProfile.preferences.gender}
      - Weight: ${userProfile.preferences.weight}kg
      - Height: ${userProfile.preferences.height}cm
      - Activity Level: ${userProfile.preferences.activityLevel}
      - Goal: ${userProfile.preferences.goal}
      - Dietary Restrictions: ${userProfile.preferences.dietaryRestrictions.join(', ')}
      
      Question: ${question}
      
      Please provide detailed, science-based advice that takes into account the person's specific characteristics and goals.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const aiResponse: Omit<AIResponse, 'id'> = {
        userId: userProfile.id,
        query: prompt,
        response,
        type: 'nutrition_advice',
        createdAt: new Date(),
      };

      return await aiService.create(aiResponse);
    } catch (error) {
      console.error('Error getting nutrition advice:', error);
      throw error;
    }
  },

  getRecipeDetails: async (
    userProfile: UserProfile,
    recipe: string
  ): Promise<AIResponse> => {
    const prompt = `
      Please provide a detailed recipe that is suitable for a person with the following characteristics:
      - Goal: ${userProfile.preferences.goal}
      - Dietary Restrictions: ${userProfile.preferences.dietaryRestrictions.join(', ')}
      
      Recipe: ${recipe}
      
      Please include:
      1. Complete list of ingredients with measurements
      2. Step-by-step preparation instructions
      3. Nutritional information per serving:
         - Calories
         - Protein
         - Carbs
         - Fat
      4. Preparation time
      5. Cooking tips and variations
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const aiResponse: Omit<AIResponse, 'id'> = {
        userId: userProfile.id,
        query: prompt,
        response,
        type: 'recipe',
        createdAt: new Date(),
      };

      return await aiService.create(aiResponse);
    } catch (error) {
      console.error('Error getting recipe details:', error);
      throw error;
    }
  },
}; 