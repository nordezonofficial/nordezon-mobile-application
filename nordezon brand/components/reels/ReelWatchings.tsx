import { isVideoFile } from '@/helpers';
import { useGetAllPostListQuery } from '@/store/api/v1/post';
import { setReelList, setReelMetaData, setStoryList, setStoryMetaData } from '@/store/slices/post';
import { Asset } from 'expo-asset';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ReelItem from './ReelItem';
const { height, width } = Dimensions.get('window');

interface Reel {
    id: string;
    title: string;
    url: string;
    videoThumbnail: string;
    likes?: number;
    comments?: number;
    isFromStory?: boolean
}

export default function ReelsScreen({ isFromBrand, isFromStory = false }: { isFromBrand?: boolean, isFromStory?: boolean }) {
    const [currentIndex, setCurrentIndex] = useState(-1);
    const hasInitializedRef = useRef(false);
    const { reelList, reelMetaData, watchReel } = useSelector((state: any) => state.post);
    const { storyList, story, watchStory, storyMetaData, postLikesComments } = useSelector((state: any) => state.post)

    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { user } = useSelector((state: any) => state.user)
    const { data, isLoading, refetch } = useGetAllPostListQuery({
        page,
        type: isFromStory ? 'STORY' : 'REEL',
        request: user.role
    });
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {

            setPage(1);
            refetch();

            // optional cleanup
            return () => {
                console.log("Screen unfocused");
            };
        }, [])
    );

    // ✅ NEW: cache of preloaded players
    const playerCache = useRef<Record<string, any>>({});

    useEffect(() => {
        if (!hasInitializedRef.current) {
            setCurrentIndex(0);
            hasInitializedRef.current = true;
        }
    }, []);

    useEffect(() => {
        if (data && data.status === 'success') {
            if (page === 1) {

                if (isFromStory) {
                    dispatch(setStoryList(data.data.posts));
                } else {
                    dispatch(setReelList(data.data.post));
                }
            } else {
                if (isFromStory) {
                    dispatch(setStoryList([...storyList, ...data.data.post]));

                } else {
                    dispatch(setReelList([...reelList, ...data.data.post]));

                }
            }
            if (isFromStory) {
                dispatch(setStoryMetaData(data.data.meta));
            } else {
                dispatch(setReelMetaData(data.data.meta));

            }
            setIsLoadingMore(false);
        }
    }, [data]);

    const handleLoadMore = () => {
        if (isFromStory) {
            if (
                storyMetaData &&
                storyMetaData.currentPage < storyMetaData.totalPages &&
                !isLoadingMore &&
                !isLoading
            ) {
                setIsLoadingMore(true);
                setPage(prevPage => prevPage + 1);
            }

            return;
        }
        if (
            reelMetaData &&
            reelMetaData.currentPage < reelMetaData.totalPages &&
            !isLoadingMore &&
            !isLoading
        ) {
            setIsLoadingMore(true);
            setPage(prevPage => prevPage + 1);
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const newIndex = viewableItems[0].index;
            if (newIndex !== currentIndex && newIndex !== null && newIndex !== undefined) {
                setCurrentIndex(newIndex);
            }
        }
    }).current;

    const viewConfigRef = { viewAreaCoveragePercentThreshold: 80 };

    useEffect(() => {
        if (currentIndex < 0 || !reelList?.length) return;

        const nextIndex = currentIndex + 1;
        const nextReel = isFromStory ? storyList[nextIndex] : reelList[nextIndex];

        const preloadNextVideo = async (uri: string) => {
            try {
                // Preload and cache the video file locally
                const asset = Asset.fromURI(uri);
                await asset.downloadAsync();
                console.log("Preloaded:", uri);
            } catch (err) {
                console.warn("Preload failed:", uri, err);
            }
        };

        if (nextReel) {
            preloadNextVideo(nextReel.url);
        }
    }, [currentIndex, reelList, storyList]);

    const renderItem = useCallback(
        ({ item, index }: { item: Reel; index: number }) => (

            <MemoizedReelItem
                isFromStory={isFromStory}
                isFromBrand={user.role == "BRAND"}
                item={item}
                isActive={index === currentIndex}
                preloadedPlayer={playerCache.current[item.id]} // ✅ Pass preloaded player if available
            />
        ),
        [currentIndex]
    );

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (isFromStory) {
            if (storyList?.length && watchStory?.id) {
                const index = storyList.findIndex((r: any) => r.id === watchStory.id);
                if (index !== -1) {
                    setCurrentIndex(index);
                    flatListRef.current?.scrollToIndex({ index, animated: false });
                }
            }
        } else {
            if (reelList?.length && watchReel?.id) {
                const index = reelList.findIndex((r: any) => r.id === watchReel.id);
                if (index !== -1) {
                    setCurrentIndex(index);
                    flatListRef.current?.scrollToIndex({ index, animated: false });
                }
            }
        }
    }, [reelList, watchReel]);

    const MemoizedReelItem = React.memo(ReelItem);


    useEffect(() => {
        // Only auto-scroll for stories (not reels)
        if (!isFromStory) return;

        // Get current item
        const currentItem = isFromStory ? storyList[currentIndex] : reelList[currentIndex];
        if (!currentItem) return;

        // If it's NOT a video, auto-scroll after 3 seconds
        if (!isVideoFile(currentItem.url)) {
            const timer = setTimeout(() => {
                if (currentIndex < (isFromStory ? storyList.length - 1 : reelList.length - 1)) {
                    flatListRef.current?.scrollToIndex({
                        index: currentIndex + 1,
                        animated: true,
                    });
                }
            }, 3000); // 3 seconds

            return () => clearTimeout(timer); // clear on unmount or index change
        }
    }, [currentIndex, isFromStory, storyList, reelList]);


    // const [dummyData, setDummyData] = useState([
    //     {
    //         id: '1',
    //         title: 'Morning Motivation',
    //         url: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519286395-272205347.mp4",
    //         videoThumbnail: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519293119-146535781.png',
    //         likes: 120,
    //         comments: 15,
    //         _count: { comments: 15 },
    //         isFromStory: true,
    //     },
    //     {
    //         id: '2',
    //         title: 'Coffee Time',
    //         url: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519351119-670005774.mp4',
    //         videoThumbnail: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519356726-92682433.png',
    //         likes: 80,
    //         comments: 5,
    //         _count: { comments: 5 },
    //         isFromStory: true,
    //     },
    //     {
    //         id: '3',
    //         title: 'Workout Routine',
    //         url: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519433824-300102704.mp4',
    //         videoThumbnail: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519446102-394356638.png',
    //         likes: 200,
    //         comments: 20,
    //         _count: { comments: 20 },
    //         isFromStory: true,
    //     },
    //     {
    //         id: '4',
    //         title: 'Evening Walk',
    //         url: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519479406-644938177.mp4',
    //         videoThumbnail: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519484812-44340466.png',
    //         likes: 60,
    //         comments: 3,
    //         _count: { comments: 3 },
    //         isFromStory: true,
    //     },
    //     {
    //         id: '5',
    //         title: 'Lunch Break',
    //         url: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519513383-971955817.mp4',
    //         videoThumbnail: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519518521-970269566.png',
    //         likes: 90,
    //         comments: 8,
    //         _count: { comments: 8 },
    //         isFromStory: true,
    //     },
    //     {
    //         id: '6',
    //         title: 'Desk Setup',
    //         url: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519554392-378606364.mp4',
    //         videoThumbnail: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519563708-150534599.png',
    //         likes: 50,
    //         comments: 2,
    //         _count: { comments: 2 },
    //         isFromStory: true,
    //     },
    //     {
    //         id: '7',
    //         title: 'Sunset Views',
    //         url: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519746467-676571489.mp4',
    //         videoThumbnail: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519757995-421514466.png',
    //         likes: 150,
    //         comments: 12,
    //         _count: { comments: 12 },
    //         isFromStory: true,
    //     },
    //     {
    //         id: '8',
    //         title: 'Reading Time',
    //         url: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519775358-453712428.mp4',
    //         videoThumbnail: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519778472-663894261.png',
    //         likes: 70,
    //         comments: 4,
    //         _count: { comments: 4 },
    //         isFromStory: true,
    //     },
    //     {
    //         id: '9',
    //         title: 'Evening Chill',
    //         url: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519827179-559014955.mp4',
    //         videoThumbnail: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519833104-126129153.png',
    //         likes: 110,
    //         comments: 10,
    //         _count: { comments: 10 },
    //         isFromStory: true,
    //     },
    //     {
    //         id: '10',
    //         title: 'Night Routine',
    //         url: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519858810-320073008.mp4',
    //         videoThumbnail: 'https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762519861976-163971108.png',
    //         likes: 40,
    //         comments: 1,
    //         _count: { comments: 1 },
    //         isFromStory: true,
    //     },
    // ])
    return (
        <FlatList
            nestedScrollEnabled={true}
            ref={flatListRef}
            // data={dummyData as any}
            data={isFromStory ? storyList
                : reelList
            }
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewConfigRef}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            snapToInterval={height}
            snapToAlignment="start"
            initialScrollIndex={
                reelList.findIndex((r: any) => r.id === isFromStory ? watchStory?.id : watchReel?.id) || 0
            }
            getItemLayout={(data, index) => ({
                length: height,
                offset: height * index,
                index,
            })}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={2}
            removeClippedSubviews={true}
            style={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        // borderWidth:2,
        backgroundColor: 'black',
    },
});
