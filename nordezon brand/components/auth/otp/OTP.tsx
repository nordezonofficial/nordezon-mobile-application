import OTpInput from '@/components/auth/otp/OTpInput';
import OtpTimer from '@/components/auth/otp/OtpTimer';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import CButton from '@/components/common/CButton';
import CText from '@/components/common/CText';
import CTextField from '@/components/common/CTextField';
import KeyboardAvoiding from '@/components/common/KeyboardAvoiding';
import { primaryOrange } from '@/constants/colors';
import { FORGOT, VERIFY } from '@/constants/keys';
import { useVerifyOTPMutation } from '@/store/api/v1/auth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function OTP() {
    /* -- navigation --*/
    const router = useRouter();
    const { type } = useLocalSearchParams<{ type?: 'FORGOT' | 'VERIFY' }>();
    const [step, setStep] = useState<'send' | 'VERIFY' | 'FORGOT' | 'RESET_PASSWORD'>(type as any); // step control
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [VerifyEmail, { isLoading, isError }] = useVerifyOTPMutation();
    const isForgotPassword = type == FORGOT;
    const [OTP, setOTP] = useState<any>()
    console.log("step", step, isForgotPassword);

    // Success Alert
    const showSuccessAlert = () => {
        Alert.alert(
            "Account Created Successfully! 🎉",
            "Your account has been created successfully. Once your account is approved by admin, you will be able to login.",
            [
                {
                    text: "OK",
                    onPress: () => {
                        // Navigate back to login or home
                        router.push('/(auth)/login'); // Adjust the route as needed
                    }
                }
            ],
            { cancelable: false }
        );
    };

    // Error Alert
    const showErrorAlert = (message: string) => {
        Alert.alert(
            "Verification Failed",
            message || "Failed to verify OTP. Please try again.",
            [
                {
                    text: "OK",
                    style: "default"
                }
            ]
        );
    };

    const handleVerifyOTP = async () => {
        const email = await AsyncStorage.getItem('@email');
        // router.push('/(brand)/brandHome')
        let payload = {
            email: email,
            otp: OTP
        }
        if (step == FORGOT) {
            setStep('VERIFY');
        } else if (step == VERIFY && isForgotPassword) {
            setStep('RESET_PASSWORD');
        } else if (step == 'VERIFY' && !isForgotPassword) {

            try {
                const response = await VerifyEmail(payload);

                // Check if the response indicates success
                if (response?.data?.data?.emailVerified === true) {
                    // Success case
                    showSuccessAlert();
                } else if (response?.error) {
                    // Error case - extract error message
                    let errorMessage = "Failed to verify OTP. Please try again.";
                    if ('data' in response.error) {
                        const errorData = (response.error as { data: any }).data;
                        errorMessage = errorData?.message || errorData?.data?.message || errorMessage;
                    }
                    showErrorAlert(errorMessage);
                } else {
                    // Unexpected response format
                    showErrorAlert("An unexpected error occurred. Please try again.");
                }
            } catch (error) {
                console.error("OTP Verification Error:", error);
                showErrorAlert("Network error. Please check your connection and try again.");
            }
        }
    };

    const handleChangeOTP = (otp: string) => {
        setOTP(otp)
    }

    const handlePasswordReset = () => {
        if (password !== confirmPassword) {
            // Handle password mismatch error
            console.log("Passwords don't match");
            return;
        }
        if (password.length < 6) {
            // Handle weak password error
            console.log("Password too short");
            return;
        }
        // Handle password reset logic here
        console.log("Password reset successful");
        router.back(); // or navigate to login
    };

    return (
        <BackgroundContainer>
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <KeyboardAvoiding>
                {/* OTP Illustration */}
                <Image
                    source={require('../../../assets/images/Ulogo.png')}
                    style={styles.image}
                />

                {/* Title */}
                <CText style={styles.title}>
                    {isForgotPassword
                        ? step == FORGOT
                            ? 'Forgot Password'
                            : step == 'VERIFY'
                                ? 'Verify OTP'
                                : 'Reset Password'
                        : 'Verify Your OTP'}
                </CText>

                {/* Subtitle */}
                <CText style={styles.subtitle}>
                    {isForgotPassword
                        ? step == FORGOT
                            ? 'Enter your registered email to receive an OTP.'
                            : step == 'VERIFY'
                                ? 'Enter the 4-digit OTP sent to your email.'
                                : 'Create a new secure password for your account.'
                        : 'Enter the 4-digit code sent to your registered email.'}
                </CText>

                {/* OTP Input – only show when VERIFYing */}
                {step === VERIFY && <OTpInput onChangeOtp={handleChangeOTP} />}

                {/* Timer – only show when VERIFYing */}
                {step === VERIFY && <OtpTimer />}

                {/* Email Field – only show when sending OTP */}
                {step === FORGOT &&
                    <CTextField
                        label="Email Address"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        icon="mail-outline"
                    />}

                {/* Password Reset Fields – only show when resetting password */}
                {step === 'RESET_PASSWORD' && (
                    <>
                        <CTextField
                            label="Password"
                            placeholder="Enter password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            showToggle
                            icon="lock-closed-outline"
                        />
                        <CTextField
                            label="Confirm New Password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            showToggle
                            icon="lock-closed-outline"
                        />
                    </>
                )}

                {/* Button */}
                <CButton
                    onPress={step === 'RESET_PASSWORD' ? handlePasswordReset : handleVerifyOTP}
                    loading={isLoading}
                    text={
                        step == FORGOT
                            ? 'Send OTP'
                            : step == 'VERIFY'
                                ? isForgotPassword
                                    ? 'Verify OTP'
                                    : 'Verify & Continue'
                                : step == 'RESET_PASSWORD'
                                    ? 'Reset Password'
                                    : 'Confirm'
                    }
                    style={styles.button}
                    textStyle={styles.buttonText}
                />
            </KeyboardAvoiding>
        </BackgroundContainer>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 10,
        left: 5,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 25,
        padding: 6,
    },
    image: {
        width: 250,
        height: 200,
    },
    title: {
        fontSize: 22,
        fontFamily: 'PoppinsSemiBold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: primaryOrange,
        borderRadius: 50,
        paddingVertical: 15,
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16,
    },
    passwordField: {
        marginTop: 10,
    },
});
