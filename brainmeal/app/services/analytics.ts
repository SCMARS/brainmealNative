import { MealPlan, UserStats, Analysis, Recommendation } from '../types';

export class AnalyticsService {
  async analyzeMealPlan(mealPlan: MealPlan, userStats: UserStats): Promise<Analysis> {
    const caloriesAnalysis = this.analyzeCalories(mealPlan, userStats);
    const macrosAnalysis = this.analyzeMacros(mealPlan, userStats);
    const trendsAnalysis = this.analyzeTrends(userStats);
    
    return {
      calories: caloriesAnalysis,
      macros: macrosAnalysis,
      trends: trendsAnalysis,
      recommendations: await this.generateRecommendations(
        caloriesAnalysis,
        macrosAnalysis,
        trendsAnalysis
      )
    };
  }

  private analyzeCalories(mealPlan: MealPlan, userStats: UserStats) {
    return {
      current: this.calculateCurrentCalories(mealPlan),
      target: userStats.calories,
      deficit: userStats.calories - this.calculateCurrentCalories(mealPlan),
      trend: this.calculateCaloriesTrend(userStats)
    };
  }

  private analyzeMacros(mealPlan: MealPlan, userStats: UserStats) {
    return {
      protein: {
        current: this.calculateCurrentProtein(mealPlan),
        target: userStats.protein
      },
      fats: {
        current: this.calculateCurrentFats(mealPlan),
        target: this.calculateTargetFats(userStats)
      },
      carbs: {
        current: this.calculateCurrentCarbs(mealPlan),
        target: this.calculateTargetCarbs(userStats)
      }
    };
  }

  private analyzeTrends(userStats: UserStats) {
    return {
      weight: this.calculateWeightTrend(userStats),
      calories: this.calculateCaloriesHistory(userStats),
      protein: this.calculateProteinHistory(userStats)
    };
  }

  private calculateCurrentCalories(mealPlan: MealPlan): number {
    return mealPlan.meals.reduce((total, meal) => total + meal.calories, 0);
  }

  private calculateCurrentProtein(mealPlan: MealPlan): number {
    return mealPlan.meals.reduce((total, meal) => total + meal.protein, 0);
  }

  private calculateCurrentFats(mealPlan: MealPlan): number {
    return mealPlan.meals.reduce((total, meal) => total + (meal.fats || 0), 0);
  }

  private calculateCurrentCarbs(mealPlan: MealPlan): number {
    return mealPlan.meals.reduce((total, meal) => total + (meal.carbs || 0), 0);
  }

  private calculateTargetFats(userStats: UserStats): number {
    // Примерный расчет целевого потребления жиров (30% от общих калорий)
    return Math.round((userStats.calories * 0.3) / 9);
  }

  private calculateTargetCarbs(userStats: UserStats): number {
    // Примерный расчет целевого потребления углеводов (оставшиеся калории после белков и жиров)
    const proteinCalories = userStats.protein * 4;
    const fatCalories = this.calculateTargetFats(userStats) * 9;
    return Math.round((userStats.calories - proteinCalories - fatCalories) / 4);
  }

  private calculateCaloriesTrend(userStats: UserStats): 'increasing' | 'decreasing' | 'stable' {
    if (!userStats.history || userStats.history.length < 2) return 'stable';
    
    const recent = userStats.history.slice(-2);
    const diff = recent[1].calories - recent[0].calories;
    
    if (diff > 50) return 'increasing';
    if (diff < -50) return 'decreasing';
    return 'stable';
  }

  private calculateWeightTrend(userStats: UserStats) {
    // Преобразование истории веса в формат для графика
    return userStats.history.map(entry => ({
      date: new Date(entry.date),
      value: entry.weight || 0
    }));
  }

  private calculateCaloriesHistory(userStats: UserStats) {
    return userStats.history.map(entry => ({
      date: new Date(entry.date),
      value: entry.calories
    }));
  }

  private calculateProteinHistory(userStats: UserStats) {
    return userStats.history.map(entry => ({
      date: new Date(entry.date),
      value: entry.protein
    }));
  }

  private async generateRecommendations(
    calories: any,
    macros: any,
    trends: any
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Проверка калорий
    if (calories.deficit > 300) {
      recommendations.push({
        type: 'calories',
        title: 'Увеличьте потребление калорий',
        description: `Вы недобираете ${calories.deficit} калорий от цели`,
        priority: 'high',
        actionable: true,
        action: {
          type: 'adjust_calories',
          params: { deficit: calories.deficit }
        }
      });
    }

    // Проверка белка
    if (macros.protein.current < macros.protein.target) {
      recommendations.push({
        type: 'protein',
        title: 'Увеличьте потребление белка',
        description: 'Для достижения целей необходимо больше белка',
        priority: 'high',
        actionable: true,
        action: {
          type: 'adjust_protein',
          params: { deficit: macros.protein.target - macros.protein.current }
        }
      });
    }

    return recommendations;
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService; 