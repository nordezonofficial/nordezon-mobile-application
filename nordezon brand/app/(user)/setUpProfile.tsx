import BrandForm from '@/components/auth/BrandForm'
import ShopperForm from '@/components/auth/ShopperForm'
import BackgroundContainer from '@/components/common/BackgroundContainer'
import CText from '@/components/common/CText'
import KeyboardAvoiding from '@/components/common/KeyboardAvoiding'
import { useSetUpUserProfileMutation } from '@/store/api/v1/user'
import { setUser } from '@/store/slices/user'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Dimensions, Image, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const { width } = Dimensions.get('window')
const setUpProfile = () => {
    const [stepMode, setStepMode] = useState<any>('all')
    const [step, setStep] = useState(1)
    const [scrollToDown, setScrollToDown] = useState(1)
    const { user, accessToken: token } = useSelector((state: any) => state.user)
    const [formData, setFormData] = useState<any>()
    const [setUpProfile, { isLoading, isError }] = useSetUpUserProfileMutation()
    const handleFormData = React.useCallback((payload: any) => {
        setFormData(payload);
    }, []);



    const dispatch = useDispatch();

    const navigation = useRouter()


    const handleSetupProfile = async () => {
        try {
            let payload: any = {
            };
            // ✅ Validation
            if (user.role == "BRAND") {
                if (!formData.workingHours || formData.workingHours.length === 0) {
                    Alert.alert('Missing Field', 'Please set your working hours.');
                    return;
                }


                if (!formData.activeOn || formData.activeOn.length === 0) {
                    Alert.alert('Missing Field', 'Please select the days you are active on.');
                    return;
                }

                if (!formData.banners || formData.banners.length === 0) {
                    Alert.alert('Missing Field', 'Please upload at least one banner image.');
                    return;
                }

                if (!formData.aboutUs || formData.aboutUs.trim().length === 0) {
                    Alert.alert('Missing Field', 'Please enter your "About Us" description.');
                    return;
                }

                if (!formData.bio || formData.bio.trim().length === 0) {
                    Alert.alert('Missing Field', 'Please enter your bio.');
                    return;
                }
            }

            if (!formData.selectedCategories || formData.selectedCategories.length === 0) {
                Alert.alert('Missing Field', 'Please select at least one category.');
                return;
            }

            if (user.role == "BRAND") {
                payload = {
                    workingHours: formData.workingHours,
                    categoryIds: formData.selectedCategories,
                    activeOn: formData.activeOn,
                    bannerUrls: formData.banners,
                    aboutUs: formData.aboutUs,
                    bio: formData.bio,
                };
            }

            if (user.role == "USER") {
                let userInterestcategoriest = [...formData.selectedCategories, ...formData.selectedSubCategories, ...formData.selectedSubSubCategories]
                payload = {
                    categoryIds: userInterestcategoriest,
                    bio: formData.bio,
                };

            }


            let response = await setUpProfile(payload)
            // const result = await fetch(`${API_URL}/api/v1/user/update-personal-info`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${token}`,
            //     },
            //     body: JSON.stringify(payload),
            // });

            // const response: any = await result.json();

            console.log("newUser", response);

            let accessToken: string;
            let newUser: any;
            if (response?.data?.status === "success") {
                newUser = response.data.data;
                accessToken = response.data.data.accessToken;


                Alert.alert(
                    "Profile Updated 🎉",
                    "Your profile has been successfully setup!",

                    [
                        {
                            text: "OK",
                            style: "default",
                            onPress: () => {
                                if (user.role == "BRAND") {
                                    navigation.push('/(brand)/brandHome')
                                } else {
                                    navigation.push('/(home)/(tabs)/home')
                                }
                            } // 👈 Move navigation here
                        }
                    ]
                );




                payload = {
                    accessToken: accessToken,
                    user: newUser,
                }
                dispatch(setUser(payload))
                await AsyncStorage.setItem('@access_token', accessToken);

            }




        } catch (error: any) {
            console.error('Setup Profile Error:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
    };


    return (
        <BackgroundContainer>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/images/Ulogo.png')} style={styles.logo} />
            </View>
            {/* Title */}
            <CText style={styles.title}>Setup Your Profile</CText>
            <CText style={styles.subtitle}>Join us today and start exploring amazing opportunities!</CText>


            <KeyboardAvoiding scrollToTopOnStepChange={step} scrollToBottomOnStepChange={scrollToDown}>
                {
                    user.role == "BRAND" ? (
                        <>
                            <BrandForm stepMode={stepMode} handleSetupProfile={handleSetupProfile} onDataChange={handleFormData} step={step} setStep={setStep} />
                        </>
                    ) : (
                        <ShopperForm setScrollToDown={setScrollToDown} isLoading={isLoading} handleSetupProfile={handleSetupProfile} onDataChange={handleFormData} isSetupProfile={true} />
                    )
                }
            </KeyboardAvoiding>
        </BackgroundContainer>
    )
}

const styles = StyleSheet.create({
    logoContainer: {
        width: width * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 110,
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
})

export default setUpProfile