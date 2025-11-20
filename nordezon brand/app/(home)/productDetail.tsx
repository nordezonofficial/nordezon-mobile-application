import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import HRLineFullWidth from '@/components/common/HRLineFullWidth';
import Loading from '@/components/common/Loading';
import ProductCatalogue from '@/components/home/product/ProductCatalogue';
import ProductDetail from '@/components/home/product/ProductDetail';
import ReviewList from '@/components/home/reviews/ReviewList';
import { useGetHomeFeedsQuery, useGetPostDetailByPostIdQuery, useGetPostListByBrandIdQuery } from '@/store/api/v1/post';
import { useGetReviewsListByPostIdQuery } from '@/store/api/v1/reviews';
import { setCatalogueList, setCatalogueMetaData, setHomeFeedList, setHomeFeedMetaData, setSelectedEntity } from '@/store/slices/post';
import { setReviewsList, setReviewsMetaData } from '@/store/slices/reviews';
import { Ionicons } from '@expo/vector-icons'; // For star icons
import { useLocalSearchParams } from 'expo-router';
import React, { memo, useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
const { width } = Dimensions.get('window')

// New Import for Home Feeds


// Extend review to also store rating (now supports half)
type Review = {
    text: string,
    rating: number // allow float (half stars, e.g. 3.5)
};

const productDetail = () => {
    // State for Add Review form
    const [review, setReview] = useState('');
    const [reviewRating, setReviewRating] = useState<number>(0);
    const [showReviewInput, setShowReviewInput] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const { selectedEntity, homeFeeds, homeFeedsMetaData } = useSelector((state: any) => state.post)
    const { reviews: reviewsList, reviewMetaData } = useSelector((state: any) => state.reviews)
    const { user } = useSelector((state: any) => state.user) || {};
    const { id } = useLocalSearchParams();

    const [canUserReviews, setCanUserReviews] = useState(false)
    const [productDetailLoading, setProductDetailLoading] = useState(true)





    const { data, refetch: refetchGetPostDetail } = useGetPostDetailByPostIdQuery({
        postId: id,
        commentLikesCount: "DISABLED",
    });

    useEffect(() => {
        console.log("Route changed — refetching");
        refetchGetPostDetail();
    }, [id]);
    // useFocusEffect(
    //     useCallback(() => {
    //         console.log("Screen is focused — refetcching");
    //         refetchGetPostDetail()
    //         // optional cleanup
    //         return () => {
    //             console.log("Screen unfocused");
    //         };
    //     }, [])
    // );



    const dispatch = useDispatch();

    useEffect(() => {
        if (data && data.status == "success") {
            let payload = {
                id: id,
                requestType: "POST",
                item: data.data
            }
            dispatch(setSelectedEntity(payload))
            setProductDetailLoading(false)
        }
    }, [data])

    const handleAddReview = () => {
        if (review.trim().length > 0 && reviewRating > 0) {
            setReviews([{ text: review, rating: reviewRating }, ...reviews]);
            setReview('');
            setReviewRating(0);
            setShowReviewInput(false);
        }
    }

    /**
     * StarRow: shows 5 stars, allow user to choose half by tapping left half (half star), or full by tapping right half.
     * rating: number (float, e.g. 2.5)
     * setRating: (num) => void (optional, if can change)
     */
    const StarRow = ({
        rating,
        setRating
    }: {
        rating: number,
        setRating?: (rating: number) => void
    }) => (
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <View key={i} style={{ flexDirection: 'row', position: 'relative', width: 24 }}>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            left: 0,
                            width: 12,
                            height: 30,
                            zIndex: 2,
                        }}
                        activeOpacity={setRating ? 0.7 : 1}
                        disabled={!setRating}
                        onPress={() => setRating && setRating(i - 0.5)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 2 }}
                    >
                        {/* Empty touchable for left/half */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: 0,
                            width: 12,
                            height: 30,
                            zIndex: 1,
                        }}
                        activeOpacity={setRating ? 0.7 : 1}
                        disabled={!setRating}
                        onPress={() => setRating && setRating(i)}
                        hitSlop={{ top: 6, bottom: 6, left: 2, right: 6 }}
                    >
                        {/* Empty touchable for right/full */}
                    </TouchableOpacity>
                    <Ionicons
                        name={
                            rating >= i
                                ? "star"
                                : rating >= i - 0.5
                                    ? "star-half"
                                    : "star-outline"
                        }
                        size={21}
                        color="#FFA900"
                        style={{ marginHorizontal: 1 }}
                    />
                </View>
            ))}
        </View>
    );

    const [page, setPage] = useState(1)

    const { data: reviewsData, isLoading: isReviewsLoading, refetch: refetchReviews } = useGetReviewsListByPostIdQuery({
        page: page,
        postId: selectedEntity.id,
    });

    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        if (reviewsData && reviewsData.status == 'success') {
            if (page === 1) {
                /* --- First page - replace the list --- */
                dispatch(setReviewsList(reviewsData.data.reviews))
            } else {
                /* ---  Subsequent pages - append to existing list t --- */
                dispatch(setReviewsList([...reviewsList, ...reviewsData.data.reviews]))
                setIsLoadingMore(false)
            }
            dispatch(setReviewsMetaData(reviewsData.data.meta))
            setCanUserReviews(reviewsData.data.canUserReview)
        }
    }, [reviewsData])

    /* --- Add useEffect to refetch when page changes ---- */
    useEffect(() => {
        if (page > 1) {
            refetchReviews();
        }
    }, [page, refetchReviews]);

    const handleLoadMore = () => {
        if (reviewMetaData && reviewMetaData.currentPage < reviewMetaData.totalPages && !isLoadingMore && !isReviewsLoading) {
            setIsLoadingMore(true);
            setPage((prevPage: number) => prevPage + 1);
        }
    };

    /* ------ brand store list States and function -----*/
    const [cataloguePage, setCataloguePage] = useState(1);
    // loading states for skeletons and load more
    const [catalogueIsLoadingMore, setCatalogueIsLoadingMore] = useState(false);

    // catalogue state from redux
    const { catalogueList, catalogueMetaData } = useSelector((state: any) => state.post);

    // control: only fetch if userId is available
    const userId = selectedEntity?.item?.user?.id;

    // keep a flag to skip fetching when no userId yet
    const shouldFetchCatalogue = !!userId;

    // Fetch catalogue ONLY if userId exists
    const {
        data: catalogueData,
        refetch: refetchCatalogue,
        isLoading: isCatalogueLoading,
        isFetching: isCatalogueFetching,
    } = useGetPostListByBrandIdQuery(
        shouldFetchCatalogue
            ? {
                page: cataloguePage,
                userId: userId,
            }
            : { page: cataloguePage, userId: '' }, // will be ignored when skip is true
        {
            skip: !shouldFetchCatalogue,
        }
    );

    // Fetch only after userId is known
    useEffect(() => {
        // Reset cataloguePage to 1 when userId changes (handle id jumps)
        setCataloguePage(1);
    }, [userId]);

    // Always refetch on cataloguePage change, but only if userId exists and not first page (because first will load in initial query)
    useEffect(() => {
        if (cataloguePage > 1 && shouldFetchCatalogue) {
            refetchCatalogue();
        }
    }, [cataloguePage, shouldFetchCatalogue, refetchCatalogue]);

    // useEffect to load or append catalogueData into redux
    useEffect(() => {
        if (catalogueData && catalogueData.status === 'success') {
            if (cataloguePage === 1) {
                dispatch(setCatalogueList(catalogueData.data.posts));
            } else {
                dispatch(setCatalogueList([...(catalogueList || []), ...catalogueData.data.posts]));
            }
            dispatch(setCatalogueMetaData(catalogueData.data.meta));
            setCatalogueIsLoadingMore(false);
        }
    }, [catalogueData, cataloguePage, dispatch]); // depend on catalogueData and cataloguePage

    // Fix: only allow load more if not loading, has meta, and userId present
    const handleCatalogueLoadMore = () => {
        if (
            catalogueMetaData &&
            catalogueMetaData.currentPage < catalogueMetaData.totalPages &&
            !catalogueIsLoadingMore &&
            !isCatalogueFetching &&
            shouldFetchCatalogue
        ) {
            setCatalogueIsLoadingMore(true);
            setCataloguePage((prevPage: number) => prevPage + 1);
        }
    };

    // SKELETON for catalogue loading
    const renderCatalogueSkeleton = () => {
        // Show 4 rectangle skeleton cards
        return (
            <View style={styles.productContainer}>
                {[...Array(4)].map((_, i) => (
                    <View
                        key={i}
                        style={{
                            width: 140,
                            height: 180,
                            backgroundColor: '#ececec',
                            marginRight: 10,
                            borderRadius: 12,
                        }}
                    />
                ))}
            </View>
        );
    };

    const RenderBrandCatalogue = memo(
        ({ item }: { item: any }) => {
            return <ProductCatalogue item={item} />;
        },
        (prevProps, nextProps) => prevProps === nextProps
    );

    const renderFooter = () => {
        if (catalogueIsLoadingMore || isCatalogueFetching) {
            return (
                <View style={styles.footerLoader}>
                    <Loading />
                </View>
            );
        }
        return null;
    };

    // --- Home Feeds (Just For You) New List States and Pagination ---
    const [homeFeedPage, setHomeFeedPage] = useState(1);
    const [homeFeedLoadingMore, setHomeFeedLoadingMore] = useState(false);

    // Get userRole for just for you endpoint




    const {
        data: homeFeedData,
        isLoading: isHomeFeedLoading,
        isFetching: isHomeFeedFetching,
        refetch: refetchHomeFeed
    } = useGetHomeFeedsQuery(
        { page: homeFeedPage, request: "USER", includeReviews: "ENABLED" },

    );



    // refetch on page change, but skip first page (rtk query fetches automatically)
    useEffect(() => {
        if (homeFeedPage > 1) {
            refetchHomeFeed();
        }
    }, [homeFeedPage, refetchHomeFeed]);

    // on homeFeedData received, update list/meta in Redux
    useEffect(() => {
        if (homeFeedData && homeFeedData.status === 'success') {
            if (homeFeedPage == 1) {
                dispatch(setHomeFeedList(homeFeedData.data.posts));
            } else {
                // always append to the old list (from Redux)
                dispatch(setHomeFeedList([...(homeFeeds || []), ...homeFeedData.data.posts]));
            }
            dispatch(setHomeFeedMetaData(homeFeedData.data.meta));
            setHomeFeedLoadingMore(false);
        }
    }, [homeFeedData, homeFeedPage, dispatch]);

    // can load more only if not loading, there are more pages, and not already loading more
    const handleHomeFeedLoadMore = () => {
        if (
            homeFeedsMetaData &&
            homeFeedsMetaData.currentPage < homeFeedsMetaData.totalPages &&
            !homeFeedLoadingMore &&
            !isHomeFeedFetching
        ) {
            setHomeFeedLoadingMore(true);
            setHomeFeedPage((prevPage: number) => prevPage + 1);
        }
    };

    const renderHomeFeedFooter = () => {
        if (homeFeedLoadingMore || isHomeFeedFetching) {
            return (
                <View style={styles.footerLoader}>
                    <Loading />
                </View>
            );
        }
        return null;
    };

    // For HomeFeed list item rendering
    const RenderHomeFeedItem = memo(
        ({ item }: { item: any }) => {
            // TODO: pass the correct props to ProductCatalogue (adjust as per data)
            return <ProductCatalogue item={item} minus={3} />;
        },
        (prevProps, nextProps) => prevProps === nextProps
    );

    // Skeleton for HomeFeed while loading
    const renderHomeFeedSkeleton = () => (
        <View style={styles.productContainer}>
            {[...Array(6)].map((_, i) => (
                <View
                    key={i}
                    style={{
                        width: 140,
                        height: 180,
                        backgroundColor: '#ececec',
                        marginRight: 10,
                        borderRadius: 12
                    }}
                />
            ))}
        </View>
    );

    return (
        <>
            <ProductDetail loading={productDetailLoading}>
                <ReviewList
                    hasMore={reviewMetaData?.hasNextPage}
                    onLoadMore={handleLoadMore}
                    reviews={reviewsList}
                    loading={isReviewsLoading || isLoadingMore}
                />

                {canUserReviews && (
                    <>
                        {/* Add Review Option */}
                        <View style={styles.addReviewContainer}>
                            <CText style={styles.addReviewTitle}>Add Review</CText>
                            <CTouchableOpacity
                                style={styles.addReviewBtn}
                                onPress={() => setShowReviewInput(!showReviewInput)}
                                activeOpacity={0.7}
                            >
                                <CText style={styles.addReviewBtnText}>+ Add Review</CText>
                            </CTouchableOpacity>
                        </View>
                        {/* Add Review Input */}
                        {showReviewInput && (
                            <View style={styles.reviewInputBlock}>
                                <View style={styles.reviewStarsInputContainer}>
                                    <StarRow rating={reviewRating} setRating={setReviewRating} />
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <TextInput
                                        placeholder="Type your review here..."
                                        style={styles.reviewInput}
                                        value={review}
                                        onChangeText={setReview}
                                        multiline
                                    />
                                    <CTouchableOpacity
                                        style={[
                                            styles.submitReviewBtn,
                                            {
                                                opacity:
                                                    review.trim().length && reviewRating > 0
                                                        ? 1
                                                        : 0.6,
                                            },
                                        ]}
                                        disabled={!review.trim().length || !reviewRating}
                                        onPress={handleAddReview}
                                    >
                                        <CText style={styles.submitReviewText}>Submit</CText>
                                    </CTouchableOpacity>
                                </View>
                            </View>
                        )}
                        {/* Show reviews */}
                        {reviews.length > 0 && (
                            <View style={styles.reviewsList}>
                                {reviews.map((r, idx) => (
                                    <View key={idx} style={styles.singleReview}>
                                        <StarRow rating={r.rating} />
                                        <CText style={styles.reviewText}>{r.text}</CText>
                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                )}

                <HRLineFullWidth></HRLineFullWidth>
                <CTouchableOpacity onPress={() => {
                    console.log("seected", selectedEntity.id, "id", id);

                }}>

                    <CText style={styles.title}>More From Store</CText>
                </CTouchableOpacity>

                {/* Catalogue skeleton if loading and FIRST page */}
                {isCatalogueLoading && cataloguePage === 1 ? (
                    renderCatalogueSkeleton()
                ) : (
                    <FlatList
                        horizontal
                        data={catalogueList || []}
                        renderItem={({ item }) => (
                            <RenderBrandCatalogue item={item}></RenderBrandCatalogue>
                        )}
                        keyExtractor={(item, index) =>
                            index.toString()
                        }
                        contentContainerStyle={styles.productContainer}
                        onEndReached={handleCatalogueLoadMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={renderFooter}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    />
                )}

                {/* HR line with some margin */}
                <HRLineFullWidth></HRLineFullWidth>


                <CText style={styles.title}>Just For You</CText>
                {/* HomeFeed Skeleton */}
                {isHomeFeedLoading && homeFeedPage === 1 ? (
                    renderHomeFeedSkeleton()
                ) : (
                    <FlatList
                        data={homeFeeds || []}
                        renderItem={({ item }) => (
                            <RenderHomeFeedItem item={item} />
                        )}
                        nestedScrollEnabled
                        keyExtractor={(item, idx) => idx.toString()}
                        contentContainerStyle={styles.homeFeedContainer}
                        onEndReached={handleHomeFeedLoadMore}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={renderHomeFeedFooter}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                    />
                )}
            </ProductDetail>
        </>
    );
};

const styles = StyleSheet.create({
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    addReviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        marginTop: 24,
    },
    addReviewTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#232323',
        flex: 1,
        fontFamily: 'PoppinsSemiBold'
    },
    addReviewBtn: {
        backgroundColor: '#ff8600',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 5,
    },
    addReviewBtnText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'PoppinsSemiBold',
    },
    reviewInputBlock: {
        backgroundColor: '#faf7f3',
        padding: 10,
        marginHorizontal: 12,
        marginTop: 10,
        borderRadius: 8,
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    reviewStarsInputContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginRight: 8,
    },
    reviewInput: {
        flex: 1,
        fontSize: 14,
        backgroundColor: '#fff',
        padding: 8,
        minHeight: 38,
        maxHeight: 90,
        borderColor: '#e2e2e2',
        borderWidth: 1,
        borderRadius: 4,
        marginRight: 8,
        fontFamily: 'Poppins'
    },
    submitReviewBtn: {
        backgroundColor: '#ff8600',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitReviewText: {
        color: '#fff',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 14
    },
    reviewsList: {
        marginHorizontal: 14,
        marginTop: 12,
        marginBottom: -13,
    },
    singleReview: {
        backgroundColor: '#f6f6f6',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 7,
    },
    reviewText: {
        fontSize: 14,
        color: '#3b3b3b',
        fontFamily: 'Poppins',
    },

    productContainer: {
        flexDirection: 'row',
        // flexWrap: 'wrap',          // 👈 allows wrapping to next line
        justifyContent: 'space-between', // nice spacing between columns
    },
    homeFeedContainer: {

        backgroundColor: "#f8f8f8",
        flexDirection: 'row',
        // flexWrap: 'wrap',          // 👈 allows wrapping to next line
        justifyContent: 'space-between', // nice spacing between columns
    },
    title: {
        fontSize: 15,
        marginBottom: 10,
        marginTop: 20,
        fontFamily: 'PoppinsSemiBold',
        marginLeft: 5,
        color: '#232323'
    },

    productCard: {
    },
})
export default productDetail
