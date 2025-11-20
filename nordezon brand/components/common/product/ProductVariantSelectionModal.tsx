import { isAllOptionsSelected, isOptionAvailable } from '@/helpers';
import React from 'react';
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
import ColorList from '../ColorList';

import { primaryGreen } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
const { width, height } = Dimensions.get('window')

interface ProductVariantSelectionModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    sortedSizes: string[];
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    selectedEntity?: any;
    setSelectedColors: (colors: string[]) => void;
    color: string[];
    quantity: number;
    setQuantity: (fn: (q: number) => number) => void;
    CText: React.ElementType;
    CButton: React.ElementType;
    modalAction: 'add' | 'buy';
    handleModalAction: () => void;
}

const ProductVariantSelectionModal: React.FC<ProductVariantSelectionModalProps> = ({
    modalVisible,
    setModalVisible,
    sortedSizes,
    selectedSize,
    setSelectedSize,
    selectedEntity,
    setSelectedColors,
    color,
    quantity,
    setQuantity,
    CText,
    CButton,
    modalAction,
    handleModalAction
}) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            statusBarTranslucent={true}
            hardwareAccelerated={true}
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
                            <View style={{ marginTop: 12 }}>
                                {/* Size choose */}
                                {isOptionAvailable('size', selectedEntity) && sortedSizes.length > 0 && (
                                    <View style={{ marginBottom: 18 }}>
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
                                                        selectedSize === size && modalStyles.sizeButtonSelected
                                                    ]}
                                                    onPress={() => setSelectedSize(size)}
                                                >
                                                    <CText style={[
                                                        modalStyles.sizeButtonText,
                                                        selectedSize === size && { color: '#fff' }
                                                    ]}>{size}</CText>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                                {/* Color choose */}
                                {isOptionAvailable('color', selectedEntity) && selectedEntity?.item?.color?.length > 0 && (
                                    <View style={{ marginBottom: 18 }}>
                                        <ColorList
                                            ignoreInitialUpdate={true}
                                            hasSelectedFeature={true}
                                            setSelectedColors={setSelectedColors}
                                            multiSelect={false}
                                            colorList={selectedEntity?.item?.color}
                                            selectedColors={color}
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
                                                quantity <= 1 && { backgroundColor: '#e0e0e0', borderColor: '#ccc' }
                                            ]}
                                            onPress={() => setQuantity(q => Math.max(1, q - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            <Ionicons name="remove" size={20} color="#181818" />
                                        </TouchableOpacity>
                                        <TextInput
                                            value={quantity.toString()}
                                            onChangeText={v => {
                                                let val = parseInt(v.replace(/[^0-9]/g, ''), 10)
                                                setQuantity(_q => isNaN(val) || val < 1 ? 1 : val)
                                            }}
                                            keyboardType="numeric"
                                            style={modalStyles.qtyInput}
                                            maxLength={4}
                                        />
                                        <TouchableOpacity
                                            style={modalStyles.qtyBtn}
                                            onPress={() => setQuantity(q => q + 1)}
                                        >
                                            <Ionicons name="add" size={20} color="#181818" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                        {/* Action Button */}
                        <CButton
                            text={
                                modalAction === 'add' ? ' Add to cart' : 'Buy'
                            }
                            style={[
                                modalStyles.button,
                                (!isAllOptionsSelected(selectedSize, color, quantity, selectedEntity) && { backgroundColor: '#e0e0e5' }),
                                { marginTop: 24, marginBottom: Platform.OS === "ios" ? 18 : 14 }
                            ]}
                            loading={false}
                            icon={
                                modalAction == 'add' && <Ionicons name="cart-outline" color="#fff" size={20} />
                            }

                            textStyle={modalStyles.buttonText}
                            onPress={() => {
                                if (isAllOptionsSelected(selectedSize, color, quantity, selectedEntity)) {
                                    handleModalAction();
                                }
                            }}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

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
})
export default ProductVariantSelectionModal