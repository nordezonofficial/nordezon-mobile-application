import CText from '@/components/common/CText'
import { primaryOrange } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import React, { memo } from 'react'
import {
    FlatList,
    Image,
    StyleSheet,
    View
} from 'react-native'

/**
 * Skeleton loader for review card during loading state or pagination
 */
const SkeletonReviewCard = () => (
    <View style={[styles.reviewCard, { minWidth: 220, marginRight: 12 }]}>
        <View style={[styles.skeletonAvatar, { marginRight: 8 }]} />
        <View style={{ flex: 1 }}>
            <View style={styles.skeletonLineShort} />
            <View style={styles.skeletonLine} />
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <View style={styles.skeletonStar} />
            <View style={styles.skeletonRatingValue} />
        </View>
    </View>
);

/**
 * Memoized item using custom compare for best performance
 */
const ReviewItem = memo(({ item }: { item: any }) => {
    return (
        <View style={[styles.reviewCard, { minWidth: 220, marginRight: 12 }]}>
            <Image source={{ uri: item?.user?.profile }} style={[styles.brandLogo, { marginRight: 8 }]} />
            <View>
                <CText style={{ fontWeight: 'bold', fontSize: 13 }}>{item?.user?.fullName}</CText>
                <CText style={{ color: "#222", fontSize: 13 }}>{item?.message}</CText>
            </View>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <Ionicons name="star" color="#FFD700" size={16} />
                <CText style={{ color: "#222", fontWeight: "700", fontSize: 12 }}>{item?.ratingValue}</CText>
            </View>
        </View>
    );
},
    (prevProps, nextProps) => {
        // Compare shallowly all fields; consider deep equal if data is complex
        return (
            prevProps.item.user === nextProps.item.user &&
            prevProps.item.message === nextProps.item.message &&
            prevProps.item.ratingValue === nextProps.item.ratingValue &&
            prevProps.item.user?.url === nextProps.item.user?.url
        );
    }
);

/**
 * ReviewList props:
 * @param {Array} reviews      - List of review items
 * @param {Boolean} loading    - Loading state for the reviews
 * @param {Boolean} hasMore    - Whether more pages of reviews are available
 * @param {Function} onLoadMore - Function to load more reviews (parent receives this)
 */
const ReviewList = ({
    reviews = [],
    loading = false,
    hasMore = false,
    onLoadMore = () => { },
}: {
    reviews?: any[],
    loading?: boolean,
    hasMore?: boolean,
    onLoadMore?: () => void,
}) => {
    // Handler to be called when FlatList reaches the end
    const handleEndReached = () => {
        if (!loading && hasMore) {
            onLoadMore();
        }
    };

    // Render skeleton cards when loading (initial page or paginate)
    const skeletonCount = 2;

    // Loading indicator to show at the end of the FlatList (pagination)
    const renderFooter = () => {
        // Show the skeleton loader only on END REACHED or paginated loading
        if (!loading || reviews.length == 0) return null;
        // Show 2 skeletons as pagination placeholder
        return (
            <View style={{ flexDirection: 'row' }}>
                {Array.from({ length: skeletonCount }).map((_, idx) => (
                    <SkeletonReviewCard key={idx} />
                ))}
            </View>
        );
    };

    // Empty state: show skeletons on first load, or message if not loading
    const renderEmpty = () => {
        if (loading) {
            return (
                <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
                    {Array.from({ length: skeletonCount }).map((_, idx) => (
                        <SkeletonReviewCard key={idx} />
                    ))}
                </View>
            )
        }
        return (
            <View style={styles.emptyContainer}>
                <CText style={{ color: "#aaa", fontSize: 13 }}>No reviews yet.</CText>
            </View>
        );
    };

    return (
        <FlatList
            data={reviews}
            horizontal
            keyExtractor={(_, idx) => idx.toString()}
            contentContainerStyle={{ paddingVertical: 2, paddingRight: 12 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <ReviewItem item={item} />}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2}
        />
    );
};

export default ReviewList;

const styles = StyleSheet.create({
    brandLogo: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: primaryOrange
    },
    reviewCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
        padding: 10,
        marginBottom: 9,
    },
    footerLoaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        minWidth: 90,
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    // skeleton loading UI
    skeletonAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#ececec",
        borderWidth: 1,
        borderColor: "#eee"
    },
    skeletonLineShort: {
        width: 80,
        height: 12,
        backgroundColor: "#e5e5e5",
        borderRadius: 4,
        marginBottom: 7,
        marginTop: 3,
    },
    skeletonLine: {
        width: 120,
        height: 11,
        backgroundColor: "#ededed",
        borderRadius: 4,
    },
    skeletonStar: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#e8e8e8",
        marginRight: 6,
    },
    skeletonRatingValue: {
        width: 30,
        height: 11,
        backgroundColor: "#e1e1e1",
        borderRadius: 4,
        marginTop: 2,
    },
})