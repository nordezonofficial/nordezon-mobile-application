import Product from '@/components/brands/Product';
import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import DataNotFound from '@/components/common/DataNotFound';
import Loading from '@/components/common/Loading';
import { useGetPostListQuery } from '@/store/api/v1/post';
import { setPostList, setPostMetaData } from '@/store/slices/post';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const ChatProductPicker = ({ visible, onClose, onSelectProduct }: any) => {
    const dispatch = useDispatch();
    const { postList, postMetaData } = useSelector((state: any) => state.post);

    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { data, refetch, isLoading } = useGetPostListQuery({
        page,
        type: 'PRODUCT',
    });

    // Handle pagination data updates
    useEffect(() => {
        if (data && data.status === 'success') {
            if (page === 1) {
                dispatch(setPostList(data.data.data));
            } else {
                dispatch(setPostList([...postList, ...data.data.data]));
            }
            dispatch(setPostMetaData(data.data.meta));
            setIsLoadingMore(false);
        }
    }, [data]);

    const handleLoadMore = () => {
        if (
            postMetaData &&
            postMetaData.currentPage < postMetaData.totalPages &&
            !isLoadingMore &&
            !isLoading
        ) {
            setIsLoadingMore(true);
            setPage((prev) => prev + 1);
        }
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <Loading />
            </View>
        );
    };

    const renderProduct = ({ item }: { item: any }) => {
        if (!item) return null;
        return (
            <Product
                onPress={() => {
                    onSelectProduct(item);
                    onClose();
                }}
                item={item}
                hasItem={true}
                overlayButtons={false}
            />
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <CText style={styles.modalTitle}>Select a Product</CText>
                        <CTouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={26} color="#000" />
                        </CTouchableOpacity>
                    </View>

                    {/* Body */}
                    {isLoading && page === 1 ? (
                        <Loading />
                    ) : (
                        <FlatList
                            data={postList || []}
                            renderItem={renderProduct}
                            keyExtractor={(item, index) =>
                                index.toString()
                            }
                            numColumns={2}
                            contentContainerStyle={styles.productContainer}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.1}
                            ListFooterComponent={renderFooter}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <DataNotFound
                                    message="No products available"
                                    icon="albums-outline"
                                />
                            }
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        bottom: 10,

    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '75%',
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    closeButton: {
        padding: 6,
    },
    productContainer: {
        paddingBottom: 20,
    },
    productWrapper: {
        flex: 1,
        margin: 4,
        alignItems: 'center',
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default ChatProductPicker;
