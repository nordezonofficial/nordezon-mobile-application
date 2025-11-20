import { primaryOrange } from '@/constants/colors';
import { formatDate } from '@/helpers';
import { useAddCommentMutation, useGetCommentsListByPostQuery, useReplyToCommentMutation } from '@/store/api/v1/comments';
import { setCommentList, setCommentMetaData, setNewComment, setNewReplies } from '@/store/slices/post';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import CText from '../components/common/CText';
import CTouchableOpacity from '../components/common/CTouchableOpacity';
import Description from '../components/common/Description';
import KeyboardAvoiding from '../components/common/KeyboardAvoiding';

const { height, width } = Dimensions.get('window');

interface Reply {
    id: string;
    user: string;
    text: string;
    time: string;
}

interface Comment {
    id: string;
    user: string;
    text: string;
    time: string;
    replies?: Reply[];
}

interface CommentsBottomSheetProps {
    post: any;
    visible: boolean;
    onClose: () => void;
    onAddComment?: (text: string) => void;
    onAddReply?: (commentId: string, text: string) => void;
}

export default function CommentsBottomSheet({ visible, onClose, onAddComment, onAddReply, post }: CommentsBottomSheetProps) {
    const [commentText, setCommentText] = React.useState('');
    const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
    const [replyText, setReplyText] = React.useState('');
    const [addComment] = useAddCommentMutation();
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [replyingToName, setReplyingToName] = useState<string | null>(null)
    /* -- reply to comment -- */
    const [replyToComment] = useReplyToCommentMutation()
    const { user } = useSelector((state: any) => state.user)
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);




    const {
        commentsList,
        commentsMetaData
    } = useSelector((state: any) => state.post)
    const { data, refetch } = useGetCommentsListByPostQuery({
        page: page,
        postId: post.id
    });

    useEffect(() => {
        refetch()
    }, [])



    const dispatch = useDispatch();



    useEffect(() => {
        if (data && data.status == 'success') {
            if (page === 1) {
                /* --- First page - replace the list --- */
                dispatch(setCommentList(data.data.comments))
            } else {
                /* ---  Subsequent pages - append to existing list t --- */
                dispatch(setCommentList([...commentsList, ...data.data.comments]))
            }
            dispatch(setCommentMetaData(data.data.meta))
            setIsLoadingMore(false);
        }

    }, [data])


    const handleAddComment = async () => {
        console.log("FIRED");

        if (!commentText.trim()) return;

        let payload = {
            postId: post.id,
            commentText: commentText.trim()
        }
        setCommentText('');
        let newComment = {
            user: user,
            userId: user.id,
            commentText: commentText,
            commentId: Math.floor(Math.random() * 1000000000),  // random number ID
            createdAt: new Date().toISOString(),     // current time ISO
            updatedAt: new Date().toISOString(),     // same as createdAt initially
        };

        dispatch(setNewComment(newComment))

        let response = await addComment(payload);


    };

    const handleAddReply = async () => {
        if (!replyText.trim()) return;
        let payload = {
            postId: post.id,
            parentCommentId: replyingTo,
            commentText: replyText.trim(),
        }
        let response = await replyToComment(payload);
        console.log("response", response.data.data);

        dispatch(setNewReplies(response.data.data))
        setReplyText('');
        setReplyingToName('');
        setReplyingTo(null);
    };

    const handleReply = (commentId: string, userName: string) => {
        setReplyingTo(commentId);
        // setReplyText(`@${userName}:`);
        setReplyingToName(`@${userName}:`)
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    const [isFirstTime, setFirstTime] = useState(true)
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);






    const responsiveTop = height * 0.012;
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const toggleReplies = (commentId: string) => {
        setExpandedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };


    const handleLoadMore = () => {
        if (commentsMetaData && commentsMetaData.page < commentsMetaData.totalPages && !isLoadingMore) {
            setIsLoadingMore(true);
            setPage(prevPage => prevPage + 1);
        }
    };

    const bottomSheetRef = useRef<BottomSheet>(null);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);



    return (
        <>
            <BottomSheet
                snapPoints={[400, 500]}
                style={styles.contentContainer}
                ref={bottomSheetRef}
                // onChange={handleSheetChanges}
                enableContentPanningGesture
                enableHandlePanningGesture
                index={1} // start fully open
                onChange={(index) => {
                    if (index === 0) {
                        // sheet was closed
                        console.log("Sheet closed");
                        onClose
                    }
                }}
            >
                <BottomSheetView >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Comments</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Reply Banner */}
                    {replyingTo && (
                        <Animated.View
                            entering={FadeIn.duration(200)}
                            exiting={FadeOut.duration(200)}
                            style={styles.replyBanner}
                        >
                            <View style={styles.replyBannerContent}>
                                <Ionicons name="return-down-forward" size={16} color={primaryOrange} />
                                <Text style={styles.replyBannerText}>
                                    Replying to {commentsList.find((c: any) => c.id === replyingTo)?.user.fullName}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={cancelReply} style={styles.cancelReplyButton}>
                                <Ionicons name="close" size={16} color="#666" />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    <KeyboardAvoiding>
                        <BottomSheetFlatList
                            data={commentsList || []}
                            keyExtractor={(item: any, index: number) => index.toString()}
                            renderItem={({ item, index }: any) => (
                                <Animated.View entering={FadeIn.delay(index * 50)} exiting={FadeOut}>
                                    <Animated.View entering={FadeIn.delay(index * 50)} exiting={FadeOut}>
                                        {/* Main Comment */}
                                        <View style={styles.commentItem}>
                                            <View style={styles.commentAvatar}>
                                                {item?.user?.role === "BRAND"
                                                    ? item.user.logoUrl
                                                        ? (
                                                            <Image
                                                                source={{ uri: item.user.logoUrl }}
                                                                style={styles.logo}
                                                            />
                                                        )
                                                        : (
                                                            <Ionicons name="person-circle" size={40} color="#ddd" />
                                                        )
                                                    : item.user.profile
                                                        ? (
                                                            <Image
                                                                source={{ uri: item.user.profile }}
                                                                style={styles.logo}
                                                            />
                                                        )
                                                        : (
                                                            <Ionicons name="person-circle" size={40} color="#ddd" />
                                                        )
                                                }
                                            </View>

                                            <View style={styles.commentContent}>
                                                <CText style={styles.commentUser}>

                                                    {item.user.role == "BRAND" ? item.user.brandName : item.user.fullName}
                                                </CText>
                                                <Description
                                                    style={{ marginTop: -5, marginBottom: 5 }}
                                                    text={item.commentText}
                                                />
                                                <View style={styles.commentActions}>
                                                    <CText style={styles.commentTime}>
                                                        {formatDate(item.createdAt)}
                                                    </CText>
                                                    <CTouchableOpacity
                                                        onPress={() => handleReply(item.id, item.user.fullName)}
                                                        style={styles.replyActionButton}
                                                    >
                                                        <CText style={styles.replyActionText}>Reply</CText>
                                                    </CTouchableOpacity>
                                                </View>
                                            </View>

                                            {/* <TouchableOpacity style={styles.likeButton}>
            <Ionicons name="heart-outline" size={20} color="#666" />
        </TouchableOpacity> */}


                                        </View>

                                        {/* Replies */}
                                        {/* Show "See Replies" only if there are replies */}
                                        {item.replies && item.replies.length > 0 && (
                                            <CTouchableOpacity onPress={() => toggleReplies(item.id)} style={{ marginVertical: 5, marginHorizontal: 70, }}>
                                                <CText style={{ fontSize: 12, color: primaryOrange }}>
                                                    {expandedComments.has(item.id) ? 'Hide Replies' : `See Replies (${item.replies.length})`}
                                                </CText>
                                            </CTouchableOpacity>
                                        )}

                                        {expandedComments.has(item.id) && item.replies && item.replies.length > 0 && (
                                            <View style={styles.repliesContainer}>
                                                {item.replies.map((reply: any, replyIndex: number) => (
                                                    <Animated.View
                                                        key={reply.id}
                                                        entering={FadeIn.delay((index * 50) + (replyIndex * 25))}
                                                        exiting={FadeOut}
                                                        style={styles.replyItem}
                                                    >
                                                        <View style={styles.replyLine} />
                                                        <View style={styles.replyAvatar}>
                                                            {item?.user?.role === "BRAND"
                                                                ? item.user.logoUrl
                                                                    ? (
                                                                        <Image
                                                                            source={{ uri: item.user.logoUrl }}
                                                                            style={[styles.logo, {
                                                                                width: 30,
                                                                                height: 30,
                                                                                borderWidth: 0.5,
                                                                            }]}
                                                                        />
                                                                    )
                                                                    : (
                                                                        <Ionicons name="person-circle" size={30} color="#ddd" />
                                                                    )
                                                                : item.user.profile
                                                                    ? (
                                                                        <Image
                                                                            source={{ uri: item.user.profile }}
                                                                            style={styles.logo}
                                                                        />
                                                                    )
                                                                    : (
                                                                        <Ionicons name="person-circle" size={40} color="#ddd" />
                                                                    )
                                                            }
                                                        </View>
                                                        <View style={styles.replyContent}>
                                                            <CText style={styles.replyUser}>
                                                                {reply.user.role == "BRAND" ? reply.user.brandName : reply.user.fullName}
                                                            </CText>
                                                            <Description
                                                                style={{ marginTop: -5, marginBottom: 5 }}
                                                                text={reply.commentText}
                                                            />
                                                            <CText style={styles.replyTime}>
                                                                {formatDate(reply.createdAt)}
                                                            </CText>

                                                            {/* <View style={styles.commentActions}>
                            <CText style={styles.commentTime}>
                                {formatDate(reply.createdAt)}
                            </CText>
                            <CTouchableOpacity
                                onPress={() => handleReply(reply.id, reply.user.fullName)}
                                style={styles.replyActionButton}
                            >
                                <CText style={styles.replyActionText}>Reply</CText>
                            </CTouchableOpacity>
                        </View> */}
                                                        </View>
                                                        {/* <TouchableOpacity style={styles.replyLikeButton}>
                        <Ionicons name="heart-outline" size={16} color="#666" />
                    </TouchableOpacity> */}
                                                    </Animated.View>
                                                ))}
                                            </View>
                                        )}
                                    </Animated.View>
                                </Animated.View>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <Ionicons name="chatbubble-outline" size={60} color="#ddd" />
                                    <Text style={styles.emptyText}>No comments yet</Text>
                                    <Text style={styles.emptySubtext}>Be the first to comment!</Text>
                                </View>
                            }
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={isLoadingMore ? <Text style={{ textAlign: 'center', padding: 10 }}>Loading...</Text> : null}
                            showsVerticalScrollIndicator={false}
                        />
                    </KeyboardAvoiding>


                    {/* Input Container */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={replyingTo ? "Add a reply..." : "Add a comment..."}
                            placeholderTextColor="#999"
                            multiline
                            value={replyingTo ? `@${commentsList.find((c: any) => c.id === replyingTo)?.user.fullName}: ${replyText}` : commentText}
                            onChangeText={(text) => {
                                if (replyingTo) {
                                    const usernamePrefix = `@${commentsList.find((c: any) => c.id === replyingTo)?.user.fullName}: `;

                                    // If user tries to delete prefix, cancel replying
                                    if (!text.startsWith(usernamePrefix)) {
                                        setReplyingTo(null);
                                        setReplyText('');
                                    } else {
                                        // Only keep text after prefix
                                        setReplyText(text.slice(usernamePrefix.length));
                                    }
                                } else {
                                    setCommentText(text);
                                }
                            }}
                        />


                        <CTouchableOpacity
                            onPress={replyingTo ? handleAddReply : handleAddComment}
                            style={[styles.sendButton, { backgroundColor: primaryOrange }]}
                        >
                            <Ionicons name="send" size={24} color="#fff" />
                        </CTouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheet>

        </>
    )


}

const styles = StyleSheet.create({
    contentContainer: {
    },
    backdrop: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdropTouchable: {
        flex: 1,
    },
    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: height * 0.8,
        minHeight: height * 0.7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        flex: 0,
    },
    handleContainer: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    commentsContainer: {
        flex: 1,
        paddingVertical: 8,
    },
    commentItem: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    commentAvatar: {
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    commentTime: {
        fontSize: 12,
        color: '#999',
    },
    likeButton: {
        padding: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,   // Increased from 8
        fontSize: 14,
        maxHeight: 100,
        marginRight: 12,       // Increased from 8
    },
    sendButton: {
        padding: 12,           // Increased from 8
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 50,
    },
    replyBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    replyBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    replyBannerText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    cancelReplyButton: {
        padding: 8,
    },
    repliesContainer: {
        marginLeft: 50, // Indent for replies
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    replyItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    replyLine: {
        position: 'absolute',
        left: -10, // Adjust as needed for indentation
        top: 10,
        bottom: 0,
        width: 2,
        backgroundColor: '#ddd',
    },
    replyAvatar: {
        marginRight: 12,
    },
    replyContent: {
        flex: 1,
    },
    replyUser: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    replyText: {
        fontSize: 13,
        color: '#333',
        marginBottom: 2,
    },
    replyTime: {
        fontSize: 11,
        color: '#999',
    },
    replyLikeButton: {
        padding: 4,
    },
    commentActions: {
        flexDirection: 'row',
        marginTop: 8,
    },
    replyActionButton: {
        marginLeft: 10,
    },
    replyActionText: {
        fontSize: 12,
        color: primaryOrange,
        textDecorationLine: 'underline',
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 50,
        borderColor: primaryOrange,
        borderWidth: 1.5,
    }
});

