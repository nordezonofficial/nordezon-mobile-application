import { primaryOrange } from '@/constants/colors';
import { useUploadFileMutation } from '@/store/api/v1/files';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    View
} from 'react-native';

import CityPicker from '../CityList';
import CategoriesSelection from '../common/CategoriesSelection';
import CButton from '../common/CButton';
import CText from '../common/CText';
import CTextField from '../common/CTextField';
import CTouchableOpacity from '../common/CTouchableOpacity';

const ShopperForm = ({ onDataChange, isSetupProfile = false, setScrollToDown, isLoading, handleSetupProfile }:
    {
        isLoading?: boolean,
        handleSetupProfile?: () => void,
        onDataChange?: (data: any) => void,
        setScrollToDown?: (data: any) => void,
        isSetupProfile?: boolean

    }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [city, setCity] = useState(null);
    const [agreed, setAgreed] = useState(false);
    const [phone, setPhoneNumber] = useState<any>()
    const [address, setAddress] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [logo, setLogo] = useState<string | null>('');
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const [bio, setBio] = useState('');

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
    const [selectedSubSubCategories, setSelectedSubSubCategories] = useState<number[]>([]);
    // Function to collect all form data
    const getAllFormData = () => {
        return {
            selectedCategories,
            selectedSubCategories,
            selectedSubSubCategories,
            fullName,
            email,
            logo,
            password,
            confirmPassword,
            address,
            phoneNumber: phone,
            city,
            agreed,
            bio, // add bio
        };
    };

    // Send data to parent whenever any field changes
    React.useEffect(() => {
        if (onDataChange) {
            onDataChange(getAllFormData());
        }
    }, [fullName, email, password, phone, city, agreed, bio, onDataChange, selectedCategories,
        selectedSubCategories,
        selectedSubSubCategories]);

    const removeImage = (type: 'logo' | 'banner', index?: number) => {
        if (type === 'logo') {
            setLogo(null);
        }
    };
    /* --- upload file to the server ---*/
    const [uploadFile] = useUploadFileMutation();

    const pickImage = async (type: 'logo' | 'banner') => {
        if (type === 'logo') setUploadingLogo(true);

        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission required', 'Please allow access to your gallery.');
                if (type === 'logo') setUploadingLogo(false);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'], // updated
                allowsEditing: true,
                aspect: type === 'logo' ? [1, 1] : [16, 9],
                quality: 0.8,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                const fileName = uri.split("/").pop() || "image.jpg";
                const fileType = fileName.split(".").pop();
                const formData = new FormData();
                formData.append("files", {
                    uri,
                    name: fileName,
                    type: `image/${fileType}`,
                } as any);

                const response: any = await uploadFile(formData).unwrap();
                const { data } = response;
                if (data && data.length > 0) {
                    if (type === 'logo') {
                        setLogo(data[0]);
                    }
                }
            }
        } catch (err) {
            Alert.alert('Upload failed', 'There was a problem uploading the image.');
        } finally {
            if (type === 'logo') setUploadingLogo(false);
        }
    };


    // Handle subcategory selection logic and scroll if sub-subcategories length < 10
    const handleSetSelectedSubCategories = (subCategories: number[]) => {
        setSelectedSubCategories(subCategories);
    };

    return (
        <>
            {
                !isSetupProfile ? (
                    <>
                        <CTextField
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChangeText={setFullName}
                            icon="person-outline"
                        />

                        <CTextField
                            label="Email Address"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon="mail-outline"
                        />

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
                            label="Confirm Password"
                            placeholder="Enter confirm password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            showToggle
                            icon="lock-closed-outline"
                        />
                        <CTextField
                            label="Phone Number"
                            placeholder="Enter Phone number"
                            value={phone}
                            onChangeText={setPhoneNumber}
                            icon="call-outline"
                            keyboardType="phone-pad"
                        />

                        <CityPicker city={city} setCity={setCity}></CityPicker>
                        <CTextField label="Address" value={address} onChangeText={setAddress} placeholder="Enter your address" icon='business-outline' />
                        <CText style={styles.sectionTitle}>Profile Image</CText>
                        <CText style={styles.label}>Upload Profile Image</CText>
                        <CTouchableOpacity
                            style={[styles.logoBox, uploadingLogo && { opacity: 0.6 }]}
                            onPress={() => {
                                if (!uploadingLogo) pickImage('logo');
                            }}
                            disabled={uploadingLogo}
                        >
                            {logo ? <Image source={{ uri: logo }} style={styles.logoImage} /> : (
                                uploadingLogo
                                    ? <ActivityIndicator size={30} color={primaryOrange} />
                                    : <Ionicons name="camera-outline" size={30} color="#aaa" />
                            )}
                            {logo && !uploadingLogo && (
                                <CTouchableOpacity style={styles.removeButton} onPress={() => removeImage('logo')}>
                                    <Ionicons name="close-circle" size={22} color="#fff" />
                                </CTouchableOpacity>
                            )}
                        </CTouchableOpacity>


                        <CTouchableOpacity
                            style={[styles.checkboxContainer, { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }]}
                            onPress={() => setAgreed(!agreed)}
                            activeOpacity={0.9}
                        >
                            {/* Checkbox icon */}
                            <Ionicons
                                name={agreed ? 'checkbox-outline' : 'square-outline'}
                                size={22}
                                color={agreed ? primaryOrange : '#999'}
                            />

                            {/* Text with clickable links */}
                            <CText style={[styles.checkboxText, { marginLeft: 8 }]}>
                                I agree with{' '}
                            </CText>

                            <CTouchableOpacity onPress={() => console.log('Terms clicked')}>
                                <CText style={[styles.linkText]}>Terms & Conditions</CText>
                            </CTouchableOpacity>

                            <CText style={[styles.checkboxText]}> and </CText>

                            <CTouchableOpacity onPress={() => console.log('Privacy clicked')}>
                                <CText style={[styles.linkText]}>Privacy Policy</CText>
                            </CTouchableOpacity>
                        </CTouchableOpacity>
                    </>


                ) : (
                    <View style={styles.setupContainer}>
                        {/* Add Bio text field here only when isSetupProfile is true */}
                        <CTextField
                            label="Bio"
                            placeholder="Write something about yourself"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            style={{ marginTop: 0 }}
                            icon="person-circle-outline"
                        />

                        <CategoriesSelection
                            allowManyMainCategories={true}
                            selectedCategories={selectedCategories}
                            selectedSubCategories={selectedSubCategories}
                            selectedSubSubCategories={selectedSubSubCategories}
                            setSelectedCategories={setSelectedCategories}
                            setSelectedSubCategories={handleSetSelectedSubCategories}
                            setSelectedSubSubCategories={setSelectedSubSubCategories}
                            hasOnlyMainCategories={false}
                        >
                        </CategoriesSelection>
                        <View style={{ height: 30 }}></View>

                        <CButton
                            loading={isLoading}
                            style={styles.submitButton}
                            text="Save"
                            onPress={() => {
                                handleSetupProfile && handleSetupProfile()
                            }}
                        />
                    </View>
                )
            }

        </>


    );
};

const styles = StyleSheet.create({
    sectionTitle: { fontFamily: 'PoppinsSemiBold', textAlign: "left", fontSize: 18, marginVertical: 12, color: '#333' },
    label: { fontFamily: 'PoppinsSemiBold', fontSize: 14, marginBottom: 6 },
    submitButton: {
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 10,
        justifyContent: "center",
        backgroundColor: primaryOrange
    },
    setupContainer: {

    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
        backgroundColor: '#fff',
        paddingVertical: 40,
    },
    logoImage: { width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 12 },
    logoBox: { width: 120, height: 120, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' },
    removeButton: { position: 'absolute', top: 5, right: 5, backgroundColor: primaryOrange, borderRadius: 20, padding: 2 },

    title: {
        fontSize: 20,
        fontFamily: 'PoppinsSemiBold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
    },

    checkboxContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    checkboxText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
        color: '#555',
    },
    linkText: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 14,
        color: primaryOrange,
    },


});

export default ShopperForm;
