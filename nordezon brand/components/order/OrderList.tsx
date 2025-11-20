import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import { primaryOrange } from '@/constants/colors';
import { formatDate, getStatusColor } from '@/helpers';
import { useGetOrderListByBrandQuery } from '@/store/api/v1/orders';
import { setOrder, setOrderList, setOrderMetaData } from '@/store/slices/orders';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CSnackbar from '../common/CSnackbar';
import OrderDetailModal from './OrderDetailModal';
import OrderEditModal from './OrderEditModal';

// Import statuses from common.ts (assuming this exists in this path)
import { statuses as ORDER_STATUSES } from '@/constants/common';

const OrderList = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectdViewOrder, setSelectedOrderView] = useState(null);
    const [viewOrder, setViewOrder] = useState<boolean>(false);
    const [editOrder, setEditOrder] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { orderList, orderMetaData } = useSelector((state: any) => state.order);

    const statuses: { value: string, label: string }[] = ORDER_STATUSES || [
        { value: "NEW", label: "New" },
        { value: "PENDING", label: "Pending" },
        { value: "PROCESSING", label: "Processing" },
        { value: "COMPLETED", label: "Completed" },
        { value: "CANCELLED", label: "Cancelled" },
        { value: "SHIPPED", label: "Shipped" },
        { value: "DELIVERED", label: "Delivered" }
    ];

    const [selectedStatus, setSelectedStatus] = useState<string | null>("ALL");

    const handleUpdate = (status: string) => {
        setSelectedOrder(null);
    };

    const [page, setPage] = useState(1);

    const { data, isLoading, refetch } = useGetOrderListByBrandQuery({
        page: page,
        status: selectedStatus ? [selectedStatus] : statuses.map(s => s.value)
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (data && data.status === 'success') {
            if (page === 1) {
                dispatch(setOrderList(data.data.orders));
            } else {
                dispatch(setOrderList([...orderList, ...data.data.orders]));
            }
            dispatch(setOrderMetaData(data.data.meta));
            setIsLoadingMore(false);
        }
    }, [data]);

    useEffect(() => {
        if (selectedStatus) {
            setPage(1);
            refetch();
        }
    }, [selectedStatus]);

    const handleLoadMore = () => {
        if (orderMetaData && orderMetaData.page < orderMetaData.totalPages && !isLoadingMore && !isLoading) {
            setIsLoadingMore(true);
            setPage((prevPage: number) => prevPage + 1);
        }
    };

    const handlePressAction = (type: string, payload: any) => {
        dispatch(setOrder(payload));
        if (type === "EYE") {
            setViewOrder(true);
        } else {
            setEditOrder(true);
        }
    };

    const renderOrder = ({ item }: { item: any }) => (
        <View style={styles.card}>
            {item.items.length === 1 ? (
                <View style={styles.singleProductContainer}>
                    <Image
                        source={{ uri: item.items[0].post.url }}
                        style={styles.singleProductImage}
                    />
                    <View style={styles.singleProductInfo}>
                        <CText style={styles.singleSku}>SKU: {item.items[0].post.sku}</CText>
                        <CText style={styles.singleTitle}>{item.items[0].post.title}</CText>
                        <CText style={styles.singlePrice}>Rs. {item.items[0].price}</CText>
                        <CText style={styles.singleQty}>QTY: {item.items[0].qty}</CText>
                    </View>
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 8 }}
                >
                    {item.items.map((orderItem: any, index: number) => (
                        <View key={index} style={styles.productCard}>
                            <Image
                                source={{ uri: orderItem.post.url }}
                                style={styles.productImage}
                            />
                            <View style={styles.productInfo}>
                                <CText style={styles.customer}>{orderItem.post.title}</CText>
                                <CText style={styles.customer}>Rs.{orderItem.price}</CText>
                                <CText style={styles.sku}>QTY: {orderItem.qty}</CText>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
            <View style={styles.divider} />
            <CText style={styles.customer}>name:{item.user.fullName}</CText>
            <View style={styles.rowBetween}>
                <CText style={styles.orderId}>{item.orderId}</CText>
                <View
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
                >
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
            <View style={styles.rowBetween}>
                <CText style={styles.total}>Total: Rs.{item.totalAmount}</CText>
                <View style={styles.actionRow}>
                    <CTouchableOpacity
                        style={[styles.actionBtn, styles.updateBtn]}
                        onPress={() => handlePressAction("EDIT", item)}
                    >
                        <Ionicons name="create-outline" size={16} color="#fff" />
                        <Text style={styles.btnText}>Edit</Text>
                    </CTouchableOpacity>
                    <CTouchableOpacity
                        style={[styles.actionBtn, styles.viewBtn]}
                        onPress={() => handlePressAction("EYE", item)}
                    >
                        <Ionicons name="eye-outline" size={16} color="#fff" />
                        <Text style={styles.btnText}>View</Text>
                    </CTouchableOpacity>
                </View>
            </View>
            <CText style={styles.date}>Order Date: {formatDate(item.createdAt)}</CText>
        </View>
    );

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');

    // === FILTER UI ===
    const renderStatusFilter = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
            style={{ marginBottom: 10 }}
        >
            <TouchableOpacity
                key="ALL"
                onPress={() => setSelectedStatus("ALL")}
                style={[
                    styles.filterChip,
                    selectedStatus === "ALL" && styles.filterChipSelected
                ]}
            >
                <Text style={[
                    styles.filterChipText,
                    selectedStatus === "ALL" && styles.filterChipTextSelected
                ]}>All</Text>
            </TouchableOpacity>
            {statuses.map((status) => (
                <TouchableOpacity
                    key={status.value}
                    onPress={() => setSelectedStatus(status.value)}
                    style={[
                        styles.filterChip,
                        selectedStatus === status.value && styles.filterChipSelected
                    ]}
                >
                    <Text
                        style={[
                            styles.filterChipText,
                            selectedStatus === status.value && styles.filterChipTextSelected
                        ]}
                    >
                        {status.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    // === NOT FOUND - EMPTY STATE ===
    const renderEmptyComponent = () => {
        // Show loading spinner if loading
        if (isLoading) {
            return (
                <View style={styles.notFoundContainer}>
                    <ActivityIndicator size="large" color={primaryOrange} />
                    <CText style={styles.notFoundText}>Loading Orders...</CText>
                </View>
            );
        }
        // If not loading, and no orders
        return (
            <View style={styles.notFoundContainer}>
                <Ionicons name="archive-outline" size={44} color="#bbb" style={{ marginBottom: 8 }} />
                <CText style={styles.notFoundText}>No Orders Yet</CText>
            </View>
        );
    };

    return (
        <>
            <CSnackbar
                visible={snackbarVisible}
                message={snackbarMessage}
                onClose={() => setSnackbarVisible(false)}
                type={snackbarType}
            />

            {/* Filter UI */}
            {renderStatusFilter()}

            <FlatList
                data={orderList || []}
                renderItem={renderOrder}
                onEndReached={handleLoadMore}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={[
                    styles.listContainer,
                    (!orderList || orderList.length === 0) && { flex: 1 }
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyComponent}
            />

            <OrderEditModal
                setSnackbarVisible={setSnackbarVisible}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarType={setSnackbarType}
                visible={editOrder}
                onClose={() => {
                    setEditOrder(false);

                }}
            />

            {viewOrder && (
                <OrderDetailModal
                    setSnackbarVisible={setSnackbarVisible}
                    setSnackbarMessage={setSnackbarMessage}
                    setSnackbarType={setSnackbarType}
                    visible={viewOrder}
                    onClose={() => {
                        setViewOrder(false)
                    }}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    listContainer: {},
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
    },
    sku: {
        fontSize: 13,
        color: '#777',
        marginBottom: 4,
    },
    customer: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    date: {
        fontSize: 12,
        color: '#777',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    total: {
        fontSize: 13,
        color: primaryOrange,
        fontFamily: "PoppinsSemiBold"
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    updateBtn: {
        backgroundColor: '#2196F3',
    },
    viewBtn: {
        backgroundColor: primaryOrange,
    },
    btnText: {
        color: '#fff',
        fontSize: 13,
        marginLeft: 4,
    },
    singleProductContainer: {
        flexDirection: 'column',
        paddingVertical: 10,
    },
    singleProductImage: {
        width: 293,
        height: 293,
        resizeMode: 'contain',
        borderRadius: 12,
        marginBottom: 8,
    },
    singleProductInfo: {},
    singleSku: {
        fontSize: 13,
        color: '#777',
        marginBottom: 4,
    },
    singleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    singlePrice: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    singleQty: {
        fontSize: 14,
        color: '#555',
    },
    productCard: {
        width: 90,
        paddingTop: 8,
        paddingLeft: 10,
        marginRight: 12,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        justifyContent: "center",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    // FILTER STYLES
    filterScroll: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 4,
        backgroundColor: '#fbfbfb',
    },
    filterChip: {
        height: 35,
        marginRight: 10,
        backgroundColor: '#F2F2F2',
        borderRadius: 18,
        paddingVertical: 7,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
    },
    filterChipSelected: {
        backgroundColor: primaryOrange,
        borderColor: primaryOrange,
    },
    filterChipText: {
        color: '#555',
        fontSize: 14,
        fontWeight: '500',
    },
    filterChipTextSelected: {
        color: '#fff',
        fontWeight: '700'
    },
    notFoundContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    notFoundText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        fontFamily: "PoppinsRegular"
    }
});

export default OrderList;
