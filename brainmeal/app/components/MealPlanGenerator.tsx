import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Animated,
    Modal,
    TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';

interface Macro {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
}

interface MealPlan {
    id?: string;
    date: string;
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
    totalCalories: number;
    macros: Macro;
    saved: boolean;
}

interface Goals {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
}

const genAI = new GoogleGenerativeAI('AIzaSyDvp5H76M33BQvmFa87T4jvHpBI8y4FG7g');

export default function MealPlanGenerator() {
    const [loading, setLoading] = useState(false);
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
    const [showGoals, setShowGoals] = useState(false);
    const [goals, setGoals] = useState<Goals>({
        calories: 2000,
        protein: 150,
        fat: 60,
        carbs: 200
    });
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadSavedPlans();
    }, []);

    const loadSavedPlans = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const q = query(
                collection(db, `users/${userId}/mealPlans`),
                orderBy('date', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const plans = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as MealPlan[];
            setSavedPlans(plans);
        } catch (error) {
            console.error('Error loading saved plans:', error);
        }
    };

    const saveMealPlan = async (plan: MealPlan) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const docRef = await addDoc(collection(db, `users/${userId}/mealPlans`), {
                ...plan,
                date: new Date().toISOString(),
                saved: true
            });
            setSavedPlans([{ ...plan, id: docRef.id }, ...savedPlans]);
            Alert.alert('Success', 'Meal plan saved successfully!');
        } catch (error) {
            console.error('Error saving meal plan:', error);
            Alert.alert('Error', 'Failed to save meal plan. Please try again.');
        }
    };

    const deleteMealPlan = async (id: string) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            await deleteDoc(doc(db, `users/${userId}/mealPlans`, id));
            setSavedPlans(savedPlans.filter(plan => plan.id !== id));
            Alert.alert('Success', 'Meal plan deleted successfully!');
        } catch (error) {
            console.error('Error deleting meal plan:', error);
            Alert.alert('Error', 'Failed to delete meal plan. Please try again.');
        }
    };

    const generateMealPlan = async () => {
        try {
            setLoading(true);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Generate a healthy meal plan for one day with the following requirements:
            - Total calories: ${goals.calories} kcal
            - Protein: ${goals.protein}g
            - Fat: ${goals.fat}g
            - Carbs: ${goals.carbs}g
            Include breakfast, lunch, dinner, and snacks. For each meal, provide:
            1. List of foods with portions in grams
            2. Total calories and macros for each meal
            3. Brief nutritional benefits
            
            Format the response as a JSON object with the following structure:
            {
                "breakfast": ["food1 (portion)", "food2 (portion)"],
                "lunch": ["food1 (portion)", "food2 (portion)"],
                "dinner": ["food1 (portion)", "food2 (portion)"],
                "snacks": ["food1 (portion)", "food2 (portion)"],
                "totalCalories": number,
                "macros": {
                    "protein": number,
                    "fat": number,
                    "carbs": number
                }
            }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const plan = JSON.parse(text);
            
            setMealPlan({
                ...plan,
                date: new Date().toISOString(),
                saved: false
            });
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            console.error('Error generating meal plan:', error);
            Alert.alert('Error', 'Failed to generate meal plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const MealSection: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
        <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>{title}</Text>
            {items.map((item, index) => (
                <View key={index} style={styles.mealItem}>
                    <MaterialIcons name="restaurant" size={20} color="#FF6B00" />
                    <Text style={styles.mealItemText}>{item}</Text>
                </View>
            ))}
        </View>
    );

    const GoalsModal: React.FC<{
        visible: boolean;
        onClose: () => void;
        goals: Goals;
        onSave: (goals: Goals) => void;
    }> = ({ visible, onClose, goals, onSave }) => {
        const [tempGoals, setTempGoals] = useState(goals);

        return (
            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Set Your Goals</Text>
                        <View style={styles.goalInput}>
                            <Text style={styles.goalLabel}>Calories (kcal)</Text>
                            <TextInput
                                style={styles.input}
                                value={tempGoals.calories.toString()}
                                onChangeText={(text) => setTempGoals({ ...tempGoals, calories: parseInt(text) || 0 })}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.goalInput}>
                            <Text style={styles.goalLabel}>Protein (g)</Text>
                            <TextInput
                                style={styles.input}
                                value={tempGoals.protein.toString()}
                                onChangeText={(text) => setTempGoals({ ...tempGoals, protein: parseInt(text) || 0 })}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.goalInput}>
                            <Text style={styles.goalLabel}>Fat (g)</Text>
                            <TextInput
                                style={styles.input}
                                value={tempGoals.fat.toString()}
                                onChangeText={(text) => setTempGoals({ ...tempGoals, fat: parseInt(text) || 0 })}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.goalInput}>
                            <Text style={styles.goalLabel}>Carbs (g)</Text>
                            <TextInput
                                style={styles.input}
                                value={tempGoals.carbs.toString()}
                                onChangeText={(text) => setTempGoals({ ...tempGoals, carbs: parseInt(text) || 0 })}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.saveButton} 
                                onPress={() => {
                                    onSave(tempGoals);
                                    onClose();
                                }}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={generateMealPlan}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <MaterialIcons name="auto-awesome" size={24} color="white" />
                            <Text style={styles.generateButtonText}>Generate Meal Plan</Text>
                        </>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.goalsButton}
                    onPress={() => setShowGoals(true)}
                >
                    <MaterialIcons name="fitness-center" size={24} color="#FF6B00" />
                </TouchableOpacity>
            </View>

            {mealPlan && (
                <Animated.View style={[styles.planContainer, { opacity: fadeAnim }]}>
                    <ScrollView>
                        <MealSection title="Breakfast" items={mealPlan.breakfast} />
                        <MealSection title="Lunch" items={mealPlan.lunch} />
                        <MealSection title="Dinner" items={mealPlan.dinner} />
                        <MealSection title="Snacks" items={mealPlan.snacks} />
                        
                        <View style={styles.macrosContainer}>
                            <Text style={styles.macrosTitle}>Daily Totals</Text>
                            <View style={styles.macrosGrid}>
                                <View style={styles.macroItem}>
                                    <Text style={styles.macroLabel}>Calories</Text>
                                    <Text style={styles.macroValue}>{mealPlan.totalCalories} kcal</Text>
                                </View>
                                <View style={styles.macroItem}>
                                    <Text style={styles.macroLabel}>Protein</Text>
                                    <Text style={styles.macroValue}>{mealPlan.macros.protein}g</Text>
                                </View>
                                <View style={styles.macroItem}>
                                    <Text style={styles.macroLabel}>Fat</Text>
                                    <Text style={styles.macroValue}>{mealPlan.macros.fat}g</Text>
                                </View>
                                <View style={styles.macroItem}>
                                    <Text style={styles.macroLabel}>Carbs</Text>
                                    <Text style={styles.macroValue}>{mealPlan.macros.carbs}g</Text>
                                </View>
                            </View>
                            {!mealPlan.saved && (
                                <TouchableOpacity
                                    style={styles.savePlanButton}
                                    onPress={() => saveMealPlan(mealPlan)}
                                >
                                    <MaterialIcons name="save" size={24} color="white" />
                                    <Text style={styles.savePlanButtonText}>Save Plan</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </Animated.View>
            )}

            {savedPlans.length > 0 && (
                <View style={styles.savedPlansContainer}>
                    <Text style={styles.savedPlansTitle}>Saved Plans</Text>
                    {savedPlans.map(plan => (
                        <View key={plan.id} style={styles.savedPlanCard}>
                            <View style={styles.savedPlanHeader}>
                                <Text style={styles.savedPlanDate}>
                                    {new Date(plan.date).toLocaleDateString()}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => plan.id && deleteMealPlan(plan.id)}
                                >
                                    <MaterialIcons name="delete" size={24} color="#FF6B00" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.savedPlanCalories}>
                                {plan.totalCalories} kcal
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <GoalsModal
                visible={showGoals}
                onClose={() => setShowGoals(false)}
                goals={goals}
                onSave={setGoals}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    generateButton: {
        backgroundColor: '#FF6B00',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flex: 1,
    },
    generateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    goalsButton: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    planContainer: {
        flex: 1,
    },
    mealSection: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    mealTitle: {
        color: '#FF6B00',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    mealItemText: {
        color: 'white',
        fontSize: 16,
        flex: 1,
    },
    macrosContainer: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        marginTop: 10,
    },
    macrosTitle: {
        color: '#FF6B00',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    macrosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    macroItem: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
    },
    macroLabel: {
        color: '#666',
        fontSize: 14,
        marginBottom: 5,
    },
    macroValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    goalInput: {
        marginBottom: 15,
    },
    goalLabel: {
        color: '#666',
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 12,
        color: 'white',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 12,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#FF6B00',
        borderRadius: 10,
        padding: 12,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    savePlanButton: {
        backgroundColor: '#FF6B00',
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 15,
    },
    savePlanButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    savedPlansContainer: {
        marginTop: 20,
    },
    savedPlansTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    savedPlanCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    savedPlanHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    savedPlanDate: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    savedPlanCalories: {
        color: '#666',
        fontSize: 14,
    },
}); 