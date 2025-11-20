import { isAllOptionsSelected, isOptionAvailable } from '@/helpers';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import CartProduct from '@/components/home/cart/CartProduct';
import { primaryGreen } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import ColorList from '../ColorList';
const { width, height } = Dimensions.get('window');
interface ProductVariantSelectionModalProps {
    modalVisible: boolean;
    addToCartLoading: boolean;
    setModalVisible: (v: boolean) => void;
    CText: any;
    CButton: any;

    modalAction: 'add' | 'buy';
    handleModalAction: (multiplesPostToCart: any[]) => void;
    multiplesPostToCart: any[];
    setMultiplesPostToCart: (items: any[]) => void;
}

// Utility to extract available options for a post
const getAvailableOptionsFromPost = (item: any) => {
    let sizeList: string[] = [];
    let colorList: string[] = [];

    if (item?.post && Array.isArray(item.post.size)) {
        sizeList = item.post.size;
    } else if (Array.isArray(item.size)) {
        sizeList = item.size;
    } else if (typeof item.size === "string") {
        sizeList = [item.size];
    }

    if (item?.post && Array.isArray(item.post.color)) {
        colorList = item.post.color;
    } else if (Array.isArray(item.color)) {
        colorList = item.color;
    } else if (typeof item.color === "string") {
        colorList = [item.color];
    }

    return {
        size: sizeList,
        color: colorList,
    };
};

const MultipleProductsVariantSelectionModal = forwardRef<any, ProductVariantSelectionModalProps>(
    (
        {
            modalVisible,
            setModalVisible,
            addToCartLoading,
            CText,
            CButton,
            modalAction,
            handleModalAction,
            multiplesPostToCart,
            setMultiplesPostToCart,
        },
        ref
    ) => {
        // -- Selection state (refs for local, parent state for cart data) --
        const localSelectionsRef = useRef<Record<number, { size?: string; color?: string[]; quantity: number }>>({});

        useEffect(() => {
            if (!modalVisible) return;
            const initialSelections: Record<number, { size?: string; color?: string[]; quantity: number }> = {};
            multiplesPostToCart.forEach((item, idx) => {
                const { size, color } = getAvailableOptionsFromPost(item);

                let selectedSize = '';
                let selectedColors: string[] = [];

                // Prefer selected state if present, else use first available in post/options
                if (Array.isArray(item?.size) && typeof item.size[0] === "string" && item.size[0]) {
                    selectedSize = item.size[0];
                } else if (typeof item.size === "string" && item.size) {
                    selectedSize = item.size;
                } else if (size.length > 0) {
                    selectedSize = size[0];
                }

                // The color selection is single select, so default to string array of 1 if present, else []
                if (Array.isArray(item?.color) && item.color.length > 0) {
                    // Only use the first as selected (single select)
                    selectedColors = [item.color[0]];
                } else if (typeof item.color === "string" && item.color) {
                    selectedColors = [item.color];
                } else if (color.length > 0) {
                    selectedColors = [color[0]];
                } else {
                    selectedColors = [];
                }

                initialSelections[idx] = {
                    size: selectedSize,
                    color: selectedColors,
                    quantity: item.quantity || 1
                };
            });
            localSelectionsRef.current = initialSelections;
            setMultiplesPostToCart(
                multiplesPostToCart.map((item, idx) => ({
                    ...item,
                    size: initialSelections[idx].size,
                    color: initialSelections[idx].color,
                    quantity: initialSelections[idx].quantity
                }))
            );
            // eslint-disable-next-line
        }, [modalVisible, multiplesPostToCart.length]);

        // Retrieve current selection for index
        const getItemSelection = (idx: number, item: any) => {
            const sel = localSelectionsRef.current[idx];
            if (sel) return sel;
            const { size, color } = getAvailableOptionsFromPost(item);
            return { size: size[0] ?? '', color: color.length > 0 ? [color[0]] : [], quantity: 1 };
        };

        // Sort sizes to match XS-S-M-L-XL order; fallback to original if not found
        const sortSizes = (sizes: any) => {
            const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
            if (!Array.isArray(sizes)) return [];
            return [...sizes].sort((a, b) => {
                const iA = sizeOrder.indexOf(a);
                const iB = sizeOrder.indexOf(b);
                if (iA === -1 && iB === -1) return 0;
                if (iA === -1) return 1;
                if (iB === -1) return -1;
                return iA - iB;
            });
        };

        // Update local (ref) + parent (cart state) with new selection for idx
        const updateSelection = (
            idx: number,
            changes: Partial<{ size: string; color: string[]; quantity: number }>
        ) => {
            localSelectionsRef.current[idx] = {
                ...localSelectionsRef.current[idx],
                ...changes,
            };
            setMultiplesPostToCart(
                multiplesPostToCart.map((item, i) => {
                    if (i !== idx) return item;
                    return {
                        ...item,
                        size: isOptionAvailable('size', item) && changes.size !== undefined
                            ? changes.size
                            : item.size,
                        color: isOptionAvailable('color', item) && changes.color !== undefined
                            ? changes.color
                            : item.color,
                        quantity: changes.quantity !== undefined ? changes.quantity : item.quantity
                    };
                })
            );
        };

        // All items must have all required options selected
        const allValid = multiplesPostToCart.every((item, idx) => {
            const sel = getItemSelection(idx, item);
            return isAllOptionsSelected(
                sel.size,
                sel.color,
                sel.quantity,
                item
            );
        });

        useImperativeHandle(ref, () => ({
            resetSelections: () => {
                localSelectionsRef.current = {};
            }
        }));

        return (
            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                statusBarTranslucent
                hardwareAccelerated
            >
                <Pressable
                    style={modalStyles.backdrop}
                    onPress={() => setModalVisible(false)}
                />
                <KeyboardAvoidingView
                    style={modalStyles.keyboardAvoid}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={0}
                >
                    <View style={modalStyles.flexFull}>
                        <View style={modalStyles.sheetWrapper}>
                            <ScrollView
                                style={modalStyles.sheetScrollView}
                                contentContainerStyle={modalStyles.sheetScrollContent}
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                            >
                                <View style={modalStyles.sheetHeaderRow}>
                                    <CText style={modalStyles.sheetTitle}>Select Options</CText>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={modalStyles.closeBtn}>
                                        <Ionicons name="close" size={26} color="#181818" />
                                    </TouchableOpacity>
                                </View>
                                {multiplesPostToCart.map((item: any, index: number) => {
                                    const { size, color } = getAvailableOptionsFromPost(item);

                                    const sortedSizes = sortSizes(size);
                                    const selection = getItemSelection(index, item);

                                    return (
                                        <View
                                            key={index}
                                            style={{
                                                marginBottom: 18,
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#eee",
                                                paddingBottom: 10,
                                            }}
                                        >
                                            <CartProduct
                                                renderQTYSection={false}
                                                size={""}
                                                color={""}
                                                showBrandProfileImage={true}
                                                key={index}
                                                item={{
                                                    ...item,
                                                    user: item.user,
                                                    size: selection.size,
                                                    color: selection.color,
                                                    quantity: selection.quantity,
                                                }}
                                                onIncrease={() => {
                                                    updateSelection(index, { quantity: (selection.quantity || 1) + 1 });
                                                }}
                                                onDecrease={() => {
                                                    updateSelection(index, { quantity: Math.max(1, (selection.quantity || 1) - 1) });
                                                }}
                                                onRemove={() => { }}
                                                isEditing={false}
                                                onAddToCart={() => { }}
                                                showAddToCart={false}
                                            />

                                            {/* Size choose */}
                                            {
                                                size.length > 0 && (
                                                    <View style={{ marginBottom: 10 }}>
                                                        <CText style={modalStyles.sectionLabel}>Size</CText>
                                                        <ScrollView
                                                            horizontal
                                                            scrollEventThrottle={16}
                                                            showsHorizontalScrollIndicator={false}
                                                            contentContainerStyle={modalStyles.sizesSlider}
                                                        >
                                                            {sortedSizes.map((size: string) => (
                                                                <TouchableOpacity
                                                                    key={size}
                                                                    style={[
                                                                        modalStyles.sizeButton,
                                                                        selection.size === size && modalStyles.sizeButtonSelected,
                                                                    ]}
                                                                    onPress={() => updateSelection(index, { size })}
                                                                >
                                                                    <CText
                                                                        style={[
                                                                            modalStyles.sizeButtonText,
                                                                            selection.size === size && { color: "#fff" },
                                                                        ]}
                                                                    >
                                                                        {size}
                                                                    </CText>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </ScrollView>
                                                    </View>
                                                )
                                            }

                                            {/* Color choose */}
                                            {color.length > 0 && (
                                                <View style={{ marginBottom: 10 }}>
                                                    <ColorList
                                                        hasSelectedFeature
                                                        ignoreInitialUpdate={true}
                                                        setSelectedColors={(updater: any) => {
                                                            const result = typeof updater === "function"
                                                                ? updater([])   // or the current value you store
                                                                : updater;


                                                            updateSelection(index, {
                                                                color: result.length > 0 ? [result[0]] : []
                                                            });
                                                        }}

                                                        multiSelect={false}
                                                        colorList={color}
                                                        selectedColors={selection.color}
                                                    />
                                                </View>
                                            )}

                                            {/* Quantity choose */}
                                            <View>
                                                <CText style={modalStyles.sectionLabel}>Quantity</CText>
                                                <View style={modalStyles.quantityRow}>
                                                    <TouchableOpacity
                                                        style={[
                                                            modalStyles.qtyBtn,
                                                            selection.quantity <= 1 && {
                                                                backgroundColor: "#e0e0e0",
                                                                borderColor: "#ccc",
                                                            },
                                                        ]}
                                                        onPress={() =>
                                                            updateSelection(index, {
                                                                quantity: Math.max(1, (selection.quantity || 1) - 1),
                                                            })
                                                        }
                                                        disabled={selection.quantity <= 1}
                                                    >
                                                        <Ionicons name="remove" size={20} color="#181818" />
                                                    </TouchableOpacity>
                                                    <TextInput
                                                        value={String(selection.quantity)}
                                                        onChangeText={v => {
                                                            let val = parseInt(v.replace(/[^0-9]/g, ''), 10);
                                                            updateSelection(index, { quantity: isNaN(val) || val < 1 ? 1 : val });
                                                        }}
                                                        keyboardType="numeric"
                                                        style={modalStyles.qtyInput}
                                                        maxLength={4}
                                                    />
                                                    <TouchableOpacity
                                                        style={modalStyles.qtyBtn}
                                                        onPress={() =>
                                                            updateSelection(index, { quantity: (selection.quantity || 1) + 1 })
                                                        }
                                                    >
                                                        <Ionicons name="add" size={20} color="#181818" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                            <CButton
                                loading={addToCartLoading}
                                text={modalAction === "add" ? "Add to cart" : "Buy"}
                                style={[
                                    modalStyles.button,
                                    !allValid && { backgroundColor: "#e0e0e5" },
                                    { marginTop: 24, marginBottom: Platform.OS === "ios" ? 18 : 14 },
                                ]}
                                disabled={addToCartLoading}
                                icon={
                                    modalAction === "add" && (
                                        <Ionicons name="cart-outline" color="#fff" size={20} />
                                    )
                                }
                                textStyle={modalStyles.buttonText}
                                onPress={() => {
                                    if (allValid) {
                                        handleModalAction(multiplesPostToCart);
                                    }
                                }}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
);

const modalStyles = StyleSheet.create({
    safeAreaModalOuter: {
        flex: 1,
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    flexFull: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.32)',
    },
    sheetWrapper: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 18,
        paddingBottom: 0,
        minHeight: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.13,
        shadowRadius: 10,
        elevation: 6,
        width: '100%',
    },
    sheetScrollView: {
        flexGrow: 0,
        maxHeight: height * 0.6,
        minHeight: 0,
    },
    sheetScrollContent: {
        paddingBottom: 0,
        flexGrow: 1,
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
        marginBottom: 12,
        gap: 0,
        height: 39,
    },
    qtyBtn: {
        width: 35,
        height: 35,
        borderRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: "#dadada",
        justifyContent: "center",
        alignItems: "center",
    },
    qtyInput: {
        width: 50,
        height: 40,
        borderWidth: 1.1,
        borderColor: "#dadada",
        borderRadius: 6,
        marginHorizontal: 8,
        textAlign: 'center',
        fontSize: 16,
        color: "#181818",
        backgroundColor: "#f8f8f8",
    },
    sheetHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
    },
    sheetTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#181818",
    },
    sectionLabel: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 13,
        marginBottom: 7,
        marginTop: 12,
        color: '#1a1a1a'
    },
    sizesRow: {
        flexDirection: "row",
        gap: 7,
        marginBottom: 7,
    },
    sizesSlider: {
        flexDirection: "row",
        gap: 7,
        marginBottom: 7,
        paddingRight: 14,
    },
    sizeButton: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 25,
        marginRight: 8,
        backgroundColor: "#fff",
    },
    sizeButtonSelected: {
        borderColor: primaryGreen,
        backgroundColor: primaryGreen,
    },
    sizeButtonText: {
        fontSize: 15,
        color: "#111",
        fontWeight: '600'
    },
    button: {
        backgroundColor: primaryGreen,
        borderRadius: 5,
        paddingVertical: 10,
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 14,
    },
    closeBtn: {
        padding: 5,
        backgroundColor: '#efefef',
        borderRadius: 18,
    },
});
export default MultipleProductsVariantSelectionModal