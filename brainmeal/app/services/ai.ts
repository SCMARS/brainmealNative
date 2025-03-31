import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiService } from './firestore';
import type { AIResponse, UserProfile, NutritionGoals } from '../../types';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

interface GenerateMealPlanParams {
  userProfile: UserProfile;
  nutritionGoals: NutritionGoals;
  date: Date;
  preferences?: {
    cuisine?: string;
    excludeIngredients?: string[];
  };
}

export const AIService = {
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

  generateQuickMealPlan: async (userProfile: UserProfile): Promise<AIResponse> => {
    const prompt = `
      Generate a quick and simple meal plan for today considering the following profile:
      - Age: ${userProfile.preferences.age}
      - Gender: ${userProfile.preferences.gender}
      - Weight: ${userProfile.preferences.weight}kg
      - Height: ${userProfile.preferences.height}cm
      - Activity Level: ${userProfile.preferences.activityLevel}
      - Goal: ${userProfile.preferences.goal}
      - Dietary Restrictions: ${userProfile.preferences.dietaryRestrictions.join(', ')}
      
      Please provide:
      1. Three main meals (breakfast, lunch, dinner)
      2. Two healthy snacks
      3. Total daily:
         - Calories
         - Protein
         - Carbs
         - Fat
      
      Format the response in an easy-to-read structure with emojis for each meal.
      Keep meals simple and practical with commonly available ingredients.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const aiResponse: Omit<AIResponse, 'id'> = {
        userId: userProfile.id,
        query: prompt,
        response,
        type: 'quick_meal_plan',
        createdAt: new Date(),
        metadata: {
          generationType: 'quick',
          date: new Date().toISOString(),
        }
      };

      return await aiService.create(aiResponse);
    } catch (error) {
      console.error('Error generating quick meal plan:', error);
      throw error;
    }
  },

  analyzeMealPlan: async (
    userProfile: UserProfile,
    currentMeals: Array<{ name: string; nutrients: { calories: number; protein: number; carbs: number; fat: number } }>
  ): Promise<AIResponse> => {
    const prompt = `
      Analyze this meal plan for a person with the following characteristics:
      - Goal: ${userProfile.preferences.goal}
      - Current Weight: ${userProfile.preferences.weight}kg
      - Target Weight: ${userProfile.preferences.targetWeight}kg
      
      Current meals:
      ${currentMeals.map(meal => `
        - ${meal.name}
          Calories: ${meal.nutrients.calories}
          Protein: ${meal.nutrients.protein}g
          Carbs: ${meal.nutrients.carbs}g
          Fat: ${meal.nutrients.fat}g
      `).join('\n')}
      
      Please provide:
      1. Analysis of current nutrition vs goals
      2. Suggestions for improvements
      3. Potential nutrient deficiencies
      4. Alternative meal suggestions if needed
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const aiResponse: Omit<AIResponse, 'id'> = {
        userId: userProfile.id,
        query: prompt,
        response,
        type: 'meal_analysis',
        createdAt: new Date(),
      };

      return await aiService.create(aiResponse);
    } catch (error) {
      console.error('Error analyzing meal plan:', error);
      throw error;
    }
  },

  customizeMealPlan: async (
    userProfile: UserProfile,
    basePlan: string,
    customization: {
      timeConstraints?: string;
      cookingSkill?: 'beginner' | 'intermediate' | 'advanced';
      availableEquipment?: string[];
      budgetLevel?: 'low' | 'medium' | 'high';
    }
  ): Promise<AIResponse> => {
    const prompt = `
      Customize this meal plan:
      ${basePlan}
      
      For a person with:
      - Cooking Skill: ${customization.cookingSkill || 'intermediate'}
      - Time Available: ${customization.timeConstraints || 'normal'}
      - Equipment: ${customization.availableEquipment?.join(', ') || 'basic kitchen equipment'}
      - Budget: ${customization.budgetLevel || 'medium'}
      
      Consider their profile:
      - Dietary Restrictions: ${userProfile.preferences.dietaryRestrictions.join(', ')}
      - Goal: ${userProfile.preferences.goal}
      
      Please provide:
      1. Adjusted meal plan
      2. Simplified preparation steps
      3. Cost-saving suggestions
      4. Time-saving tips
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const aiResponse: Omit<AIResponse, 'id'> = {
        userId: userProfile.id,
        query: prompt,
        response,
        type: 'meal_customization',
        createdAt: new Date(),
        metadata: {
          originalPlan: basePlan,
          customizationParams: customization
        }
      };

      return await aiService.create(aiResponse);
    } catch (error) {
      console.error('Error customizing meal plan:', error);
      throw error;
    }
  }
};

export default AIService; 