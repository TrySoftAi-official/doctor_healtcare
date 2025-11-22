import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { prescriptionService } from '../services/prescriptionService';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function CreatePrescriptionScreen() {
  const [patientId, setPatientId] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
  ]);
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [isRefillable, setIsRefillable] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
    ]);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!patientId || !validUntil) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const validMedications = medications.filter(
      (m) => m.name && m.dosage && m.frequency && m.duration
    );

    if (validMedications.length === 0) {
      Alert.alert('Error', 'Please add at least one medication');
      return;
    }

    setLoading(true);
    try {
      await prescriptionService.createPrescription({
        patientId,
        medications: validMedications,
        notes,
        validUntil,
        isRefillable,
      });
      Alert.alert('Success', 'Prescription created successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Prescription</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Patient ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter patient ID"
            value={patientId}
            onChangeText={setPatientId}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Valid Until *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={validUntil}
            onChangeText={setValidUntil}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Medications *</Text>
          {medications.map((medication, index) => (
            <View key={index} style={styles.medicationCard}>
              <View style={styles.medicationHeader}>
                <Text style={styles.medicationNumber}>Medication {index + 1}</Text>
                {medications.length > 1 && (
                  <TouchableOpacity onPress={() => removeMedication(index)}>
                    <Ionicons name="close-circle" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Medication name"
                value={medication.name}
                onChangeText={(value) => updateMedication(index, 'name', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Dosage"
                value={medication.dosage}
                onChangeText={(value) => updateMedication(index, 'dosage', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Frequency (e.g., 2 times daily)"
                value={medication.frequency}
                onChangeText={(value) => updateMedication(index, 'frequency', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Duration (e.g., 7 days)"
                value={medication.duration}
                onChangeText={(value) => updateMedication(index, 'duration', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Instructions"
                value={medication.instructions}
                onChangeText={(value) => updateMedication(index, 'instructions', value)}
                multiline
              />
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addMedication}>
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.addButtonText}>Add Medication</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Prescription</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  medicationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

