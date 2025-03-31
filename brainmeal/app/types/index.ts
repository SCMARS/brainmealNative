export interface Friend {
    id: string;
    name: string;
    photoURL?: string;
    status: 'online' | 'offline';
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    progress: number;
    total: number;
}

export interface UserStats {
    meals: number;
    calories: number;
    protein: number;
    weight?: number;
    height?: number;
    age?: number;
    goal?: string;
    history: {
        date: string;
        calories: number;
        protein: number;
    }[];
}

export interface User {
    name: string;
    email: string;
    stats: UserStats;
    photoURL?: string;
    achievements: Achievement[];
    friends: Friend[];
}

export interface Analysis {
    trends: Trend[];
    recommendations: Recommendation[];
    predictions: Prediction[];
}

export interface Prediction {
    expectedWeight: number;
    timeToGoal: number;
    confidenceScore: number;
}

export interface Challenge {
    id: string;
    type: string;
    participants: string[];
    startDate: Date;
    endDate: Date;
    status: 'active' | 'completed';
    leaderboard: User[];
}

export interface SleepData {
    duration: number;
    quality: number;
    phases: SleepPhase[];
    recommendations: string[];
}

export interface StressLevel {
    level: number;
    factors: string[];
    recommendations: string[];
}

const types = {
  // ... существующие типы ...
};
export default types; 