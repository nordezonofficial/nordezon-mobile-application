import { primaryOrange } from '@/constants/colors';
import { useResentOTPMutation } from '@/store/api/v1/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OtpTimerProps {
    initialSeconds?: number;
    onResend?: () => void;
}

const OtpTimer: React.FC<OtpTimerProps> = ({ initialSeconds = 30, onResend }) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(true);
    const [resentOTP] = useResentOTPMutation()

    useEffect(() => {
        let timer: any;

        if (isActive && seconds > 0) {
            timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
        }

        return () => clearTimeout(timer);
    }, [isActive, seconds]);

    const handleResend = async () => {
        setSeconds(initialSeconds);
        setIsActive(true);
        const email = await AsyncStorage.getItem('@email');

        let payload = {
            email: email
        }
        resentOTP(payload)
        onResend && onResend();

    };

    return (
        <View style={styles.container}>
            {isActive && seconds > 0 ? (
                <Text style={styles.timerText}>
                    Next OTP can be sent after{' '}
                    <Text style={styles.highlight}>{seconds}</Text> seconds
                </Text>
            ) : (
                <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 10,
    },
    timerText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'PoppinsRegular',
    },
    highlight: {
        color: primaryOrange,
        fontFamily: 'PoppinsSemiBold',
    },
    resendText: {
        fontSize: 14,
        color: primaryOrange,
        fontFamily: 'PoppinsSemiBold',
        textDecorationLine: 'underline',
    },
});

export default OtpTimer;
