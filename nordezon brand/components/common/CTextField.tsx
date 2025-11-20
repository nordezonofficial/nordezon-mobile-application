import { Ionicons } from '@expo/vector-icons';

import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import CText from './CText';
import CTouchableOpacity from './CTouchableOpacity';

interface CTextFieldProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: any) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    icon?: string;
    showToggle?: boolean;
    multiline?: boolean;
    readOnly?: boolean;
    editable?: boolean;
    style?: any;
}

const CTextField: React.FC<CTextFieldProps> = ({
    multiline,
    style,
    readOnly = false,
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    icon,
    showToggle = false,
    editable = true,
}) => {
    const [hide, setHide] = useState(secureTextEntry);
    return (
        <>
            {
                label && (
                    <CText style={styles.label}>{label}</CText>
                )
            }
            <View style={styles.inputContainer}>

                {icon && <Ionicons name={icon as any} size={22} color="#999" style={styles.icon} />}

                <TextInput
                    editable={editable}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChangeText}
                    style={[styles.input, style || {}]}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    secureTextEntry={hide}
                    multiline={multiline}
                />

                {showToggle && (
                    <CTouchableOpacity onPress={() => setHide(!hide)}>
                        <Ionicons name={hide ? 'eye-off-outline' : 'eye-outline'} size={22} color="#999" />
                    </CTouchableOpacity>
                )}

            </View >
        </>

    )

};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 15,
        borderColor: "#555"
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontFamily: 'PoppinsRegular',
        color: '#333',
    },
    icon: {
        marginRight: 8,
    },
    label: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 14,
        color: '#333',
    },
})

export default CTextField;
