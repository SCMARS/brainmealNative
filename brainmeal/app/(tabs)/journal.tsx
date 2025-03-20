import { View, Text, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface JournalEntry {
  id: string;
  type: 'meal' | 'activity' | 'water';
  time: string;
  title: string;
  details: string;
  calories?: number;
}

export default function JournalScreen() {
  const colorScheme = useColorScheme();
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      type: 'meal',
      time: '8:00 AM',
      title: 'Breakfast',
      details: 'Oatmeal with banana and almonds',
      calories: 450,
    },
    {
      id: '2',
      type: 'water',
      time: '9:30 AM',
      title: 'Water Intake',
      details: '250ml',
    },
    {
      id: '3',
      type: 'activity',
      time: '10:00 AM',
      title: 'Morning Run',
      details: '5km in 30 minutes',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    type: 'meal',
  });

  const addEntry = () => {
    if (newEntry.title && newEntry.details) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        type: newEntry.type as 'meal' | 'activity' | 'water',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: newEntry.title,
        details: newEntry.details,
        calories: newEntry.calories,
      };
      setEntries([entry, ...entries]);
      setShowAddModal(false);
      setNewEntry({ type: 'meal' });
    }
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'meal':
        return 'restaurant-outline';
      case 'activity':
        return 'fitness-outline';
      case 'water':
        return 'water-outline';
      default:
        return 'add-circle-outline';
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'meal':
        return ['#FF6B00', '#FF8533'];
      case 'activity':
        return ['#4CAF50', '#81C784'];
      case 'water':
        return ['#2196F3', '#64B5F6'];
      default:
        return ['#9E9E9E', '#BDBDBD'];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          Journal
        </Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        >
          <Ionicons name="add-circle-outline" size={24} color="#FF6B00" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.entriesContainer}>
        {entries.map((entry) => (
          <View
            key={entry.id}
            style={[
              styles.entryCard,
              { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' },
            ]}
          >
            <LinearGradient
              colors={getEntryColor(entry.type)}
              style={styles.iconContainer}
            >
              <Ionicons name={getEntryIcon(entry.type)} size={24} color="#fff" />
            </LinearGradient>

            <View style={styles.entryContent}>
              <View style={styles.entryHeader}>
                <Text style={[styles.entryTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                  {entry.title}
                </Text>
                <Text style={[styles.entryTime, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                  {entry.time}
                </Text>
              </View>

              <Text style={[styles.entryDetails, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                {entry.details}
              </Text>

              {entry.calories && (
                <Text style={[styles.calories, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
                  {entry.calories} kcal
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {showAddModal && (
        <View style={styles.modal}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#fff' },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
              Add New Entry
            </Text>

            <View style={styles.typeSelector}>
              {['meal', 'activity', 'water'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newEntry.type === type && styles.selectedType,
                    { backgroundColor: colorScheme === 'dark' ? '#333' : '#F5F5F5' },
                  ]}
                  onPress={() => setNewEntry({ ...newEntry, type })}
                >
                  <Text
                    style={[
                      styles.typeText,
                      { color: colorScheme === 'dark' ? '#fff' : '#000' },
                      newEntry.type === type && styles.selectedTypeText,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[
                styles.input,
                { color: colorScheme === 'dark' ? '#fff' : '#000' },
              ]}
              placeholder="Title"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={newEntry.title}
              onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
            />

            <TextInput
              style={[
                styles.input,
                { color: colorScheme === 'dark' ? '#fff' : '#000' },
              ]}
              placeholder="Details"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={newEntry.details}
              onChangeText={(text) => setNewEntry({ ...newEntry, details: text })}
              multiline
            />

            {newEntry.type === 'meal' && (
              <TextInput
                style={[
                  styles.input,
                  { color: colorScheme === 'dark' ? '#fff' : '#000' },
                ]}
                placeholder="Calories"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={newEntry.calories?.toString()}
                onChangeText={(text) => setNewEntry({ ...newEntry, calories: parseInt(text) || undefined })}
                keyboardType="numeric"
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewEntry({ type: 'meal' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addEntry}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  entriesContainer: {
    flex: 1,
    padding: 20,
  },
  entryCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  entryContent: {
    flex: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  entryTime: {
    fontSize: 14,
  },
  entryDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  calories: {
    fontSize: 12,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: '#FF6B00',
  },
  typeText: {
    fontSize: 14,
  },
  selectedTypeText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#FF6B00',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 