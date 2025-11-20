import { primaryGreen } from '@/constants/colors'
import { useGetOriginalsListQuery } from '@/store/api/v1/originals'
import { useGetAllPostListQuery } from '@/store/api/v1/post'
import { setOriginalList, setOriginalsMetaData, setOrignalsId } from '@/store/slices/originals'
import { setStoryList, setStoryMetaData } from '@/store/slices/post'
import { Ionicons } from '@expo/vector-icons'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CTouchableOpacity from '../common/CTouchableOpacity'

// Single DataNotFound for Stories
const StoriesDataNotFound = () => (
    <View style={styles.dataNotFoundContainer}>
        <Ionicons name="film-outline" size={48} color="#cfd8dc" style={{ marginBottom: 8 }} />
        <Text style={styles.dataNotFoundText}>No Stories found</Text>
    </View>
)

// Avatar Skeleton Loader - encapsulates a single circular skeleton item with activity indicator
const AvatarLoader = ({ image }: any) => (
    <View style={[
        styles.avatarSkeleton,
        {
            width: image?.width || 95,
            height: image?.height || 140,
            borderRadius: 90,
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(200, 200, 200, 0.5)'
        }
    ]}>
        <ActivityIndicator size="small" color={primaryGreen} />
    </View>
)

// "Perfect" Loading Skeleton for stories
const StoriesLoading = ({ image, count = 6 }: any) => (
    <View style={[styles.skeletonContainer, { height: image?.height || 140 }]}>
        {[...Array(count)].map((_, idx) =>
            <AvatarLoader key={idx} image={image} />
        )}
    </View>
)

/**
 * Memoized item using custom compare for best performance
 * 
 * To use dispatch and setOrignalsId in MemoizedOriginalItem,
 * - Pass dispatch into MemoizedOriginalItem as a prop from Stories.
 * - Call dispatch(setOrignalsId(item.id)) onPress.
 */
const MemoizedOriginalItem = memo(
    ({ item, onPress, isOriginals, image, dispatch }: { isOriginals?: boolean, item: any, onPress: any, image: any, dispatch: any }) => (
        <ImageBackground source={{ uri: item.banner }} style={[
            image,
            {
                borderRadius: 10,
                borderWidth: 1,
                borderColor: primaryGreen,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
            }
        ]}>
            <CTouchableOpacity
                style={styles.playPauseButton}
                onPress={() => {
                    // This is how to use dispatch to set the original id
                    if (isOriginals && dispatch) {
                        console.log("item.id", item.id);

                        dispatch(setOrignalsId(item.id))
                    }
                    onPress && onPress()
                }}
            >
                <Ionicons name="play-circle" size={36} color="white" />
            </CTouchableOpacity>
        </ImageBackground>
    ),
    (prevProps, nextProps) => (
        prevProps.item.id === nextProps.item.id &&
        prevProps.item.banner === nextProps.item.banner
    )
);

const MemoizedStoryItem = memo(
    ({ item, onPress, image }: { item: any, onPress: any, image: any }) => (
        <ImageBackground source={{ uri: item.videoThumbnail }} style={[
            image,
            {
                borderRadius: 10,
                borderWidth: 1,
                borderColor: primaryGreen,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
            }
        ]}>
            <CTouchableOpacity
                style={styles.playPauseButton}
                onPress={onPress}
            >
                <Ionicons name="play-circle" size={36} color="white" />
            </CTouchableOpacity>
        </ImageBackground>
    ),
    (prevProps, nextProps) => (
        prevProps.item.id === nextProps.item.id &&
        prevProps.item.videoThumbnail === nextProps.item.videoThumbnail
    )
);

const Stories = ({
    image = {
        width: 95,
        height: 140,
    },
    top = 65,
    height = 200,
    onPress,
    isOriginals = false,
    isFromOriginal = false,
}: any) => {
    const flatListRef = useRef<FlatList>(null);

    const [page, setPage] = useState(1)
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { data, refetch, isLoading } = useGetAllPostListQuery({
        page: page,
        type: "STORY",
        request: "USER",
        skip: isOriginals || isFromOriginal,
    });

    const dispatch = useDispatch();
    const [originalPage, setOriginalPage] = useState(1)

    const { data: originalsData, isLoading: isOriginalsLoading } = useGetOriginalsListQuery({
        page: originalPage,
        skip: !(isOriginals || isFromOriginal),
    })

    const { storyList, storyMetaData } = useSelector((state: any) => state.post);
    const { originalsList, originalsMetaData } = useSelector((state: any) => state.originals);

    const [allOriginals, setAllOriginals] = useState<any[]>([]);

    useEffect(() => {
        if (originalsData && originalsData.status === "success" && originalsData.data?.originals) {
            const fetchedOriginals = originalsData.data.originals || [];
            if (originalPage === 1) {
                setAllOriginals(fetchedOriginals);
                dispatch(setOriginalList(fetchedOriginals));
            } else {
                const ids = new Set(allOriginals.map((item: any) => item.id));
                const merged = [
                    ...allOriginals,
                    ...fetchedOriginals.filter((item: any) => !ids.has(item.id)),
                ];
                setAllOriginals(merged);
                dispatch(setOriginalList(merged));
            }
            dispatch(setOriginalsMetaData(originalsData.data.meta));
            setIsLoadingMore(false);
        }
        // eslint-disable-next-line
    }, [originalsData, originalPage]);

    useEffect(() => {
        if (!isFromOriginal) {
            setAllOriginals([]);
            setOriginalPage(1);
        }
    }, [isFromOriginal]);

    useEffect(() => {
        if (page > 1) {
            refetch();
        }
    }, [page, refetch]);

    useEffect(() => {
        if (data && data.status === 'success') {
            if (page === 1) {
                dispatch(setStoryList(data.data.posts))
            } else {
                dispatch(setStoryList([...storyList, ...data.data.posts]))
            }
            dispatch(setStoryMetaData(data.data.meta))
            setIsLoadingMore(false);
        }
    }, [data])

    const getItemLayout = (_: any, index: number) => ({
        length: 110,
        offset: 110 * index,
        index
    });

    const initialScrollIndex = 2;

    const isLoadingMoreRef = useRef(false);

    const handleLoadMore = useCallback(() => {
        if (isFromOriginal) {
            if (
                originalsMetaData &&
                originalsMetaData.currentPage < originalsMetaData.totalPages &&
                !isOriginalsLoading &&
                !isLoadingMoreRef.current &&
                !isLoadingMore
            ) {
                isLoadingMoreRef.current = true;
                setIsLoadingMore(true);
                setOriginalPage(prevPage => prevPage + 1)
            }
            return;
        }

        if (
            storyMetaData &&
            storyMetaData.currentPage < storyMetaData.totalPages &&
            !isLoading &&
            !isLoadingMoreRef.current &&
            !isLoadingMore
        ) {
            isLoadingMoreRef.current = true;
            setIsLoadingMore(true);
            setPage(prevPage => prevPage + 1)
        }
    }, [
        isFromOriginal,
        originalsMetaData,
        isLoadingMore,
        isOriginalsLoading,
        setOriginalPage,
        storyMetaData,
        isLoading,
        setPage
    ]);

    useEffect(() => {
        if (!isLoadingMore && !isOriginalsLoading) {
            isLoadingMoreRef.current = false;
        }
    }, [isLoadingMore, isOriginalsLoading]);

    let originalsDataArr: any[] = [];
    if (isFromOriginal) {
        if (Array.isArray(allOriginals) && allOriginals.length > 0) {
            originalsDataArr = allOriginals;
        } else if (Array.isArray(originalsList) && originalsList.length > 0) {
            originalsDataArr = originalsList;
        } else {
            originalsDataArr = [
                {
                    "id": 18,
                    "banner": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAWgb3geAT7e5eiMwF57Re8_o23S_jFngnyA&s",
                    "videoUrl": "ttps://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                    "createdAt": "2025-11-18T13:55:56.031Z",
                    "updatedAt": "2025-11-18T13:55:56.031Z"
                }
            ]
        }
    }

    return (
        <View style={[styles.container, {
            top: top,
            height: height,
        }]}>
            {isFromOriginal ? (
                isOriginalsLoading && originalsDataArr.length === 0 ? (
                    <StoriesLoading image={image} />
                ) : (!originalsDataArr || originalsDataArr.length === 0) ? (
                    <StoriesDataNotFound />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={originalsDataArr}
                        renderItem={({ item }) => (
                            <MemoizedOriginalItem item={item} isOriginals={isOriginals} onPress={onPress} image={image} dispatch={dispatch} />
                        )}
                        keyExtractor={(item, index: number) => (item?.id?.toString() ?? index.toString())}
                        horizontal
                        onEndReached={handleLoadMore}
                        showsHorizontalScrollIndicator={false}
                        getItemLayout={getItemLayout}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={
                            originalsMetaData && originalsMetaData.hasNextPage && isLoadingMore ?
                                <View style={styles.footerLoading}>
                                    <ActivityIndicator size="small" color={primaryGreen} />
                                </View> : null
                        }
                    />
                )
            ) : (
                isLoading ? (
                    <StoriesLoading image={image} />
                ) : (!storyList || storyList.length === 0) ? (
                    <StoriesDataNotFound />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={storyList || []}
                        renderItem={({ item }) => (
                            <MemoizedStoryItem item={item} onPress={onPress} image={image} />
                        )}
                        keyExtractor={(item, index: number) =>
                            (item?.id ? item.id.toString() : index.toString())
                        }
                        horizontal
                        onEndReached={handleLoadMore}
                        showsHorizontalScrollIndicator={false}
                        initialScrollIndex={initialScrollIndex}
                        getItemLayout={getItemLayout}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={
                            isLoadingMore ?
                                <View style={styles.footerLoading}>
                                    <ActivityIndicator size="small" color={primaryGreen} />
                                </View> : null
                        }
                    />
                )
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: 15,
    },
    playPauseButton: {
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 2,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#fff"
    },
    dataNotFoundContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        height: 140
    },
    dataNotFoundText: {
        fontSize: 16,
        color: "#b0b0b0",
        fontFamily: "PoppinsMedium",
        textAlign: "center"
    },
    skeletonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    avatarSkeleton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(200, 200, 200, 0.5)'
    },
    skeletonItem: {
        backgroundColor: 'rgba(200, 200, 200, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerLoading: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        height: 50,
        alignSelf: 'center'
    }
})

export default Stories