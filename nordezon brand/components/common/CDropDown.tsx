import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CText from '../common/CText';
import CTouchableOpacity from './CTouchableOpacity';

interface DropdownProps {
    label: string;
    options: string[];
    selectedValue: string;
    onValueChange: (value: string) => void;
}

const CDropDown: React.FC<DropdownProps> = ({ label, options, selectedValue, onValueChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (value: string) => {
        onValueChange(value);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            <CText style={styles.label}>{label}</CText>

            <TouchableOpacity style={styles.dropdownHeader} onPress={toggleDropdown} activeOpacity={0.8}>
                <CText style={{ color: selectedValue ? '#000' : '#999' }}>
                    {selectedValue || 'Select ' + label}
                </CText>
                <Ionicons
                    name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={20}
                    color="#555"
                />
            </TouchableOpacity>

            {isOpen && (
                <View style={{ maxHeight: 150, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
                    <ScrollView nestedScrollEnabled>
                        {options.map((item, index) => (
                            <CTouchableOpacity
                                key={index}
                                onPress={() => handleSelect(item)}
                                style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
                            >
                                <CText>{item}</CText>
                            </CTouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}


        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginVertical: 8 },
    label: { fontFamily: 'PoppinsSemiBold', fontSize: 14, marginBottom: 6, color: '#333' },
    dropdownHeader: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginTop: 4,
        backgroundColor: '#fff',
        maxHeight: 150,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
});

export default CDropDown;
