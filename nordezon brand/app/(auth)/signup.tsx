import BrandForm from '@/components/auth/BrandForm';
import ShopperForm from '@/components/auth/ShopperForm';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import CButton from '@/components/common/CButton';
import CText from '@/components/common/CText';
import KeyboardAvoiding from '@/components/common/KeyboardAvoiding';
import { primaryOrange } from '@/constants/colors';
import { BRAND, SHOPPER, VERIFY } from '@/constants/keys';
import { useCreateUserMutation } from '@/store/api/v1/auth';
import { registerForPushNotificationsAsync } from '@/utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
const { width } = Dimensions.get("window");
const Signup = () => {
    const { type } = useLocalSearchParams<{ type?: 'SHOPPER' | 'BRAND' }>();
    const [activeTab, setActiveTab] = useState<'SHOPPER' | 'BRAND'>(
        type == BRAND ? BRAND : SHOPPER
    );
    const [formData, setFormData] = useState<any>()
    const [step, setStep] = useState(1);
    const [stepMode, setStepMode] = useState('one');
    const [loading, setLoading] = useState(false)

    /* -- navigation --*/
    const navigation = useRouter();

    /* ---  User Account Api Request  --- */
    const [createUserAccount, { isLoading, isError }] = useCreateUserMutation();
    /* --- Handle Submit --- */
    const handleSubmit = async () => {
        console.log("address", formData.address);
        
        // General required fields
        if (!formData.password?.trim()) return Alert.alert("Missing Field", "Password is required.");
        if (!formData.email?.trim()) return Alert.alert("Missing Field", "Email is required.");
        if (!formData.fullName?.trim()) return Alert.alert("Missing Field", "Full name is required.");
        if (!formData.phoneNumber?.trim()) return Alert.alert("Missing Field", "Phone number is required.");
        if (!formData.address?.trim()) return Alert.alert("Missing Field", "Address is required.");
        if (!formData.agreed) return Alert.alert("Terms & Conditions", "Please agree to continue.");

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            return Alert.alert(
                "Weak Password",
                "Password must contain at least one capital letter, one special character, and be at least 8 characters long."
            );
        }
        const deviceToken = await registerForPushNotificationsAsync();
        if (!deviceToken) return;

        // Confirm password check
        if (formData.password !== formData.confirmPassword) {
            return Alert.alert("Password Mismatch", "Password and Confirm Password must match.");
        }

        let payload: any = {};
        let cleanedPayload: any = {};
        // Prepare and clean each payload as per the role
        if (activeTab === 'BRAND') {
            // Extra required fields for brands
            if (!formData.cnic?.trim()) return Alert.alert("Missing Field", "CNIC is required.");
            if (!formData.brandName?.trim()) return Alert.alert("Missing Field", "Brand name is required.");
            if (!formData.logo?.trim()) return Alert.alert("Missing Field", "Logo is required.");
            setLoading(true);

            // Clean up payload for brand
            payload = {
                email: formData.email?.trim(),
                password: formData.password,
                fullName: formData.fullName?.trim(),
                userType: "BRAND",
                phoneNumber: formData.phoneNumber?.toString(),
                CNIC: formData.cnic?.trim(),
                brandName: formData.brandName?.trim(),
                logoUrl: formData.logo,
                address: formData.address?.trim(),
                city: formData.city,
                deviceToken,
                isTCagreed: !!formData.agreed,
            };

            // Remove any falsy/undefined/null fields
            Object.keys(payload).forEach(key => {
                if (
                    payload[key] !== undefined &&
                    payload[key] !== null &&
                    (typeof payload[key] === "boolean" || (typeof payload[key] === "string" && payload[key].trim() !== "") || typeof payload[key] === "number")
                ) {
                    cleanedPayload[key] = payload[key];
                }
            });

        } else if (activeTab === "SHOPPER") {
            setLoading(true);
            // Clean up payload for shopper
            payload = {
                email: formData.email?.trim(),
                password: formData.password,
                fullName: formData.fullName?.trim(),
                userType: "USER",
                phoneNumber: formData.phoneNumber?.toString(),
                profile: formData?.logo || null,
                address: formData.address?.trim(),
                city: formData.city,
                deviceToken,
                isTCagreed: !!formData.agreed,
            };

            // Remove any falsy/undefined/null fields
            Object.keys(payload).forEach(key => {
                if (
                    payload[key] !== undefined &&
                    payload[key] !== null &&
                    (typeof payload[key] === "boolean" || (typeof payload[key] === "string" && payload[key].trim() !== "") || typeof payload[key] === "number" || Array.isArray(payload[key]))
                ) {
                    cleanedPayload[key] = payload[key];
                }
            });
        }

        try {
            const response: any = await createUserAccount(cleanedPayload);

            // Handle response as per conventional backend structure
            if (response.data && response.data.status === "success") {
                await AsyncStorage.setItem('@email', formData.email);
                Alert.alert(
                    "Success",
                    `${response.data.message}`,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                navigation.push({
                                    pathname: "/(otp)/otp",
                                    params: { type: VERIFY },
                                });
                            }
                        }
                    ]
                );
            }
            else if (response?.error) {
                let errorMessage = "Registration failed. Please try again.";
                if (
                    typeof response?.error === "object" && response.error?.data &&
                    typeof response.error?.data === "object" &&
                    "message" in response.error?.data
                ) {
                    errorMessage = (response.error?.data as { message?: string }).message || errorMessage;
                }
                Alert.alert("Registration Error", errorMessage);
            }
        } catch (error) {
            console.log("Error during registration:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFormData = React.useCallback((payload: any) => {
        setFormData(payload);
    }, []);

    return (
        <BackgroundContainer>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/images/Ulogo.png')} style={styles.logo} />
            </View>

            {/* Title */}
            <CText style={styles.title}>Create Your Account</CText>
            <CText style={styles.subtitle}>Join us today and start exploring amazing opportunities!</CText>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'SHOPPER' && styles.activeTab]}
                    onPress={() => setActiveTab('SHOPPER')}
                >
                    <CText style={[styles.tabText, activeTab === 'SHOPPER' && styles.activeTabText]}>
                        Shopper
                    </CText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'BRAND' && styles.activeTab]}
                    onPress={() => setActiveTab('BRAND')}
                >
                    <CText style={[styles.tabText, activeTab === 'BRAND' && styles.activeTabText]}>
                        Brand
                    </CText>
                </TouchableOpacity>
            </View>

            {/* Form */}
            <KeyboardAvoiding scrollToTopOnStepChange={step}>
                {activeTab === 'SHOPPER' ? <ShopperForm onDataChange={handleFormData} /> : <BrandForm stepMode={stepMode} onDataChange={handleFormData} step={step} setStep={setStep} />}

                {
                    stepMode != "one" && activeTab == "BRAND" && step < 4 ? (
                        <>

                        </>
                    ) : (
                        <CButton
                            text={activeTab === 'SHOPPER' ? "Register as Shopper" : "Register as Brand"}
                            style={styles.button}
                            loading={loading}
                            textStyle={styles.buttonText}
                            onPress={handleSubmit}
                        />
                    )
                }

            </KeyboardAvoiding>
        </BackgroundContainer>
    );
};

const styles = StyleSheet.create({
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
    title: {
        fontSize: 20,
        fontFamily: 'PoppinsSemiBold',
        color: '#333',
        textAlign: 'left',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'PoppinsRegular',
        color: '#666',
        marginBottom: 10,
    },
    logoContainer: {
        width: width * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 110,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f2f2f2',
        borderRadius: 30,
        marginBottom: 10,
        padding: 5,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 25,
    },
    activeTab: {
        backgroundColor: primaryOrange,
    },
    tabText: {
        fontFamily: 'PoppinsSemiBold',
        color: '#777',
        fontSize: 14,
    },
    activeTabText: {
        color: '#fff',
    },
});

export default Signup;