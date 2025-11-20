import { primaryOrange } from '@/constants/colors';
import { useUploadFileMutation } from '@/store/api/v1/files';
import { useGetCategoriestListQuery } from '@/store/api/v1/user';
import { setCategoriesList } from '@/store/slices/user';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CityPicker from '../CityList';
import CategoriesSelection from '../common/CategoriesSelection';
import CText from '../common/CText';
import CTextField from '../common/CTextField';
import CTouchableOpacity from '../common/CTouchableOpacity';
import SocialLinksForm from './SocialLinksForm';
import WorkingHoursForm from './WorkingHoursForm';

const MAX_BIO_LENGTH = 200;

const BrandForm = ({
    step,
    setStep,
    isEdit = false,
    stepMode = 'all', // 'one' or 'all'
    onDataChange, // Add callback prop to send data to parent
    handleSetupProfile, // Add callback prop to send data to parent
}: {
    step: number
    isEdit?: boolean
    setStep: (param: number) => void
    stepMode?: any
    onDataChange?: (data: any) => void // Add type for callback
    handleSetupProfile?: () => void
}) => {

    const { user, categories } = useSelector((state: any) => state.user)

    // Personal & Contact Info
    const [fullName, setFullName] = useState(isEdit ? user.fullName : '');
    const [email, setEmail] = useState(isEdit ? user.email : "");
    const [contactNumber, setContactNumber] = useState(isEdit ? user.phoneNumber : 0);
    const [cnic, setCnic] = useState(isEdit ? user.CNIC : '');
    const [city, setCity] = useState(isEdit ? user.city : '');
    const [address, setAddress] = useState(isEdit ? user.address : '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
    const [selectedSubSubCategories, setSelectedSubSubCategories] = useState<number[]>([]);
    // Brand Info
    const [brandName, setBrandName] = useState(isEdit ? user.brandName : '');
    const [businessType, setBusinessType] = useState('');
    const [activeOn, setActiveOn] = useState<any>(isEdit ? user.activeOns : []);



    // Media & Bio  
    const [bio, setBio] = useState(isEdit ? user.bio : "");
    const [aboutUs, setAboutUs] = useState(isEdit ? user.aboutUs : []);
    const [logo, setLogo] = useState<string | null>(isEdit ? user.logoUrl : '');
    const [banners, setBanners] = useState<any>(isEdit ? user.bannerUrls : []);

    // Loading state for file uploads
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);

    const [workingHours, setWorkingHours] = useState(
        isEdit
            ? user.workingHours.map((item: any) => ({
                day: item.day.charAt(0).toUpperCase() + item.day.slice(1).toLowerCase(), // optional: format day
                open: new Date(item.open).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }),
                close: new Date(item.close).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }),
                isClosed: item.isClosed,
            }))
            : [
                { day: 'Monday', open: '09:00', close: '17:00', isClosed: false },
                { day: 'Tuesday', open: '09:00', close: '17:00', isClosed: false },
                { day: 'Wednesday', open: '09:00', close: '17:00', isClosed: false },
                { day: 'Thursday', open: '09:00', close: '17:00', isClosed: false },
                { day: 'Friday', open: '09:00', close: '17:00', isClosed: false },
                { day: 'Saturday', open: '09:00', close: '17:00', isClosed: false },
                { day: 'Sunday', open: '09:00', close: '17:00', isClosed: true },
            ]
    );

    const dispatch = useDispatch();

    // Terms
    const [agreed, setAgreed] = useState(false);

    const { data: categoriesList } = useGetCategoriestListQuery({});
    useEffect(() => {
        if (categoriesList) {
            dispatch(setCategoriesList(categoriesList.data))
        }

    }, [categoriesList])

    // Function to collect all form data
    const getAllFormData = () => {
        return {
            selectedCategories,
            selectedSubCategories,
            selectedSubSubCategories,
            fullName,
            email,
            password, // Add password field if needed
            confirmPassword, // Add password field if needed
            phoneNumber: contactNumber,
            contactNumber,
            cnic,
            city,
            address,
            brandName,
            businessType,
            activeOn,
            bio,
            logo,
            aboutUs,
            banners,
            workingHours,
            agreed
        };
    };

    // Send data to parent whenever any field changes
    React.useEffect(() => {
        onDataChange?.(getAllFormData());
    }, [
        fullName, email, contactNumber, password, cnic, city, address,
        brandName, businessType, activeOn, bio, logo, banners, workingHours, agreed,
        confirmPassword,
        aboutUs,
        selectedCategories,
        selectedSubCategories,
        selectedSubSubCategories,
    ]);
    /* --- upload file to the server ---*/
    const [uploadFile] = useUploadFileMutation();

    const pickImage = async (type: 'logo' | 'banner') => {
        if (type === 'logo') setUploadingLogo(true);
        if (type === 'banner') setUploadingBanner(true);

        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission required', 'Please allow access to your gallery.');
                if (type === 'logo') setUploadingLogo(false);
                if (type === 'banner') setUploadingBanner(false);
                return;
            }

            if (type === 'banner' && banners?.length >= 3) {
                Alert.alert('Limit reached', 'You can upload up to 3 banner images only.');
                if (type === 'banner') setUploadingBanner(false);
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
                    } else {
                        setBanners((prev: any) => [...prev, data[0]]);
                    }
                }
            }
        } catch (err) {
            Alert.alert('Upload failed', 'There was a problem uploading the image.');
        } finally {
            if (type === 'logo') setUploadingLogo(false);
            if (type === 'banner') setUploadingBanner(false);
        }
    };

    const removeImage = (type: 'logo' | 'banner', index?: number) => {
        if (type === 'logo') {
            setLogo(null);
        } else if (typeof index === 'number') {
            setBanners((prev: any) => prev.filter((_: any, i: number) => i !== index));
        }
    };

    const handleNext = () => {
        if (stepMode === 'one') {
            // In one step mode, we don't navigate between steps
            return;
        }
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (stepMode === 'one') {
            // In one step mode, we don't navigate between steps
            return;
        }
        if (step > 1) setStep(step - 1);
    };

    useEffect(() => {
        if (isEdit && user?.categories?.length > 0 && categories?.length > 0) {
            const mainSelected: number[] = [];
            const subSelected: number[] = [];
            const subSubSelected: number[] = [];

            user.categories.forEach((userCat: any) => {
                const mainCat = categories.find((c: any) => c.id === userCat.categoryId);
                if (mainCat) {
                    mainSelected.push(mainCat.id);

                    // Loop through category children (sub categories)
                    userCat.category.children?.forEach((subCat: any) => {
                        subSelected.push(subCat.id);

                        // Loop through sub category children (sub-sub categories)
                        subCat.children?.forEach((subSubCat: any) => {
                            subSubSelected.push(subSubCat.id);
                        });
                    });
                }
            });

            setSelectedCategories(mainSelected);
            setSelectedSubCategories(subSelected);
            setSelectedSubSubCategories(subSubSelected);
        }
    }, [isEdit, user, categories]);

    // Disable navigation (register/save/next) if uploading logo or banner
    const isUploading = uploadingLogo || uploadingBanner;

    return (
        <>
            {/* One Step Mode: Personal Info + Logo + Terms */}
            {stepMode === 'one' && (
                <>
                    <CText style={styles.sectionTitle}>Personal & Contact Information</CText>
                    <CTextField label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter full name" icon="person-outline" />
                    {
                        stepMode == 'one' && (
                            <CTextField label="Brand Name" value={brandName} onChangeText={setBrandName} placeholder="Enter brand name" icon="bag-sharp" />
                        )
                    }
                    <CTextField label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" icon="mail-outline" autoCapitalize="none" />
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
                    <CTextField label="Contact Number" value={contactNumber} onChangeText={setContactNumber} placeholder="Enter phone number" keyboardType="phone-pad" icon="call-outline" />
                    <CTextField label="CNIC" value={cnic} onChangeText={setCnic} placeholder="Enter CNIC" icon="card-outline" keyboardType="phone-pad" />
                    <CityPicker city={city} setCity={setCity} />
                    <CTextField label="Address" value={address} onChangeText={setAddress} placeholder="Enter your address" icon='business-outline' />

                    <CText style={styles.sectionTitle}>Brand Logo</CText>
                    <CText style={styles.label}>Upload Brand Logo</CText>
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

                    {/* Terms & Conditions */}
                    {!isEdit && stepMode == 'one' && (
                        <CTouchableOpacity
                            style={[styles.checkboxContainer, { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }]}
                            onPress={() => setAgreed(!agreed)}
                            activeOpacity={0.9}
                        >
                            <Ionicons name={agreed ? 'checkbox-outline' : 'square-outline'} size={22} color={agreed ? primaryOrange : '#999'} />

                            <CText style={[styles.checkboxText, { marginLeft: 8 }]}>I agree with </CText>
                            <CTouchableOpacity onPress={() => console.log('Terms clicked')}><CText style={styles.linkText}>Terms & Conditions</CText></CTouchableOpacity>
                            <CText style={styles.checkboxText}> and </CText>
                            <CTouchableOpacity onPress={() => console.log('Privacy clicked')}><CText style={styles.linkText}>Privacy Policy</CText></CTouchableOpacity>
                        </CTouchableOpacity>
                    )}

                    {/* If you have a submit/register button here, be sure to add: disabled={isUploading} or show loading */}
                </>
            )}

            {/* All Steps Mode: Original Multi-step Form */}
            {stepMode === 'all' && (
                <>
                    {/* Step 1: Personal & Contact */}
                    {/* {step === 1 && (
                        <>
                            <CTextField label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter full name" icon="person-outline" />
                            <CTextField label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" icon="mail-outline" autoCapitalize="none" />
                            <CTextField label="Contact Number" value={contactNumber} onChangeText={setContactNumber} placeholder="Enter phone number" keyboardType="phone-pad" icon="call-outline" />
                            <CTextField label="CNIC" value={cnic} onChangeText={setCnic} placeholder="Enter CNIC" icon="card-outline" keyboardType="phone-pad" />
                            <CityPicker city={city} setCity={setCity} />
                            <CTextField label="Address" value={address} onChangeText={setAddress} placeholder="Enter your address" icon='business-outline' />
                        </>
                    )} */}

                    {/* Step 2: Brand Info */}
                    {/* {step === 2 && (
                        <>
                            <CText style={styles.sectionTitle}>Brand Details</CText>
                            <CTextField label="Brand Name" value={brandName} onChangeText={setBrandName} placeholder="Enter brand name" icon="pricetag-outline" />
                            <SocialLinksForm></SocialLinksForm>
                        </>
                    )} */}

                    {/* Step 3: Media & Bio */}
                    {step === 1 && (
                        <>
                            {
                                isEdit && (
                                    <>
                                        <CText style={styles.sectionTitle}>Personal & Contact Information</CText>
                                        <CTextField label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter full name" icon="person-outline" />

                                        <CTextField label="Brand Name" value={brandName} onChangeText={setBrandName} placeholder="Enter brand name" icon="bag-sharp" />

                                        <CTextField label="Email" value={email} readOnly={true} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" icon="mail-outline" autoCapitalize="none" />

                                        <CTextField label="Contact Number" value={contactNumber} onChangeText={setContactNumber} placeholder="Enter phone number" keyboardType="phone-pad" icon="call-outline" />
                                        <CTextField label="CNIC" value={cnic} onChangeText={setCnic} placeholder="Enter CNIC" icon="card-outline" keyboardType="phone-pad" />
                                        <CityPicker city={city} setCity={setCity} />
                                        <CTextField label="Address" value={address} onChangeText={setAddress} placeholder="Enter your address" icon='business-outline' />

                                        <CText style={styles.sectionTitle}>Brand Logo</CText>
                                        <CText style={styles.label}>Upload Brand Logo</CText>
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

                                        {/* Terms & Conditions */}
                                        {!isEdit && stepMode == 'one' && (
                                            <CTouchableOpacity
                                                style={[styles.checkboxContainer, { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }]}
                                                onPress={() => setAgreed(!agreed)}
                                                activeOpacity={0.9}
                                            >
                                                <Ionicons name={agreed ? 'checkbox-outline' : 'square-outline'} size={22} color={agreed ? primaryOrange : '#999'} />

                                                <CText style={[styles.checkboxText, { marginLeft: 8 }]}>I agree with </CText>
                                                <CTouchableOpacity onPress={() => console.log('Terms clicked')}><CText style={styles.linkText}>Terms & Conditions</CText></CTouchableOpacity>
                                                <CText style={styles.checkboxText}> and </CText>
                                                <CTouchableOpacity onPress={() => console.log('Privacy clicked')}><CText style={styles.linkText}>Privacy Policy</CText></CTouchableOpacity>
                                            </CTouchableOpacity>
                                        )}
                                    </>
                                )
                            }

                            <CText style={styles.sectionTitle}>Brand Media & Bio</CText>

                            <CText style={styles.label}>Brand Banner (upload Upto 3)</CText>
                            <CTouchableOpacity
                                style={[styles.bannerBox, uploadingBanner && { opacity: 0.6 }, {
                                    justifyContent: banners.length > 0 ? "flex-start" : "center"
                                }]}
                                onPress={() => {
                                    if (!uploadingBanner) pickImage('banner');
                                }}
                                disabled={uploadingBanner}
                            >
                                {banners.length > 0
                                    ? banners.map((banner: any, index: number) => (
                                        <View key={index} style={styles.bannerContainer}>
                                            <Image source={{ uri: banner }} style={styles.bannerImage} />
                                            <CTouchableOpacity
                                                style={styles.removeButton}
                                                onPress={() => removeImage('banner', index)}
                                            >
                                                <Ionicons name="close-circle" size={22} color="#fff" />
                                            </CTouchableOpacity>
                                        </View>
                                    ))
                                    : (
                                        uploadingBanner
                                            ? <ActivityIndicator size={40} color={primaryOrange} />
                                            : <Ionicons name="image-outline" size={40} color="#aaa" />
                                    )
                                }
                            </CTouchableOpacity>

                            <CText style={styles.label}>Brand Bio</CText>
                            <TextInput
                                style={styles.bioInput}
                                placeholder="Write something about your brand..."
                                placeholderTextColor="#999"
                                value={bio}
                                onChangeText={(text) => text.length <= MAX_BIO_LENGTH && setBio(text)}
                                multiline
                            />
                            <Text style={styles.charCount}>{bio.length}/{MAX_BIO_LENGTH}</Text>

                            <CText style={styles.label}>About Us</CText>
                            <TextInput
                                style={styles.bioInput}
                                placeholder="Write something about you..."
                                placeholderTextColor="#999"
                                value={aboutUs}
                                onChangeText={(text) => text?.length <= MAX_BIO_LENGTH && setAboutUs(text)}
                                multiline
                            />
                            <Text style={styles.charCount}>{aboutUs?.length}/{MAX_BIO_LENGTH}</Text>

                            {/* Terms & Conditions */}
                            {!isEdit && stepMode == 'one' && (
                                <CTouchableOpacity
                                    style={[styles.checkboxContainer, { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }]}
                                    onPress={() => setAgreed(!agreed)}
                                    activeOpacity={0.9}
                                >
                                    <Ionicons name={agreed ? 'checkbox-outline' : 'square-outline'} size={22} color={agreed ? primaryOrange : '#999'} />
                                    <CText style={[styles.checkboxText, { marginLeft: 8 }]}>I agree with </CText>
                                    <CTouchableOpacity onPress={() => console.log('Terms clicked')}><CText style={styles.linkText}>Terms & Conditions</CText></CTouchableOpacity>
                                    <CText style={styles.checkboxText}> and </CText>
                                    <CTouchableOpacity onPress={() => console.log('Privacy clicked')}><CText style={styles.linkText}>Privacy Policy</CText></CTouchableOpacity>
                                </CTouchableOpacity>
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <SocialLinksForm
                                activeOn={activeOn}
                                setActiveOn={setActiveOn}
                            ></SocialLinksForm>

                            <CategoriesSelection
                                selectedCategories={selectedCategories}
                                selectedSubCategories={selectedSubCategories}
                                selectedSubSubCategories={selectedSubSubCategories}
                                setSelectedCategories={setSelectedCategories}
                                setSelectedSubCategories={setSelectedSubCategories}
                                setSelectedSubSubCategories={setSelectedSubSubCategories}
                                hasOnlyMainCategories={true}>
                            </CategoriesSelection>
                        </>

                    )}
                    {step === 3 && (
                        <WorkingHoursForm
                            workingHours={workingHours}
                            setWorkingHours={setWorkingHours}
                        />
                    )}

                    {/* Navigation Buttons for All Steps Mode */}
                    <View style={styles.navButtons}>
                        {step > 1 && <CTouchableOpacity
                            disabled={step < 1 || isUploading}
                            style={[styles.backButton, isUploading && { opacity: 0.5 }]}
                            onPress={handleBack}
                        >
                            <CText>Back</CText>
                        </CTouchableOpacity>}
                        {step < 3 && <CTouchableOpacity
                            style={[styles.nextButton, isUploading && { opacity: 0.5 }]}
                            onPress={handleNext}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <CText style={{ color: '#fff' }}>Next</CText>
                            )}
                        </CTouchableOpacity>}
                        {step == 3 && stepMode && stepMode != 'one' &&
                            <CTouchableOpacity
                                style={[styles.submitButton, isUploading && { opacity: 0.5 }]}
                                onPress={() => {
                                    if (!isUploading && handleSetupProfile) {
                                        handleSetupProfile()
                                        setUploadingBanner(true)
                                    }
                                }}
                                disabled={isUploading}
                            >

                                {isUploading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <CText style={{ color: '#fff' }}>Save</CText>
                                )}
                            </CTouchableOpacity>}
                    </View>
                </>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    sectionTitle: { fontFamily: 'PoppinsSemiBold', textAlign: "left", fontSize: 18, marginVertical: 12, color: '#333' },
    label: { fontFamily: 'PoppinsSemiBold', fontSize: 14, marginBottom: 6 },
    optionBox: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginVertical: 5 },
    platformContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    platformBox: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 12, marginRight: 8, marginBottom: 8 },
    bannerBox: { width: '100%', height: 150, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 5, alignItems: 'center', marginBottom: 12, overflow: 'hidden', flexDirection: "row" },
    logoBox: { width: 120, height: 120, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' },
    bannerImage: { width: 100, height: 100, resizeMode: 'cover', borderWidth: 1, },
    logoImage: { width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 12 },
    removeButton: { position: 'absolute', top: 5, right: 5, backgroundColor: primaryOrange, borderRadius: 20, padding: 2 },
    bioInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, minHeight: 100, textAlignVertical: 'top', fontFamily: 'PoppinsRegular', fontSize: 14, color: '#333', marginBottom: 4, backgroundColor: '#fff' },
    charCount: { fontFamily: 'PoppinsRegular', fontSize: 12, color: '#999', textAlign: 'right', marginBottom: 20 },
    navButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 30 },
    backButton: { paddingVertical: 12, paddingHorizontal: 50, borderRadius: 10, borderWidth: 1, borderColor: '#ccc' },
    nextButton: { paddingVertical: 12, paddingHorizontal: 50, borderRadius: 10, backgroundColor: primaryOrange },
    submitButton: { paddingVertical: 12, paddingHorizontal: 50, borderRadius: 10, backgroundColor: primaryOrange },
    checkboxContainer: { marginTop: 10 },
    checkboxText: { fontFamily: 'PoppinsRegular', fontSize: 14, color: '#555' },
    linkText: { fontFamily: 'PoppinsSemiBold', fontSize: 14, color: primaryOrange },
    bannerContainer: {
        position: 'relative',
        marginRight: 10,
        flexDirection: "row"
    },
});

export default BrandForm;