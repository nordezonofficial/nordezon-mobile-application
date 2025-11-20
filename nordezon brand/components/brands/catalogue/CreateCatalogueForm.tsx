import CategoriesSelection from '@/components/common/CategoriesSelection';
import CSnackbar from '@/components/common/CSnackbar';
import CText from '@/components/common/CText';
import CTextField from '@/components/common/CTextField';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import CImagePicker from '@/components/common/ImagePicker';
import KeyboardAvoiding from '@/components/common/KeyboardAvoiding';
import { primaryOrange } from '@/constants/colors';
import { useCreatePostMutation, useUpdatePostMutation } from '@/store/api/v1/post';
import { setPost } from '@/store/slices/post';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SizeAndColorPicker from './SizeAndColorPicker';

const CreateCatalogueForm = ({
    isEdit = false
}: {
    isEdit?: boolean,
}) => {
    const { post } = useSelector((state: any) => state.post)
    const { user, accessToken, categories } = useSelector((state: any) => state.user)
    const [url, setBanner] = useState<string | null>("");
    const [title, setName] = useState("");
    const [description, setDesc] = useState("");
    const [price, setPrice] = useState<any>(0);
    const [sku, setSku] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
    const [selectedSubSubCategories, setSelectedSubSubCategories] = useState<number[]>([]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');
    const [loading, setLoading] = useState(false)
    const [createCatalogue, { isLoading, isError }] = useCreatePostMutation()
    const [updatCatalogue] = useUpdatePostMutation()
    const [size, setSelectedSizes] = useState<string[]>([]);
    const [color, setSelectedColors] = useState<string[]>([]);


    /* -- navigation --*/
    const navigation = useRouter();

    const dispatch = useDispatch()


    // Initialize form fields from post when editing
    useEffect(() => {
        if (isEdit && post && Object.keys(post).length > 0) {
            // Set basic fields
            setBanner(post.url || null);
            setName(post.title || "");
            setDesc(post.description || "");
            setPrice(post.price || 0);
            setSku(post.sku || "");
            setDiscountedPrice(post.discountedPrice || 0);
            setSelectedSizes(post.size || []);
            setSelectedColors(post.color || []);


            // Extract and categorize categories
            if (post.categories && Array.isArray(post.categories) && post.categories.length > 0) {
                const mainCats: number[] = [];
                const subCats: number[] = [];
                const subSubCats: number[] = [];

                // When data is coming from the Catalogue structure
                post.categories.forEach((item: any) => {
                    const cat = item.category;
                    if (!cat.parentId) {
                        // Main category
                        mainCats.push(cat?.id);
                    } else if (cat.parentId) {
                        // Subcategory (no further children)

                        subCats.push(cat?.id);
                        subSubCats.push(cat?.id);

                    }
                });


                setSelectedCategories(mainCats);
                setSelectedSubCategories(subCats);
                setSelectedSubSubCategories(subSubCats);
            }
        }
    }, [isEdit, post, categories]);


    useFocusEffect(
        useCallback(() => {
            setLoading(false);
            console.log("isEdit", isEdit);

            if (isEdit) return;
            console.log("isEdit USE EFFEC");

            // Reset all states when user navigates to this screen
            setBanner(null);
            setName('');
            setDesc('');
            setPrice('');
            setLoading(false);
            setSku('');
            setDiscountedPrice(0);
            setSelectedCategories([]);
            setSelectedSubCategories([]);
            setSelectedSubSubCategories([]);
            setSelectedSizes([]);
            setSelectedColors([]);
            setSnackbarVisible(false);
            setSnackbarMessage('');
            setSnackbarType('info');
        }, [])
    );


    const handleSubmit = async () => {
        try {
            // ✅ Validate required fields
            if (!url || !price || !description || !title || selectedCategories.length === 0) {
                let missingFields = [];

                if (!url) missingFields.push('Product image');
                if (!title) missingFields.push('Catalogue name');
                if (!price) missingFields.push('Price');
                if (!description) missingFields.push('Description');
                if (selectedCategories.length === 0) missingFields.push('Category');

                setSnackbarMessage(
                    `Please fill out the following: ${missingFields.join(', ')}.`
                );
                setSnackbarType('error');
                setSnackbarVisible(true);
                return; // 🚫 Stop submission if validation fails
            }
            setLoading(true)

            // ✅ Build payload
            let payload: any = {
                url,
                price,
                description,
                size,
                sku,
                color,
                categoryIds: [
                    ...selectedCategories,
                    ...selectedSubCategories,
                    ...selectedSubSubCategories,
                ],
                discountedPrice,
                isPost: false,
                isReel: false,
                isStory: false,
                isProduct: true,
                title,
            };

            // ✅ API call
            let response: any;
            if (!isEdit) {
                response = await createCatalogue(payload);

            } else {
                payload.id = post.id
                response = await updatCatalogue(payload);

            }
            dispatch(setPost(response.data.data))

            if (response?.data && response.data.status === 'success') {
                setSnackbarMessage(isEdit ? 'Catalogue updated successfully!' : 'Catalogue created successfully!');
                setSnackbarType('success');
                setSnackbarVisible(true);

                // Navigate after short delay
                setTimeout(() => {
                    navigation.push('/(brand)/catalog');
                }, 1000);
            } else {
                setSnackbarMessage(isEdit ? 'Failed to update catalogue.' : 'Failed to create catalogue.');
                setSnackbarType('error');
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.log("Error", error);

            setSnackbarMessage('Something went wrong.');
            setSnackbarType('error');
            setSnackbarVisible(true);
            setLoading(false)
        }
    };




    return (
        <>
            <CSnackbar
                visible={snackbarVisible}
                message={snackbarMessage}
                onClose={() => setSnackbarVisible(false)}
                type={snackbarType}
            />

            <KeyboardAvoiding>
                <CTouchableOpacity onPress={() => {
                    setSnackbarVisible(true)
                }}>
                    <CText style={styles.pageTitle}>{isEdit ? 'Edit Catalogue' : 'Create New Catalogue'}</CText>
                </CTouchableOpacity>


                <CImagePicker
                    isPost={true}
                    label="Select a Product image (6:8 Square Recommended)"
                    value={url}
                    onChange={setBanner}
                    aspect={[6, 8]}
                    height={200}
                />

                <CTextField label="Name" placeholder="Enter Catalogue Name" value={title} onChangeText={(text) => setName(String(text))} icon="pricetag-outline" />
                <CTextField label="Price" placeholder="Enter Price" value={String(price || '')} onChangeText={(text) => setPrice(text === '' ? 0 : Number(text))} icon="cash-outline" keyboardType="numeric" />
                <CTextField label="Discount Prince" placeholder="Enter Discount Price" value={String(discountedPrice || '')} onChangeText={(text) => setDiscountedPrice(text === '' ? 0 : Number(text))} icon="cash-outline" keyboardType="numeric" />
                <CTextField
                    label="SKU"
                    placeholder="Enter SKU"
                    value={sku}
                    onChangeText={(text) => setSku(String(text))}
                    icon="barcode-outline"
                    keyboardType="default"
                />
                <CTextField label="Description" style={styles.description} multiline={true} placeholder="Write about this catalogue..." value={description} onChangeText={(text) => setDesc(String(text))} icon="document-text-outline" />


                <CategoriesSelection
                    isFromCatalogue={true}
                    selectedCategories={selectedCategories}
                    selectedSubCategories={selectedSubCategories}
                    selectedSubSubCategories={selectedSubSubCategories}
                    setSelectedCategories={setSelectedCategories}
                    setSelectedSubCategories={setSelectedSubCategories}
                    setSelectedSubSubCategories={setSelectedSubSubCategories}
                    hasOnlyMainCategories={false}
                ></CategoriesSelection>


                <SizeAndColorPicker
                    selectedSizes={size}
                    setSelectedSizes={setSelectedSizes}
                    selectedColors={color}
                    setSelectedColors={setSelectedColors}
                />


                <CTouchableOpacity disabled={loading} style={styles.submitButton} onPress={handleSubmit}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <CText style={styles.submitText}>{isEdit ? 'Update Catalogue' : 'Create Catalogue'}</CText>
                    )}
                </CTouchableOpacity>
            </KeyboardAvoiding>
        </>

    );
};

const styles = StyleSheet.create({
    pageTitle: { fontSize: 22, fontFamily: 'PoppinsSemiBold', color: '#000', marginBottom: 10 },
    label: { fontSize: 14, color: '#333', fontFamily: 'PoppinsMedium', marginTop: 15, marginBottom: 5 },
    optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    optionButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, backgroundColor: '#fff' },
    selectedOption: { backgroundColor: primaryOrange, borderColor: primaryOrange },
    optionText: { color: '#333', fontFamily: 'PoppinsMedium' },
    submitButton: { backgroundColor: primaryOrange, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 25, marginBottom: 50 },
    submitText: { color: '#fff', fontSize: 16, fontFamily: 'PoppinsSemiBold' },
    description: { borderRadius: 10, padding: 12, minHeight: 100, textAlignVertical: 'top', fontSize: 14, color: '#333', marginBottom: 4, backgroundColor: '#fff' },

});

export default CreateCatalogueForm;
