export interface Analysis {
  calories: CaloriesAnalysis;
  macros: MacrosAnalysis;
  trends: TrendsAnalysis;
  recommendations: Recommendation[];
}

export interface CaloriesAnalysis {
  current: number;
  target: number;
  deficit: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface MacrosAnalysis {
  protein: MacroNutrient;
  fats: MacroNutrient;
  carbs: MacroNutrient;
}

export interface MacroNutrient {
  current: number;
  target: number;
}

export interface TrendsAnalysis {
  weight: DataPoint[];
  calories: DataPoint[];
  protein: DataPoint[];
}

export interface DataPoint {
  date: Date;
  value: number;
}

export interface Recommendation {
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: {
    type: string;
    params: any;
  };
}

const analyticsTypes = {
  // ... существующие типы ...
};
export default analyticsTypes; 