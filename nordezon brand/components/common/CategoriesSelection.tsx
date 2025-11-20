import { primaryOrange } from '@/constants/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import CText from './CText';
import CTouchableOpacity from './CTouchableOpacity';

// Type definitions for the new data structure
interface Category {
    id: number;
    name: string;
    parentId: number | null;
    createdAt?: string;
    updatedAt?: string;
    children?: Category[];
}

const CategoriesSelection = ({
    hasOnlyMainCategories,
    setSelectedCategories,
    setSelectedSubCategories,
    setSelectedSubSubCategories,
    selectedCategories,
    selectedSubCategories,
    selectedSubSubCategories,
    isFromCatalogue = false,
    allowManyMainCategories = false, // <-- New prop, default false
}: {
    hasOnlyMainCategories: boolean,
    setSelectedCategories: (param: any) => void
    setSelectedSubCategories: (param: any) => void
    setSelectedSubSubCategories: (param: any) => void
    selectedCategories: number[]
    selectedSubCategories: number[]
    selectedSubSubCategories: number[]
    isFromCatalogue?: boolean
    allowManyMainCategories?: boolean // <-- Optional prop
}) => {

    const { categories } = useSelector((state: any) => state.user);

    // Limit for main categories - if allowManyMainCategories, unlimited, else max 3
    const CATEGORY_LIMIT = allowManyMainCategories ? Infinity : 3;
    const categoryHelperText = allowManyMainCategories
        ? "(Select as many as you want)"
        : "(Select up to 3)";

    const handleCategoryPress = (categoryId: number) => {
        setSelectedCategories((prev: any) => {
            if (prev.includes(categoryId)) {
                // Remove category and clear related subcategories
                const newCategories = prev.filter((catId: number) => catId !== categoryId);

                // Find the category object
                const categoryObj = categories.find((c: any) => c.id === categoryId);
                if (categoryObj && categoryObj.children) {
                    // Remove subcategories that belong to this category
                    const subCatIds = categoryObj.children.map((s: any) => s.id);
                    setSelectedSubCategories((prevSub: any) =>
                        prevSub.filter((subId: any) => !subCatIds.includes(subId))
                    );

                    // Remove sub-subcategories that belong to this category's subcategories
                    const allSubSubCatIds = categoryObj.children.flatMap((s: any) =>
                        s.children ? s.children.map((ss: any) => ss.id) : []
                    );
                    setSelectedSubSubCategories((prevSubSub: any) =>
                        prevSubSub.filter((subSubId: any) => !allSubSubCatIds.includes(subSubId))
                    );
                }

                return newCategories;
            } else {
                // Add category if under limit, or unlimited if allowManyMainCategories
                if (prev.length < CATEGORY_LIMIT) {
                    return [...prev, categoryId];
                }
                return prev;
            }
        });
    };

    const handleSubCategoryPress = (subCategoryId: number) => {
        setSelectedSubCategories((prev: any) => {
            if (prev.includes(subCategoryId)) {
                // Remove subcategory and clear related sub-subcategories
                const newSubCategories = prev.filter((subId: any) => subId !== subCategoryId);

                // Find the subcategory object and remove its sub-subcategories
                const parentCategory = categories.find((cat: any) =>
                    cat.children?.some((sub: any) => sub.id === subCategoryId)
                );
                const subCategoryObj = parentCategory?.children?.find((sub: any) => sub.id === subCategoryId);

                if (subCategoryObj && subCategoryObj.children) {
                    const subSubCatIds = subCategoryObj.children.map((ss: any) => ss.id);
                    setSelectedSubSubCategories((prevSubSub: any) =>
                        prevSubSub.filter((subSubId: any) => !subSubCatIds.includes(subSubId))
                    );
                }

                return newSubCategories;
            } else {
                return [...prev, subCategoryId];
            }
        });
    };

    const handleSubSubCategoryPress = (subSubCategoryId: number) => {
        setSelectedSubSubCategories((prev: any) => {
            if (prev.includes(subSubCategoryId)) {
                return prev.filter((subSubId: any) => subSubId !== subSubCategoryId);
            } else {
                return [...prev, subSubCategoryId];
            }
        });
    };

    // Get all subcategories from selected categories
    const availableSubCategories = categories
        .filter((cat: any) => selectedCategories.includes(isFromCatalogue ? cat.category?.id : cat?.id))
        .flatMap((cat: any) => isFromCatalogue ? cat.category.children || [] : cat.children || []);

    // Get all sub-subcategories from selected subcategories
    const availableSubSubCategories = availableSubCategories
        .filter((sub: any) => selectedSubCategories.includes(sub?.id))
        .flatMap((sub: any) => sub.children || []);

    const getCatId = (cat: any) => isFromCatalogue ? cat.category?.id : cat?.id;

    return (
        <>
            {/* Category */}
            <CText style={styles.label}>
                Category {hasOnlyMainCategories ? categoryHelperText : ""}
            </CText>
            <View style={styles.optionRow}>
                {categories.map((cat: any, index: number) => {
                    const isSelected = selectedCategories.includes(getCatId(cat));
                    const maxReached =
                        !allowManyMainCategories &&
                        selectedCategories.length >= CATEGORY_LIMIT &&
                        !isSelected;

                    return (
                        <CTouchableOpacity
                            key={index}
                            style={[
                                styles.optionButton,
                                isSelected && styles.selectedOption,
                                maxReached && styles.disabledOption
                            ]}
                            onPress={() => handleCategoryPress(getCatId(cat))}
                            disabled={maxReached}
                        >
                            <CText style={[
                                styles.optionText,
                                isSelected && styles.selectedOptionText,
                                maxReached && styles.disabledOptionText
                            ]}>
                                {isFromCatalogue ? cat.category?.name : cat.name}
                            </CText>
                        </CTouchableOpacity>
                    );
                })}
            </View>

            {/* Subcategory */}
            {!hasOnlyMainCategories && availableSubCategories.length > 0 && (
                <>
                    <CText style={styles.label}>Subcategory</CText>
                    <View style={styles.optionRow}>
                        {availableSubCategories.map((sub: any) => (
                            <CTouchableOpacity
                                key={sub.id}
                                style={[
                                    styles.optionButton,
                                    selectedSubCategories.includes(sub.id) && styles.selectedOption
                                ]}
                                onPress={() => handleSubCategoryPress(sub.id)}
                            >
                                <CText style={[
                                    styles.optionText,
                                    selectedSubCategories.includes(sub.id) && styles.selectedOptionText
                                ]}>
                                    {sub.name}
                                </CText>
                            </CTouchableOpacity>
                        ))}
                    </View>
                </>
            )}

            {/* Sub-Subcategory */}
            {!hasOnlyMainCategories && availableSubSubCategories.length > 0 && (
                <>
                    <CText style={styles.label}>Sub-Subcategory</CText>
                    <View style={styles.optionRow}>
                        {availableSubSubCategories.map((subsub: any) => (
                            <CTouchableOpacity
                                key={subsub.id}
                                style={[
                                    styles.optionButton,
                                    selectedSubSubCategories.includes(subsub.id) && styles.selectedOption
                                ]}
                                onPress={() => handleSubSubCategoryPress(subsub.id)}
                            >
                                <CText style={[
                                    styles.optionText,
                                    selectedSubSubCategories.includes(subsub.id) && styles.selectedOptionText
                                ]}>
                                    {subsub.name}
                                </CText>
                            </CTouchableOpacity>
                        ))}
                    </View>
                </>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    label: { fontSize: 14, color: '#333', fontFamily: 'PoppinsSemiBold', marginTop: 15, marginBottom: 5 },
    optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    optionButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, backgroundColor: '#fff' },
    optionText: { color: '#333', fontFamily: 'PoppinsMedium' },
    selectedOption: { backgroundColor: primaryOrange, borderColor: primaryOrange },
    selectedOptionText: { color: '#fff' },
    disabledOption: { backgroundColor: '#f5f5f5', borderColor: '#e0e0e0', opacity: 0.6 },
    disabledOptionText: { color: '#999' },
});

export default CategoriesSelection