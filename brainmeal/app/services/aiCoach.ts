import { GoogleGenerativeAI } from '@google/generative-ai';
import { User, HealthData, Analysis, Prediction } from '../types';

export class AICoachService {
  private genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

  async getDailyAdvice(user: User): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      Based on user data:
      - Current weight: ${user.stats.weight}kg
      - Target weight: ${user.preferences.targetWeight}kg
      - Activity level: ${user.preferences.activityLevel}
      - Recent meals: ${JSON.stringify(user.recentMeals)}
      
      Provide personalized daily advice for diet and activity.
    `;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async analyzeProgress(healthData: HealthData): Promise<Analysis> {
    // Анализ прогресса на основе исторических данных
    return {
      trends: this.calculateTrends(healthData),
      recommendations: await this.generateRecommendations(healthData),
      predictions: await this.predictFutureResults(healthData)
    };
  }

  async predictResults(timeframe: number): Promise<Prediction> {
    // ML-модель для предсказания результатов
    return {
      expectedWeight: 0,
      timeToGoal: 0,
      confidenceScore: 0
    };
  }
}

const aiCoachService = new AICoachService();
export default aiCoachService; 