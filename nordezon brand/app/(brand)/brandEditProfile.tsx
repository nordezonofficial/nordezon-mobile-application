import BrandForm from '@/components/auth/BrandForm';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import BrandBreadCrums from '@/components/common/BrandBreadCrums';
import KeyboardAvoiding from '@/components/common/KeyboardAvoiding';
import { useSetUpUserProfileMutation } from '@/store/api/v1/user';
import { setUser } from '@/store/slices/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';


const brandEditProfile = () => {
    const [step, setStep] = useState(1);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<any>()
    const navigation = useRouter()

    const handleFormData = React.useCallback((payload: any) => {
        setFormData(payload);
    }, []);


    useFocusEffect(
        useCallback(() => {
            console.log("Screen is focused — resetting step");
            setStep(1);

            // optional cleanup
            return () => {
                console.log("Screen unfocused");
            };
        }, [])
    );
    const { user, accessToken } = useSelector((state: any) => state.user)

    const [setUpProfile, { isLoading, isError }] = useSetUpUserProfileMutation()

    const handleSetupProfile = async () => {
        try {
            
            // ✅ Validation
            if (!formData.workingHours || formData?.workingHours.length === 0) {
                Alert.alert('Missing Field', 'Please set your working hours.');
                return;
            }

            if (!formData.selectedCategories || formData?.selectedCategories.length === 0) {
                Alert.alert('Missing Field', 'Please select at least one category.');
                return;
            }

            if (!formData.activeOn || formData?.activeOn?.length === 0) {
                Alert.alert('Missing Field', 'Please select the days you are active on.');
                return;
            }

            if (!formData.banners || formData?.banners?.length === 0) {
                Alert.alert('Missing Field', 'Please upload at least one banner image.');
                return;
            }

            if (!formData.aboutUs || formData?.aboutUs.trim().length === 0) {
                Alert.alert('Missing Field', 'Please enter your "About Us" description.');
                return;
            }

            if (!formData.bio || formData?.bio.trim().length === 0) {
                Alert.alert('Missing Field', 'Please enter your bio.');
                return;
            }


            // ✅ All required fields are available
            let payload: any = {
                email: formData.email,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                CNIC: formData.cnic,
                brandName: formData.brandName,
                logoUrl: formData.logo,
                address: formData.address,
                city: formData.city,
                workingHours: formData.workingHours,
                categoryIds: formData.selectedCategories,
                activeOn: formData.activeOn,
                bannerUrls: formData.banners,
                aboutUs: formData.aboutUs,
                bio: formData.bio,
            };



            const response = await setUpProfile(payload);

            if (response?.data?.status === "success") {
                const user = response.data.data;
                const accessToken = response.data.data.accessToken;

                const payload = {
                    accessToken: accessToken,
                    user: user,
                };

                dispatch(setUser(payload));
                await AsyncStorage.setItem('@access_token', accessToken);

                Alert.alert(
                    "Profile Updated 🎉",
                    "Your profile has been successfully setup!",
                    [
                        {
                            text: "OK",
                            style: "default",
                            onPress: () => navigation.push('/(brand)/profile')  // 👈 Move navigation here
                        }
                    ]
                );
            }




        } catch (error: any) {
            console.error('Setup Profile Error:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
    };
    return (

        <BackgroundContainer>
            <BrandBreadCrums paddingHorizontal={0} title={'Edit Your profile'}
                subtitle={'Keep your brand details up to date and maintain a strong professional presence.'}
            ></BrandBreadCrums>
            <KeyboardAvoiding scrollToTopOnStepChange={step}>
                <BrandForm onDataChange={handleFormData} isEdit={true} step={step} handleSetupProfile={handleSetupProfile} stepMode={'all'} setStep={setStep} />
            </KeyboardAvoiding>
        </BackgroundContainer>

    )
}

export default brandEditProfile