import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface Macro {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
}

interface FoodItem {
    id?: string;
    name: string;
    macros: Macro;
    portion: number;
    category?: string;
}

const PRESET_FOODS: FoodItem[] = [
    {
        name: 'Chicken Breast',
        macros: { calories: 165, protein: 31, fat: 3.6, carbs: 0 },
        portion: 100,
        category: 'Protein'
    },
    {
        name: 'Brown Rice',
        macros: { calories: 216, protein: 5, fat: 1.8, carbs: 45 },
        portion: 100,
        category: 'Carbs'
    },
    {
        name: 'Avocado',
        macros: { calories: 160, protein: 2, fat: 14.7, carbs: 8.5 },
        portion: 100,
        category: 'Fats'
    },
    {
        name: 'Salmon',
        macros: { calories: 208, protein: 22.1, fat: 13.4, carbs: 0 },
        portion: 100,
        category: 'Protein'
    },
    {
        name: 'Sweet Potato',
        macros: { calories: 86, protein: 1.6, fat: 0.1, carbs: 20.1 },
        portion: 100,
        category: 'Carbs'
    }
];

const PortionCalculator = () => {
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [currentItem, setCurrentItem] = useState<FoodItem>({
        name: '',
        macros: { calories: 0, protein: 0, fat: 0, carbs: 0 },
        portion: 100
    });
    const [totalMacros, setTotalMacros] = useState<Macro>({
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0
    });
    const [showPresets, setShowPresets] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadFoodItems();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadFoodItems = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const querySnapshot = await getDocs(collection(db, `users/${userId}/foodItems`));
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as FoodItem[];
            setFoodItems(items);
            updateTotalMacros(items);
        } catch (error) {
            console.error('Error loading food items:', error);
        }
    };

    const saveFoodItem = async (item: FoodItem) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const docRef = await addDoc(collection(db, `users/${userId}/foodItems`), item);
            const newItem = { ...item, id: docRef.id };
            setFoodItems([...foodItems, newItem]);
            updateTotalMacros([...foodItems, newItem]);
            setCurrentItem({
                name: '',
                macros: { calories: 0, protein: 0, fat: 0, carbs: 0 },
                portion: 100
            });
            Alert.alert('Success', 'Food item saved successfully!');
        } catch (error) {
            console.error('Error saving food item:', error);
            Alert.alert('Error', 'Failed to save food item. Please try again.');
        }
    };

    const deleteFoodItem = async (id: string) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            await deleteDoc(doc(db, `users/${userId}/foodItems`, id));
            const newItems = foodItems.filter(item => item.id !== id);
            setFoodItems(newItems);
            updateTotalMacros(newItems);
            Alert.alert('Success', 'Food item deleted successfully!');
        } catch (error) {
            console.error('Error deleting food item:', error);
            Alert.alert('Error', 'Failed to delete food item. Please try again.');
        }
    };

    const calculateMacros = (portion: number, baseMacros: Macro) => {
        const multiplier = portion / 100;
        return {
            calories: Math.round(baseMacros.calories * multiplier),
            protein: Math.round(baseMacros.protein * multiplier),
            fat: Math.round(baseMacros.fat * multiplier),
            carbs: Math.round(baseMacros.carbs * multiplier)
        };
    };

    const addFoodItem = () => {
        if (currentItem.name && currentItem.macros.calories > 0) {
            const newItem = {
                ...currentItem,
                macros: calculateMacros(currentItem.portion, currentItem.macros)
            };
            saveFoodItem(newItem);
        }
    };

    const removeFoodItem = (id: string) => {
        deleteFoodItem(id);
    };

    const updateTotalMacros = (items: FoodItem[]) => {
        const total = items.reduce((acc, item) => ({
            calories: acc.calories + item.macros.calories,
            protein: acc.protein + item.macros.protein,
            fat: acc.fat + item.macros.fat,
            carbs: acc.carbs + item.macros.carbs
        }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
        setTotalMacros(total);
    };

    const addPresetFood = (preset: FoodItem) => {
        setCurrentItem(preset);
        setShowPresets(false);
    };

    const filteredPresets = PRESET_FOODS.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const MacroCard: React.FC<{ label: string; value: number; unit: string }> = ({ label, value, unit }) => (
        <View style={styles.macroCard}>
            <Text style={styles.macroLabel}>{label}</Text>
            <Text style={styles.macroValue}>{value}{unit}</Text>
        </View>
    );

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.inputContainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={[styles.input, styles.searchInput]}
                        placeholder="Search preset foods"
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => setShowPresets(true)}
                    />
                    <TouchableOpacity
                        style={styles.presetButton}
                        onPress={() => setShowPresets(!showPresets)}
                    >
                        <MaterialIcons 
                            name={showPresets ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                            size={24} 
                            color="#FF6B00" 
                        />
                    </TouchableOpacity>
                </View>

                {showPresets && (
                    <ScrollView style={styles.presetsList}>
                        {filteredPresets.map((preset, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.presetItem}
                                onPress={() => addPresetFood(preset)}
                            >
                                <Text style={styles.presetName}>{preset.name}</Text>
                                <Text style={styles.presetCategory}>{preset.category}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Food name"
                    placeholderTextColor="#666"
                    value={currentItem.name}
                    onChangeText={(text) => setCurrentItem({ ...currentItem, name: text })}
                />
                <View style={styles.macrosInput}>
                    <TextInput
                        style={[styles.input, styles.macroInput]}
                        placeholder="Calories"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={currentItem.macros.calories.toString()}
                        onChangeText={(text) => setCurrentItem({
                            ...currentItem,
                            macros: { ...currentItem.macros, calories: parseInt(text) || 0 }
                        })}
                    />
                    <TextInput
                        style={[styles.input, styles.macroInput]}
                        placeholder="Protein"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={currentItem.macros.protein.toString()}
                        onChangeText={(text) => setCurrentItem({
                            ...currentItem,
                            macros: { ...currentItem.macros, protein: parseInt(text) || 0 }
                        })}
                    />
                    <TextInput
                        style={[styles.input, styles.macroInput]}
                        placeholder="Fat"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={currentItem.macros.fat.toString()}
                        onChangeText={(text) => setCurrentItem({
                            ...currentItem,
                            macros: { ...currentItem.macros, fat: parseInt(text) || 0 }
                        })}
                    />
                    <TextInput
                        style={[styles.input, styles.macroInput]}
                        placeholder="Carbs"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={currentItem.macros.carbs.toString()}
                        onChangeText={(text) => setCurrentItem({
                            ...currentItem,
                            macros: { ...currentItem.macros, carbs: parseInt(text) || 0 }
                        })}
                    />
                </View>
                <View style={styles.portionContainer}>
                    <TextInput
                        style={[styles.input, styles.portionInput]}
                        placeholder="Portion (g)"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={currentItem.portion.toString()}
                        onChangeText={(text) => setCurrentItem({
                            ...currentItem,
                            portion: parseInt(text) || 0
                        })}
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={addFoodItem}
                    >
                        <MaterialIcons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.totalMacros}>
                <MacroCard label="Calories" value={totalMacros.calories} unit="kcal" />
                <MacroCard label="Protein" value={totalMacros.protein} unit="g" />
                <MacroCard label="Fat" value={totalMacros.fat} unit="g" />
                <MacroCard label="Carbs" value={totalMacros.carbs} unit="g" />
            </View>

            <ScrollView style={styles.foodList}>
                {foodItems.map((item, index) => (
                    <View key={item.id || index} style={styles.foodItem}>
                        <View style={styles.foodItemInfo}>
                            <Text style={styles.foodName}>{item.name}</Text>
                            <Text style={styles.foodPortion}>{item.portion}g</Text>
                        </View>
                        <View style={styles.foodMacros}>
                            <Text style={styles.foodMacro}>{item.macros.calories} kcal</Text>
                            <Text style={styles.foodMacro}>P: {item.macros.protein}g</Text>
                            <Text style={styles.foodMacro}>F: {item.macros.fat}g</Text>
                            <Text style={styles.foodMacro}>C: {item.macros.carbs}g</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => item.id && removeFoodItem(item.id)}
                        >
                            <MaterialIcons name="delete" size={24} color="#FF6B00" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

export default PortionCalculator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    inputContainer: {
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 12,
        color: 'white',
        marginBottom: 10,
    },
    macrosInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    macroInput: {
        flex: 1,
    },
    portionContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    portionInput: {
        flex: 1,
    },
    addButton: {
        backgroundColor: '#FF6B00',
        borderRadius: 10,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalMacros: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    macroCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    macroLabel: {
        color: '#666',
        fontSize: 14,
        marginBottom: 5,
    },
    macroValue: {
        color: '#FF6B00',
        fontSize: 18,
        fontWeight: 'bold',
    },
    foodList: {
        flex: 1,
    },
    foodItem: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    foodItemInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    foodName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    foodPortion: {
        color: '#666',
        fontSize: 14,
    },
    foodMacros: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    foodMacro: {
        color: '#666',
        fontSize: 14,
    },
    removeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
    },
    presetButton: {
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    presetsList: {
        maxHeight: 200,
        marginBottom: 10,
    },
    presetItem: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 12,
        marginBottom: 5,
    },
    presetName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    presetCategory: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
    },
}); 