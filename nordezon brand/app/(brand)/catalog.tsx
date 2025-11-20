import PostViewPopUp from '@/components/brands/posts/PostViewPopUp';
import Product from '@/components/brands/Product';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import BrandBreadCrums from '@/components/common/BrandBreadCrums';
import CSnackbar from '@/components/common/CSnackbar';
import DataNotFound from '@/components/common/DataNotFound';
import FloatingButton from '@/components/common/FloatingButton';
import Loading from '@/components/common/Loading';
import { useGetPostListQuery } from '@/store/api/v1/post';
import { setPostList, setPostMetaData, setSingleCatalogue } from '@/store/slices/post';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';



const CatalogScreen = () => {
    const [catalogs, setCatalogs] = useState();
    /* -- navigation --*/
    const router = useRouter();
    const [page, setPage] = useState(1)
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { postList, catalogue } = useSelector((state: any) => state.post)
    const { postMetaData } = useSelector((state: any) => state.post)
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.user)
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');



    const { data, refetch, isLoading, error } = useGetPostListQuery({
        page: page,
        type: "PRODUCT"
    });








    /* --- Add useEffect to refetch when page changes ---- */
    useEffect(() => {
        if (page > 1) {
            refetch();
        }
    }, [page, refetch]);



    useEffect(() => {
        if (data && data.status == 'success') {
            if (page === 1) {
                /* --- First page - replace the list --- */
                dispatch(setPostList(data.data.data))
            } else {
                /* ---  Subsequent pages - append to existing list t --- */
                dispatch(setPostList([...postList, ...data.data.data]))
            }
            dispatch(setPostMetaData(data.data.meta))
            setIsLoadingMore(false);
        }

    }, [data])


    const handleLoadMore = () => {
        if (postMetaData && postMetaData.currentPage < postMetaData.totalPages && !isLoadingMore && !isLoading) {
            setIsLoadingMore(true);
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleCreateCatalog = () => {
        router.navigate({
            pathname: '/(brand)/createCatalogue',
            params: {
                type: "CREATE"
            }
        })
    };
    const [showPostPopup, setShowPostpopup] = useState(false)

    const handlePressOverLayButtons = (param: string, item: any) => {
        dispatch(setSingleCatalogue(item))

        setShowPostpopup(true)
    }

    const handleClosePopup = () => {
        setShowPostpopup(false)
        dispatch(setSingleCatalogue({}))
    };

    const renderProduct = ({ item, index }: { item: any, index: number }) => {
        if (!item || typeof item !== 'object') {
            return null;
        }
        return (
            <Product
                handlePressOverLay={handlePressOverLayButtons}

                hasEyes={true}
                setSnackbarVisible={setSnackbarVisible}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarType={setSnackbarType}
                item={item} hasItem={true} overlayButtons={true} key={index} />
        );
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <Loading />
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
            <BackgroundContainer>
                <BrandBreadCrums title={'Manage Your Catalogue'}
                    subtitle={'Easily update, edit, or browse your collections'}
                ></BrandBreadCrums>
                {isLoading && page === 1 ? (
                    <Loading />
                ) : (
                    <FlatList
                        data={postList || []}
                        renderItem={renderProduct}
                        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                        numColumns={2}
                        contentContainerStyle={styles.productContainer}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={renderFooter}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <DataNotFound
                                message="No catalogues found"
                                icon="albums-outline"
                            />
                        }
                    />
                )}
                <FloatingButton onPress={handleCreateCatalog} />
                {showPostPopup && (
                    <PostViewPopUp
                        brand={{
                            name: user.brandName,
                            logo: user.logoUrl,
                            verified: user.isApprovedbyAdmin && user.isApprovedByLawyer
                        }}
                        _count={{
                            likes: catalogue._count.likes,
                            comments: catalogue._count.comments,
                        }}
                        visible={!!showPostPopup}
                        onClose={handleClosePopup}
                        post={catalogue}
                    />
                )}
            </BackgroundContainer>
        </>

    )
}

const styles = StyleSheet.create({
    productContainer: {
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },

});

export default CatalogScreen;
