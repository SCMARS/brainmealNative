import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserStats } from '../../types';

interface StatsModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    stats: UserStats | null;
    setStats: (stats: UserStats) => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
    visible,
    onClose,
    onSave,
    stats,
    setStats
}) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Edit Stats</Text>
                    <TouchableOpacity 
                        onPress={onClose}
                        style={styles.modalCloseButton}
                    >
                        <MaterialIcons name="close" size={24} color="#FF6B00" />
                    </TouchableOpacity>
                </View>

                {stats && (
                    <>
                        {/* Meals Input */}
                        <StatInput
                            label="Meals"
                            value={stats.meals}
                            onChange={(value) => setStats({ ...stats, meals: value })}
                        />

                        {/* Calories Input */}
                        <StatInput
                            label="Calories"
                            value={stats.calories}
                            onChange={(value) => setStats({ ...stats, calories: value })}
                            unit="kcal"
                        />

                        {/* Other inputs... */}
                        <StatInput
                            label="Protein"
                            value={stats.protein}
                            onChange={(value) => setStats({ ...stats, protein: value })}
                            unit="g"
                        />

                        <StatInput
                            label="Weight"
                            value={stats.weight}
                            onChange={(value) => setStats({ ...stats, weight: value })}
                            unit="kg"
                        />

                        <StatInput
                            label="Height"
                            value={stats.height}
                            onChange={(value) => setStats({ ...stats, height: value })}
                            unit="cm"
                        />

                        <StatInput
                            label="Age"
                            value={stats.age}
                            onChange={(value) => setStats({ ...stats, age: value })}
                        />

                        <TouchableOpacity
                            style={styles.modalSaveButton}
                            onPress={onSave}
                        >
                            <Text style={styles.modalSaveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    </Modal>
);

interface StatInputProps {
    label: string;
    value?: number;
    onChange: (value: number) => void;
    unit?: string;
}

const StatInput: React.FC<StatInputProps> = ({ label, value, onChange, unit }) => (
    <View style={styles.modalInputGroup}>
        <Text style={styles.modalLabel}>{label} {unit ? `(${unit})` : ''}</Text>
        <TextInput
            style={styles.modalInput}
            value={value?.toString() || ''}
            onChangeText={(text) => onChange(parseInt(text) || 0)}
            keyboardType="numeric"
            placeholder={`Enter ${label.toLowerCase()}`}
            placeholderTextColor="#666"
        />
    </View>
);

const styles = StyleSheet.create({
    // ... копируем соответствующие стили из основного файла ...
});

export default StatsModal; 