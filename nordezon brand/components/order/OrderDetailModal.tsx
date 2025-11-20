import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import { primaryOrange } from '@/constants/colors';
import { formatDate, getStatusColor } from '@/helpers';
import { useUpdateOrderStatusMutation } from '@/store/api/v1/orders';
import { setOrderStatus } from '@/store/slices/orders';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface OrderDetailModalProps {
    visible: boolean;
    onClose: () => void;
    setSnackbarVisible: (visible: boolean) => void;
    setSnackbarMessage: (msg: string) => void;
    setSnackbarType: (type: 'success' | 'error' | 'info') => void;
}

const OrderDetailModal = ({ visible, onClose, setSnackbarVisible, setSnackbarMessage, setSnackbarType }: OrderDetailModalProps) => {
    const { order } = useSelector((state: any) => state.order);
    if (!order) return null;
    const [updateOrder] = useUpdateOrderStatusMutation();

    const isSingleItem = order.items && order.items.length === 1;

    // Render product images and info for all items if >1, otherwise just render the one item
    const renderProductSection = () => {
        if (isSingleItem) {
            const item = order.items[0];
            return (
                <View>
                    <Image
                        source={{ uri: item.post.url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.infoSection}>
                        <CText style={styles.orderId}>Order ID: {order.orderId}</CText>
                        <CText style={styles.sku}>SKU: {item.post.sku}</CText>
                        <CText style={styles.sku}>{item.post.title}</CText>
                        <CText style={styles.orderId}>QTY: {item.qty}</CText>
                        <CText style={styles.customer}>Name: {order.user.fullName}</CText>
                        <CText style={styles.date}>{formatDate(order.createdAt)}</CText>
                        <CText style={styles.addressTitle}>Delivery Address:</CText>
                        <CText style={styles.address}>{order.user.address}</CText>
                        {/* Status */}
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(order.status) },
                            ]}
                        >
                            <Text style={styles.statusText}>{order.status}</Text>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 10, marginTop: 8 }}
                        contentContainerStyle={{ gap: 10, paddingVertical: 6 }}
                    >
                        {order.items.map((item: any, idx: number) => (
                            <View key={idx} style={styles.multiProductItem}>
                                <Image
                                    source={{ uri: item.post.url }}
                                    style={styles.multiProductImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.multiProductInfo}>
                                    <CText style={styles.sku}>SKU: {item.post.sku}</CText>
                                    <CText style={styles.sku}>{item.post.title}</CText>
                                    <CText style={styles.orderId}>QTY: {item.qty}</CText>
                                    <CText style={styles.sku}>Rs. {item.price}</CText>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    {/* General Order Info below products */}
                    <View style={styles.infoSection}>
                        <CText style={styles.orderId}>Order ID: {order.orderId}</CText>
                        <CText style={styles.customer}>Name: {order.user.fullName}</CText>
                        <CText style={styles.date}>{formatDate(order.createdAt)}</CText>
                        <CText style={styles.addressTitle}>Delivery Address:</CText>
                        <CText style={styles.address}>{order.user.address}</CText>
                        {/* Status */}
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(order.status) },
                            ]}
                        >
                            <Text style={styles.statusText}>{order.status}</Text>
                        </View>
                    </View>
                </>
            );
        }
    };

    // Calculate subtotal (for multiple or single item)
    const getSubtotal = () => {
        if (isSingleItem) {
            return order.items[0].price;
        }
        // Sum all item prices * quantities
        return order.items.reduce(
            (sum: number, item: any) => sum + (item.price * (item.qty || 1)),
            0
        );
    };

    const dispatch = useDispatch();


    const handlePressAction = async (param: string) => {
        const payload = {
          orderId: order.id,
          status: param,
        };
  
        try {
          // Optimistic update
          dispatch(setOrderStatus(payload));
  
          const response: any = await updateOrder(payload);
  
          if (response?.data?.status === 'success') {
            setSnackbarMessage(response.data.message || 'Order status updated successfully!');
            setSnackbarType('success');
          } else {
            throw new Error(response?.data?.message || 'Failed to update order status');
          }
        } catch (error: any) {
          // Rollback optimistic update (optional)
          dispatch(setOrderStatus({ orderId: order.id, status: order.status }));
          setSnackbarMessage(error?.message || 'Something went wrong while updating status');
          setSnackbarType('error');
        } finally {
          setSnackbarVisible(true);
          onClose();
        }
      };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    {/* Close button */}
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Dynamic Product Info */}
                        {renderProductSection()}

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Summary Section */}
                        <View style={styles.summary}>
                            <CText style={styles.summaryTitle}>Order Summary</CText>

                            <View style={styles.rowBetween}>
                                <CText style={styles.label}>Subtotal:</CText>
                                <CText style={styles.value}>Rs. {getSubtotal()}</CText>
                            </View>
                            {/* <View style={styles.rowBetween}>
                                <CText style={styles.label}>Tax:</CText>
                                <CText style={styles.value}>Rs. 50</CText>
                            </View> */}
                            <View style={styles.rowBetween}>
                                <CText style={styles.label}>Total:</CText>
                                <CText style={[styles.value, { color: primaryOrange }]}>
                                    Rs. {order.totalAmount}
                                </CText>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Buttons */}
                        <View style={styles.actions}>
                            <CTouchableOpacity style={[styles.btn, styles.primaryBtn]} onPress={() => handlePressAction("SHIPPED")}>
                                <Ionicons name="cube-outline" size={18} color="#fff" />
                                <Text style={styles.btnText}>Mark as Shipped</Text>
                            </CTouchableOpacity>

                            <CTouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() =>  handlePressAction("CANCELLED")}>
                                <Ionicons name="close-circle-outline" size={18} color="#fff" />
                                <Text style={styles.btnText}>Cancel Order</Text>
                            </CTouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};



const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    card: {
        width: '100%',
        maxHeight: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 6,
    },
    closeBtn: {
        alignSelf: 'flex-end',
        padding: 4,
    },
    image: {
        width: '100%',
        height: 350,
        borderRadius: 16,
        marginBottom: 15,
    },
    infoSection: {
        alignItems: 'flex-start',
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginTop: 2,
    },
    sku: {
        fontSize: 14,
        color: '#777',
        marginTop: 3,
    },
    customer: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginTop: 6,
    },
    date: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 10,
    },
    statusText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    summary: {
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#000',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    label: {
        fontSize: 14,
        color: '#555',
    },
    value: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 15,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    primaryBtn: {
        backgroundColor: primaryOrange,
    },
    cancelBtn: {
        backgroundColor: '#EF5350',
    },
    btnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 6,
    },
    addressTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
    },
    address: {
        fontSize: 13,
        color: '#555',
        marginTop: 2,
        lineHeight: 18,
    },

    // Add styles for multi-product layout
    multiProductItem: {
        flexDirection: 'row',
        backgroundColor: '#fafafa',
        borderRadius: 12,
        alignItems: 'center',
        padding: 10,
        minWidth: 220,
        marginRight: 8,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 1,
    },
    multiProductImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 12,
    },
    multiProductInfo: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default OrderDetailModal;
