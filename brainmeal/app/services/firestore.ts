import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserProfile, MealPlan, JournalEntry, ActivityLog, WaterLog, NutritionGoals, AIResponse } from '../../types';

// Generic CRUD operations
const createDocument = async <T extends { id?: string }>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<T> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { ...data, id: docRef.id } as T;
};

const getDocument = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
};

const updateDocument = async <T>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
};

const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

// User Profile operations
export const userProfileService = {
  create: (data: Omit<UserProfile, 'id'>) => createDocument<UserProfile>('users', data),
  get: (id: string) => getDocument<UserProfile>('users', id),
  update: (id: string, data: Partial<UserProfile>) => updateDocument<UserProfile>('users', id, data),
  delete: (id: string) => deleteDocument('users', id),
};

// Meal Plan operations
export const mealPlanService = {
  create: (data: Omit<MealPlan, 'id'>) => createDocument<MealPlan>('mealPlans', data),
  get: (id: string) => getDocument<MealPlan>('mealPlans', id),
  update: (id: string, data: Partial<MealPlan>) => updateDocument<MealPlan>('mealPlans', id, data),
  delete: (id: string) => deleteDocument('mealPlans', id),
  
  getUserMealPlans: async (userId: string, limit = 7) => {
    const q = query(
      collection(db, 'mealPlans'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limit)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MealPlan[];
  },
};

// Journal Entry operations
export const journalService = {
  create: (data: Omit<JournalEntry, 'id'>) => createDocument<JournalEntry>('journal', data),
  get: (id: string) => getDocument<JournalEntry>('journal', id),
  update: (id: string, data: Partial<JournalEntry>) => updateDocument<JournalEntry>('journal', id, data),
  delete: (id: string) => deleteDocument('journal', id),
  
  getUserEntries: async (userId: string, date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'journal'),
      where('userId', '==', userId),
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as JournalEntry[];
  },
};

// Activity Log operations
export const activityService = {
  create: (data: Omit<ActivityLog, 'id'>) => createDocument<ActivityLog>('activities', data),
  get: (id: string) => getDocument<ActivityLog>('activities', id),
  update: (id: string, data: Partial<ActivityLog>) => updateDocument<ActivityLog>('activities', id, data),
  delete: (id: string) => deleteDocument('activities', id),
  
  getUserActivities: async (userId: string, date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId),
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ActivityLog[];
  },
};

// Water Log operations
export const waterService = {
  create: (data: Omit<WaterLog, 'id'>) => createDocument<WaterLog>('water', data),
  get: (id: string) => getDocument<WaterLog>('water', id),
  delete: (id: string) => deleteDocument('water', id),
  
  getUserWaterLogs: async (userId: string, date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'water'),
      where('userId', '==', userId),
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WaterLog[];
  },
};

// Nutrition Goals operations
export const nutritionGoalsService = {
  create: (data: Omit<NutritionGoals, 'id'>) => createDocument<NutritionGoals>('nutritionGoals', data),
  get: (id: string) => getDocument<NutritionGoals>('nutritionGoals', id),
  update: (id: string, data: Partial<NutritionGoals>) => updateDocument<NutritionGoals>('nutritionGoals', id, data),
  
  getUserGoals: async (userId: string) => {
    const q = query(
      collection(db, 'nutritionGoals'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NutritionGoals[];
    return docs[0] || null;
  },
};

// AI Response operations
export const aiService = {
  create: (data: Omit<AIResponse, 'id'>) => createDocument<AIResponse>('aiResponses', data),
  get: (id: string) => getDocument<AIResponse>('aiResponses', id),
  
  getUserResponses: async (userId: string, type?: AIResponse['type'], limit = 10) => {
    let q = query(
      collection(db, 'aiResponses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    if (type) {
      q = query(q, where('type', '==', type));
    }
    
    q = query(q, limit(limit));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AIResponse[];
  },
}; 