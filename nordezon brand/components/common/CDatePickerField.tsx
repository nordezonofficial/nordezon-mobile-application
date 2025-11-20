import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import CTouchableOpacity from './CTouchableOpacity';

interface CDatePickerFieldProps {
  label?: string;
  value?: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  icon?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

const CDatePickerField: React.FC<CDatePickerFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select Date',
  icon = 'calendar-outline',
  maximumDate,
  minimumDate,
}) => {
  const [show, setShow] = useState(false);

  // ✅ Format date to human-readable (e.g., "October 23, 2025")
  const formattedDate = value
    ? new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(value)
    : '';

  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}

      <CTouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShow(true)}
      >
        <Ionicons name={icon as any} size={20} color="#999" style={styles.icon} />
        <Text style={[styles.text, !value && { color: '#999' }]}>
          {formattedDate || placeholder}
        </Text>
      </CTouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShow(Platform.OS === 'ios');
            if (selectedDate) onChange(selectedDate);
          }}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontFamily: 'PoppinsSemiBold',
    color: '#333',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#555',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontFamily: 'PoppinsRegular',
    fontSize: 14,
    color: '#333',
  },
});

export default CDatePickerField;
