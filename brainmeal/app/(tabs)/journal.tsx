import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface JournalEntry {
  id: string;
  type: 'meal' | 'activity' | 'water';
  time: string;
  title: string;
  details: string;
  calories?: number;
}

export default function Journal() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    type: 'meal',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const addEntry = () => {
    if (!newEntry.title || !newEntry.details) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      type: newEntry.type as 'meal' | 'activity' | 'water',
      time: newEntry.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: newEntry.title,
      details: newEntry.details,
      calories: newEntry.calories,
    };

    setEntries([...entries, entry]);
    setShowAddModal(false);
    setNewEntry({
      type: 'meal',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'meal':
        return 'restaurant';
      case 'activity':
        return 'fitness-center';
      case 'water':
        return 'water-drop';
      default:
        return 'info';
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'meal':
        return '#FF6B00';
      case 'activity':
        return '#4CAF50';
      case 'water':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-800">Дневник</Text>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className="bg-orange-500 p-2 rounded-full"
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {entries.map((entry) => (
          <View
            key={entry.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm"
          >
            <View className="flex-row items-center mb-2">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: getEntryColor(entry.type) }}
              >
                <MaterialIcons
                  name={getEntryIcon(entry.type)}
                  size={20}
                  color="#fff"
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {entry.title}
                </Text>
                <Text className="text-gray-500">{entry.time}</Text>
              </View>
            </View>
            <Text className="text-gray-600 mb-2">{entry.details}</Text>
            {entry.calories && (
              <Text className="text-orange-500 font-medium">
                {entry.calories} ккал
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-4 w-[90%]">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Добавить запись
            </Text>

            <View className="flex-row justify-around mb-4">
              {['meal', 'activity', 'water'].map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`p-2 rounded-lg ${
                    newEntry.type === type ? 'bg-orange-100' : 'bg-gray-100'
                  }`}
                  onPress={() => setNewEntry({ ...newEntry, type: type as any })}
                >
                  <MaterialIcons
                    name={getEntryIcon(type)}
                    size={24}
                    color={newEntry.type === type ? '#FF6B00' : '#666'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Название"
              value={newEntry.title}
              onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
            />

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Описание"
              multiline
              numberOfLines={3}
              value={newEntry.details}
              onChangeText={(text) => setNewEntry({ ...newEntry, details: text })}
            />

            {newEntry.type === 'meal' && (
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3"
                placeholder="Калории"
                keyboardType="numeric"
                value={newEntry.calories?.toString()}
                onChangeText={(text) =>
                  setNewEntry({ ...newEntry, calories: Number(text) })
                }
              />
            )}

            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                className="bg-gray-200 p-3 rounded-lg"
                onPress={() => setShowAddModal(false)}
              >
                <Text className="text-gray-800">Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-orange-500 p-3 rounded-lg"
                onPress={addEntry}
              >
                <Text className="text-white">Добавить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}