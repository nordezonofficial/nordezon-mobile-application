import CSnackbar from '@/components/common/CSnackbar';
import CText from '@/components/common/CText';
import CTextField from '@/components/common/CTextField';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import CImagePicker from '@/components/common/ImagePicker';
import { primaryOrange } from '@/constants/colors';
import { useCreatePostMutation, useUpdatePostMutation } from '@/store/api/v1/post';
import { setCatalogue, setReel, setStory } from '@/store/slices/post';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const POST_SIZE = width * 0.9;

type PostType = 'POST' | 'REEL' | 'STORY';

const PostForm = ({
    isEdit = false,
}: {
    isEdit?: boolean
}) => {
    const { type } = useLocalSearchParams<{ type?: PostType }>();
    const postType: PostType =
        type === 'REEL' ? 'REEL' :
            type === 'STORY' ? 'STORY' :
                'POST';
    const [createPost, { isLoading, isError }] = useCreatePostMutation()
    const [updatePost] = useUpdatePostMutation()
    const [loading, setLoading] = useState(false)
    const [url, setThumbnail] = useState<string | null>(null);
    const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
    const [expoThumbnail, setExpoThumbnail] = useState<any>(null);

    const [title, setTitle] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');
    const { catalogue } = useSelector((state: any) => state.post)

    const dispatch = useDispatch()
    /* -- navigation --*/
    const navigation = useRouter();


    const handleSubmit = async () => {
        try {
            if (!url) {
                Alert.alert('Validation', `Please select a ${postType === 'REEL' ? 'video' : 'images'} thumbnail.`);
                return;
            }
            if (!title) {
                Alert.alert('Validation', 'Please enter a title.');
                return;
            }
            setLoading(true)

            // Prepare payload
            let payload: any = {
                title,
                url,
                videoThumbnail: videoThumbnail,
                isPost: postType == 'POST',
                isReel: postType == 'REEL',
                isStory: postType == 'STORY',
                isProduct: false,
            };


            let response: any;
            if (!isEdit) {
                response = await createPost(payload);

            } else {
                payload.id = catalogue.id;
                response = await updatePost(payload);

            }
            setLoading(false)

            if (response?.data?.status == 'success') {
                if (postType == 'POST') {
                    dispatch(setCatalogue(response.data.data))

                } else if (postType == 'REEL') {
                    console.log("FIRED", response.data.data);

                    dispatch(setReel(response.data.data))
                } else {
                    dispatch(setStory(response.data.data))
                }
                setSnackbarMessage(
                    postType === 'POST'
                        ? `Post ${isEdit ? 'updated' : 'created'} successfully!`
                        : postType === 'REEL'
                            ? `Reel ${isEdit ? 'updated' : 'created'} successfully!`
                            : `Story ${isEdit ? 'updated' : 'created'} successfully!`
                );
                setSnackbarType('success');
                setSnackbarVisible(true);
                setTimeout(() => {
                    if (postType == 'POST') {
                        navigation.push('/(brand)/posts');

                    } else if (postType == 'REEL') {
                        navigation.push('/(brand)/reels')
                    } else {
                        navigation.push('/(brand)/stories')
                    }
                }, 1000);
            }
        } catch (error) {
            console.log(error);
            setSnackbarType('error');
            setSnackbarMessage('action is failed');
            setSnackbarVisible(true);

            setLoading(false)

        }
    };


    // Initialize form fields from post when editing
    useEffect(() => {
        if (isEdit && catalogue && Object.keys(catalogue).length > 0) {
            setThumbnail(catalogue.url || null);
            setTitle(catalogue.title || "");
        }
    }, [isEdit, catalogue]);

    useFocusEffect(
        useCallback(() => {
            setLoading(false);
            console.log("isEdit", isEdit);

            if (isEdit) return;
            setThumbnail("")
            setVideoThumbnail("")
            setTitle("")
            setSnackbarVisible(false);
            setSnackbarMessage('');
            setSnackbarType('info');
        }, [])
    );

    return (
        <>
            <CSnackbar
                visible={snackbarVisible}
                message={snackbarMessage}
                onClose={() => setSnackbarVisible(false)}
                type={snackbarType}
            />
            <View style={styles.container}>
                {/* Thumbnail Picker */}
                <CImagePicker
                    expoThumbnail={expoThumbnail}
                    setExpoThumbnail={setExpoThumbnail}
                    isPost={postType == "POST"}
                    isStory={postType == "STORY"}
                    label={
                        postType === 'REEL'
                            ? 'Select a Reel video (9:16 recommended)'
                            : postType === 'STORY'
                                ? 'Select a Story image or video (9:16 recommended)'
                                : 'Select a Post image (6:8 ratio recommended)'
                    }

                    isEdit={isEdit}
                    value={url}
                    onChange={setThumbnail}
                    setVideoThumbnail={setVideoThumbnail}
                    aspect={
                        postType === 'REEL'
                            ? [9, 16]
                            : postType === 'STORY'
                                ? [6, 8] // stories also use vertical aspect ratio
                                : [6, 8]
                    }

                    mediaTypes={
                        postType === 'REEL'
                            ? ['videos']
                            : postType === 'STORY'
                                ? ['images', 'videos'] // allow both for story
                                : ['images']
                    }
                    height={POST_SIZE}
                />

                {/* Title Field */}
                <CTextField
                    label="Title"
                    placeholder={
                        postType === "POST"
                            ? "Enter post title"
                            : postType === "REEL"
                                ? "Enter reel title"
                                : "Enter story title"
                    }
                    value={title}
                    onChangeText={setTitle}
                    icon="pricetag-outline"
                />

                {/* Submit Button */}
                <CTouchableOpacity disabled={loading} style={styles.button} onPress={handleSubmit}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Ionicons
                                name={isEdit ? "create-outline" : "add-circle-outline"}
                                size={20}
                                color="#fff"
                            />
                            <CText style={styles.buttonText}>
                                {isEdit ? 'Update' : 'Create'} {postType}</CText>
                        </>
                    )}
                </CTouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: primaryOrange,
        borderRadius: 10,
        paddingVertical: 12,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'PoppinsMedium',
        fontSize: 16,
        marginLeft: 6,
    },
});

export default PostForm;
