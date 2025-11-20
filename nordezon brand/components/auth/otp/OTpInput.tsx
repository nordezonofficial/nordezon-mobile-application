import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface OtpInputProps {
    length?: number;
    onChangeOtp?: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 4, onChangeOtp }) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const inputs = useRef<TextInput[]>([]);

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;

        setOtp(newOtp);
        onChangeOtp && onChangeOtp(newOtp.join(''));

        if (text && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (event: any, index: number) => {
        if (event.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {Array(length)
                .fill(0)
                .map((_, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => {
                            if (ref) inputs.current[index] = ref;
                        }}
                        value={otp[index]}
                        onChangeText={(text) => handleChange(text.replace(/[^0-9]/g, ''), index)}
                        onKeyPress={(event) => handleKeyPress(event, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        style={styles.inputBox}
                    />
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        alignSelf: 'center',
    },
    inputBox: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        fontSize: 24,
        borderRadius: 10,
        fontFamily: 'PoppinsSemiBold',
        color: '#333',
    },
});

export default OtpInput;
