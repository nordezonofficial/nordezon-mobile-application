import Post from '@/components/brands/posts/Post';
import PostViewPopUp from '@/components/brands/posts/PostViewPopUp';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import BrandBreadCrums from '@/components/common/BrandBreadCrums';
import CSnackbar from '@/components/common/CSnackbar';
import DataNotFound from '@/components/common/DataNotFound';
import FloatingButton from '@/components/common/FloatingButton';
import Loading from '@/components/common/Loading';
import { useGetPostListQuery } from '@/store/api/v1/post';
import { setSingleStory, setStoryList, setStoryMetaData, setWatchStory } from '@/store/slices/post';
import { useRouter } from 'expo-router';

import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const { width } = Dimensions.get('screen');

const Posts = () => {
    /* -- navigation --*/
    const router = useRouter();

    const [page, setPage] = useState(1)
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { storyList, story, storyMetaData } = useSelector((state: any) => state.post)
    const dispatch = useDispatch();
    const [showPostPopup, setShowPostpopup] = useState(false)

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');



    const { user } = useSelector((state: any) => state.user)
    const { data, refetch, isLoading, error } = useGetPostListQuery({
        page: page,
        type: "STORY"
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
                dispatch(setStoryList(data.data.data))
            } else {
                /* ---  Subsequent pages - append to existing list t --- */
                dispatch(setStoryList([...storyList, ...data.data.data]))
            }
            dispatch(setStoryMetaData(data.data.meta))
            setIsLoadingMore(false);
        }

    }, [data])



    const handleLoadMore = () => {
        if (storyMetaData && storyMetaData.currentPage < storyMetaData.totalPages && !isLoadingMore && !isLoading) {
            setIsLoadingMore(true);
            setPage(prevPage => prevPage + 1);
        }
    };




    const handleCreatepost = () => {
        router.navigate({
            pathname: '/(brand)/createPost',
            params: {
                type: "STORY"
            }
        })
    }
    const handleViewReels = (param: any) => {
        dispatch(setWatchStory(param))
        router.push('/(stories)/stories')
    }


    const renderProduct = ({ item, index }: { item: any, index: number }) => {
        if (!item || typeof item !== 'object') {
            return null;
        }
        return (
            <Post
                hasActionButtons
                isStory={true}
                isReel={false}
                onPressPost={handleViewReels}
                setSnackbarVisible={setSnackbarVisible}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarType={setSnackbarType}
                item={item}
                handlePressOverLay={handlePressOverLayButtons}
                overlayButtons={true}
                key={index}
            />
        );
    };



    const handleClosePopup = () => {
        setShowPostpopup(false)
        dispatch(setSingleStory({}))
    };


    const [selectedPost, setSelectedPost] = useState<any | null>(null);

    const handlePressOverLayButtons = (param: string, item: any) => {
        dispatch(setSingleStory(item))

        setShowPostpopup(true)
    }

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

            <BackgroundContainer paddingHorizontal={0}>

                <BrandBreadCrums paddingHorizontal={10} title={'Your Brand Stories'}
                    subtitle={'Showcase your latest stories and updates with your audience'}
                ></BrandBreadCrums>



                {isLoading && page === 1 ? (
                    <Loading />
                ) : (
                    <FlatList
                        data={storyList || []}
                        renderItem={renderProduct}
                        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                        numColumns={3}
                        contentContainerStyle={styles.productContainer}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={
                            <DataNotFound
                                message="No Stories found"
                                icon="film-outline"
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}



                <FloatingButton onPress={handleCreatepost} />

                {/*  Popup for selected post */}
                {showPostPopup && (
                    <PostViewPopUp
                        brand={{
                            name: user.brandName,
                            logo: user.logoUrl,
                            verified: user.isApprovedbyAdmin && user.isApprovedByLawyer
                        }}
                        _count={{
                            likes: story._count.likes,
                            comments: story._count.comments,
                        }}
                        visible={!!showPostPopup}
                        onClose={handleClosePopup}
                        post={story}
                    />
                )}
            </BackgroundContainer>
        </>

    );
};

const styles = StyleSheet.create({
    productContainer: {
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default Posts;
