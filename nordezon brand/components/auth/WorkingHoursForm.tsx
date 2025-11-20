import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import CText from '../common/CText';

const WorkingHoursForm = ({ workingHours, setWorkingHours }: any) => {
  const [pickerVisible, setPickerVisible] = useState<{ index: number; type: 'open' | 'close' } | null>(null);

  const handleChange = (index: number, key: string, value: any) => {
    const updated = [...workingHours];
    (updated[index] as any)[key] = value;
    setWorkingHours(updated);
  };

  const showPicker = (index: number, type: 'open' | 'close') => {
    setPickerVisible({ index, type });
  };

  const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
    if (!pickerVisible) return;
    const { index, type } = pickerVisible;

    setPickerVisible(null); // close picker
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const formatted = `${hours}:${minutes}`;
      handleChange(index, type, formatted);
    }
  };

  return (
    <View style={styles.container}>
      <CText style={styles.sectionTitle}>Working Hours</CText>

      {workingHours.map((day: any, index: number) => (
        <View key={day.day} style={styles.row}>
          <Text style={styles.dayText}>{day.day}</Text>

          <Switch
            value={!day.isClosed}
            onValueChange={(val) => handleChange(index, 'isClosed', !val)}
          />

          {!day.isClosed && (
            <View style={styles.timeButtons}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => showPicker(index, 'open')}
              >
                <Text style={styles.timeText}>{day.open || 'Open'}</Text>
              </TouchableOpacity>

              <Text style={styles.separator}>-</Text>

              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => showPicker(index, 'close')}
              >
                <Text style={styles.timeText}>{day.close || 'Close'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {pickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  sectionTitle: { fontFamily: 'PoppinsSemiBold', fontSize: 18, marginBottom: 10, color: '#333' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  dayText: { fontFamily: 'PoppinsRegular', width: 90, color: '#333' },
  timeButtons: { flexDirection: 'row', alignItems: 'center' },
  timeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
    minWidth: 70,
    alignItems: 'center',
  },
  timeText: { fontFamily: 'PoppinsRegular', color: '#333' },
  separator: { marginHorizontal: 6, color: '#999' },
});

export default WorkingHoursForm;
