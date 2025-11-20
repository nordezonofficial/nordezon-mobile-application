import { formatDate } from '@/helpers';
import { useGetNotificationListQuery } from '@/store/api/v1/user';
import { setNotifications, setUnReadNotificationCount } from '@/store/slices/user';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CText from './CText';

interface NotificationBoxProps {
    visible: boolean;
    onClose: () => void;
}

const NotificationBox: React.FC<NotificationBoxProps> = ({ visible, onClose }) => {
    const [page, setPage] = useState(1);
    const [allNotifications, setAllNotifications] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);

    // Fetch notification data for the given page
    const { data, isFetching } = useGetNotificationListQuery({ page });

    const { notifications, unReadNotificationCount } = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    // Whenever new data loads for a page, merge it into allNotifications & update Redux
    useEffect(() => {
        if (data) {
            if (page === 1) {
                setAllNotifications(data.data.notifications || []);
            } else if (data.data.notifications?.length) {
                setAllNotifications((prev: any[]) => [
                    ...prev,
                    ...data.data.notifications
                ]);
            }
            dispatch(setNotifications(data.data.notifications || []));
            dispatch(setUnReadNotificationCount(data.data.unReadNotificationCount));
            // If the number of items returned is less than expected "per_page", assume there is no more data
            if (data.data.notifications?.length < (data.data.perPage || 10)) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
            dispatch(
                setUnReadNotificationCount(
                    Math.max(unReadNotificationCount - notifications.length, 0)
                )
            );
        }
    }, [data, page, dispatch]);

    // Reset pagination when the modal opens/closes
    useEffect(() => {
        if (visible) {
            setPage(1);
            setHasMore(true);
        }
    }, [visible]);

    // Handler to fetch next page
    const handleLoadMore = useCallback(() => {
        if (!isFetching && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }, [isFetching, hasMore]);

    // Handle manual pull-to-refresh
    const handleRefresh = () => {
        setPage(1);
        setHasMore(true);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <CText style={styles.title}>Notifications</CText>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Notification List with Pagination */}
                    <FlatList
                        data={allNotifications}
                        renderItem={({ item }) => (
                            <View style={styles.notificationItem}>
                                <CText style={styles.notificationTitle}>{item.type}</CText>
                                <CText style={styles.notificationMessage}>{item.message}</CText>

                                {/* Show order items if type is ORDER */}
                                {item.type === 'ORDER' && item.order?.items?.length > 0 && (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.orderItemsContainer}
                                    >
                                        {item.order.items.map((orderItem: any) => (
                                            <View key={orderItem.id} style={styles.orderItem}>
                                                <Image
                                                    source={{ uri: orderItem.post.url }}
                                                    style={styles.orderImage}
                                                    resizeMode="cover"
                                                />
                                                <View style={styles.orderItemDetails}>
                                                    <CText style={styles.orderItemTitle}>{orderItem.post.title}</CText>
                                                    <CText style={styles.orderItemSKU}>SKU: {orderItem.post.sku}</CText>
                                                    <CText style={styles.orderItemPrice}>Price: Rs.{orderItem.price}</CText>
                                                </View>
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}

                                {item.createdAt && <CText style={styles.time}>{formatDate(item.createdAt)}</CText>}
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={
                            isFetching && page === 1 ? (
                                <ActivityIndicator style={{ margin: 24 }} color="#666" />
                            ) : (
                                <View style={styles.empty}>
                                    <CText>No notifications</CText>
                                </View>
                            )
                        }
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={() =>
                            isFetching && page !== 1 ? (
                                <View style={{ padding: 20 }}>
                                    <ActivityIndicator size="small" color="#888" />
                                </View>
                            ) : !hasMore && allNotifications.length > 0 ? (
                                <View style={{ alignItems: 'center', padding: 16 }}>
                                    <CText style={{ color: '#aaa', fontSize: 13 }}>No more notifications</CText>
                                </View>
                            ) : null
                        }
                        refreshing={isFetching && page === 1}
                        onRefresh={handleRefresh}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
        top: -10,
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '70%',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontFamily: 'PoppinsSemiBold',
        color: '#222',
    },
    orderItemsContainer: {
        marginTop: 8,
        gap: 10,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingRight: 10,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#fff',

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 0,

        // Android shadow
        elevation: 2,
    },

    orderImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    orderItemDetails: {
        flex: 1,
    },
    orderItemTitle: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 14,
        color: '#333',
    },
    orderItemSKU: {
        fontFamily: 'PoppinsRegular',
        fontSize: 12,
        color: '#555',
        marginTop: 2,
    },
    orderItemPrice: {
        fontFamily: 'PoppinsRegular',
        fontSize: 12,
        color: '#555',
        marginTop: 2,
    },

    notificationItem: {
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
    },
    notificationTitle: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 14,
        color: '#333',
    },
    notificationMessage: {
        fontFamily: 'PoppinsRegular',
        fontSize: 13,
        color: '#555',
        marginTop: 2,
    },
    time: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
        right: 0,
        position: "absolute"
    },
    empty: {
        alignItems: 'center',
        padding: 20,
    },
});

export default NotificationBox;
