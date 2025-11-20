import CText from '@/components/common/CText';
import CTextField from '@/components/common/CTextField';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import { primaryOrange } from '@/constants/colors';
import { useChangePasswordMutation } from '@/store/api/v1/user';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import KeyboardAvoiding from '../common/KeyboardAvoiding';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            console.log("PasswrDTest");
            return Alert.alert(
                "Weak Password",
                "Password must contain at least one capital letter, one special character, and be at least 8 characters long."
            );
        }


        let payload = {
            currentPassword,
            newPassword
        };
        try {
            const result = await changePassword(payload).unwrap();
            // The API call was successful, so clear fields and show success message
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            Alert.alert('Success', 'Password updated successfully!');
        } catch (error: any) {
            // Error response will be in error.data or error.error if server error
            let errorMsg = "Something went wrong. Please try again.";
            if (error && error.data && typeof error.data === 'object') {
                // Try to extract first server error message if exists
                const firstError = typeof error.data?.message === 'string'
                    ? error.data.message
                    : Array.isArray(error.data?.errors)
                        ? error.data.errors[0]
                        : null;
                if (firstError) errorMsg = firstError;
            }
            Alert.alert('Update Failed', errorMsg);
            console.log("Password update error response:", error);
        }
    };

    return (
        <KeyboardAvoiding
        >
            <CText style={styles.title}>Change Password</CText>

            <CTextField
                showToggle
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                icon="lock-closed-outline"
            />

            <CTextField
                showToggle
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                icon="lock-closed-outline"
            />

            <CTextField
                showToggle
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                icon="lock-closed-outline"
            />

            <CTouchableOpacity
                style={[
                    styles.updateBtn,
                    (isLoading || !currentPassword || !newPassword || !confirmPassword) && { opacity: 0.5 }
                ]}
                onPress={handleUpdatePassword}
                disabled={isLoading}
            >
                <CText style={styles.updateBtnText}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                </CText>
            </CTouchableOpacity>
        </KeyboardAvoiding>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    innerContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
    },
    updateBtn: {
        backgroundColor: primaryOrange,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    updateBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ChangePassword;
