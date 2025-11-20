import { primaryOrange } from '@/constants/colors';
import { useUploadFileMutation } from '@/store/api/v1/files';
import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import CText from './CText';

import { isVideoFile } from '@/helpers';
import CTouchableOpacity from './CTouchableOpacity';
interface CImagePickerProps {
    value: string | null; // current image URI
    onChange: (uri: string | null) => void; // callback to update image
    setExpoThumbnail?: (uri: any) => void; // callback to update image
    setVideoThumbnail?: (uri: string | null) => void; // callback to update image
    aspect?: [number, number]; // aspect ratio, default to 16:9
    height?: number; // optional custom height
    label?: string; // optional label/title
    isPost?: boolean; // optional label/title
    isStory?: boolean; // optional label/title
    mediaTypes?: any[]; // optional label/title
    expoThumbnail?: any,
    isEdit?: boolean
}

const CImagePicker: React.FC<CImagePickerProps> = ({
    value,
    onChange,
    setVideoThumbnail,
    aspect = [16, 9],
    height = 150,
    label,
    isEdit,
    isPost,
    isStory,
    expoThumbnail,
    setExpoThumbnail,
    mediaTypes = ['images']
}) => {

    const [video, setVideo] = useState(value)
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const imageRef = useRef<any>(null);
    const [hasChanged, setHasChanged] = useState(true)
    useEffect(() => {
        if (value) {
            setVideo(value);
        }
    }, [value]);

    /* --- upload file to the server ---*/
    const [uploadFile] = useUploadFileMutation();


    const player = useVideoPlayer(video, player => {
        player.loop = false;
        player.pause();
    });
    
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow access to your gallery.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes,
            allowsEditing: true,
            aspect,
            quality: 0.8,
        });

        if (!result.canceled) {
            setIsUploading(true);
            setUploadProgress(0);
            try {
                const uri = result.assets[0].uri;
                const asset = result.assets[0];

                const fileName = uri.split("/").pop() || "image.jpg";
                // const fileType = fileName.split(".").pop();
                const fileType = asset.type === "video"
                    ? `video/${fileName.split(".").pop()}`
                    : `image/${fileName.split(".").pop()}`;

                console.log("fired Type", fileType, "asset", asset);
                // type === 'logo' ? setLogo(uri) : setBanner(uri);
                const formData = new FormData();
                formData.append("files", {
                    uri,
                    name: fileName,
                    type: fileType,
                } as any);


                // Set video loading state for non-post videos
                // if (!isPost) {
                // setIsVideoLoading(true);
                // setExpoThumbnail && setExpoThumbnail("")
                // }

                if ((isStory || !isPost) && asset.type === "video") {
                    setIsVideoLoading(true);
                    setExpoThumbnail && setExpoThumbnail("")
                    let duration: any = result.assets[0].duration; // in seconds
                    if (duration > 3600) {
                        duration = duration / 1000;
                    }
                    console.log("duration (seconds)", duration);

                    if (duration && duration > 50) {
                        Alert.alert('Video too long', 'Please select a video shorter than 50 seconds.');
                        setVideo("")
                        onChange(null);
                        return;
                    }
                }

                // Simulate progress tracking (since RTK Query doesn't provide built-in progress tracking)
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return 90; // Stop at 90% until actual upload completes
                        }
                        return prev + Math.random() * 3; // Increment by random amount
                    });
                }, 200);

                const response: any = await uploadFile(formData).unwrap();

                // Clear the interval and set to 100% when upload completes
                clearInterval(progressInterval);
                setUploadProgress(100);

                const { data } = response;
                onChange(data[0]);
                setHasChanged(true)


                setVideo(data[0]);
            } catch (error) {
                console.error("Upload failed:", error);
                Alert.alert('Upload failed', 'Please try again.');
                setUploadProgress(0);
            } finally {
                setIsUploading(false);
                // Reset progress after a short delay
                setTimeout(() => setUploadProgress(0), 1000);
            }
        }
    };

    useEffect(() => {
        if (video) {
            // Recreate player when video changes
            player.replaceAsync(video);
        } else {
            player.pause();
        }
    }, [video]);

    const removeImage = () => {
        onChange(null);
        setVideo("");
        setIsVideoLoading(false);
        setUploadProgress(0);
        player.pause();
    };

    const { status } = useEvent(player, 'statusChange', { status: player.status });

    useEffect(() => {
        if (!isPost && status == 'readyToPlay') {
            // Keep loading state true during expoThumbnail generation
            const generateThumbnail = async () => {
                try {
                    const thumbnails = await player.generateThumbnailsAsync([1]);
                    console.log("thumbnails", thumbnails);

                    if (thumbnails.length > 0) {
                        const thumbnailUri = thumbnails[0]
                        setExpoThumbnail && setExpoThumbnail(thumbnailUri)
                        // Wait for expoThumbnail upload to complete before stopping loading

                        setTimeout(() => {
                            handlePress()

                        }, 500);
                    }
                } catch (e) {
                    console.log("Thumbnail generation failed:", e);
                } finally {
                    // Only set loading to false after both expoThumbnail generation and upload are complete
                    setIsVideoLoading(false);
                }
            };
            generateThumbnail();
        }
    }, [status]);


    const handlePress = async () => {
        try {
            console.log("isEdit", isEdit, "hasChanged", hasChanged);

            if (isEdit && !hasChanged) return;
            const uri = await captureRef(imageRef, {
                format: 'png',
                quality: 1,
            });
            console.log("uri", uri);


            const fileName = uri.split("/").pop() || "file.jpg";
            const fileExt = fileName.split(".").pop()?.toLowerCase();

            let fileType = "application/octet-stream"; // default fallback

            if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt!)) {
                fileType = `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;
            } else if (["mp4", "mov", "avi", "mkv"].includes(fileExt!)) {
                fileType = `video/${fileExt}`;
            } else if (["pdf"].includes(fileExt!)) {
                fileType = "application/pdf";
            }

            const formData = new FormData();
            formData.append("files", {
                uri,
                name: fileName,
                type: fileType,
            } as any);
            // Step 3: Upload using your existing API
            const response: any = await uploadFile(formData).unwrap();

            console.log("Upload Response:", response);

            // Set the uploaded expoThumbnail URI if setVideoThumbnail callback is provided
            if (setVideoThumbnail && response?.data?.[0]) {
                setVideoThumbnail(response.data[0]);
            }
        } catch (error) {
            console.log("Uplaoding Thumnail is failed", error);

        }
    }


    return (
        <View style={styles.container}>
            <CTouchableOpacity
                style={[styles.box, { height }]}
                onPress={pickImage}
                disabled={isUploading}
            >
           
                {isUploading || isVideoLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={primaryOrange} />
                        <CText style={styles.loadingText}>
                            {
                                isUploading ? (
                                    <>
                                        Uploading... {Math.round(uploadProgress)}%
                                    </>
                                ) : (
                                    <>
                                        Loading Video...
                                    </>
                                )
                            }
                        </CText>
                        <View style={styles.progressBarContainer}>
                            <View
                                style={[
                                    styles.progressBar,
                                    { width: `${uploadProgress}%` }
                                ]}
                            />
                        </View>
                    </View>
                ) : value ? (
                    // 🔸 For Story Mode
                    isStory ? (
                        isVideoFile(value) ? ( // check if the story is a video
                            <View style={styles.videoContainer}>
                                {expoThumbnail && (
                                    <ExpoImage ref={imageRef} source={expoThumbnail} style={{ width: 200, height: 330, position: 'absolute', top: -1000 }} contentFit="cover" />)}
                                {/* Actual video */}
                                <VideoView
                                    nativeControls={false}
                                    style={styles.video}
                                    player={player}
                                />

                                {/* Controls */}
                                <CTouchableOpacity
                                    style={styles.playPauseButton}
                                    onPress={() => {
                                        if (status === 'idle') player.replay();
                                        else if (isPlaying) player.pause();
                                        else player.play();
                                    }}
                                >
                                    <Ionicons
                                        name={status === 'idle' ? "reload-circle" : isPlaying ? "pause-circle" : "play-circle"}
                                        size={40}
                                        color="white"
                                    />
                                </CTouchableOpacity>
                            </View>
                        ) : (
                            // 🔹 It's an image story
                            <Image source={{ uri: value }} style={styles.image} />
                        )
                    ) : (
                        // 🔸 Non-story (normal post or reel)
                        !isPost ? (
                            <View style={styles.videoContainer}>
                                {expoThumbnail && (
                                    <ExpoImage ref={imageRef} source={expoThumbnail} style={{ width: 200, height: 330, position: 'absolute', top: -1000 }} contentFit="cover" />)}
                                {/* Actual video */}
                                <VideoView
                                    nativeControls={false}
                                    style={styles.video}
                                    player={player}
                                />

                                {/* Controls */}
                                <CTouchableOpacity
                                    style={styles.playPauseButton}
                                    onPress={() => {
                                        if (status === 'idle') player.replay();
                                        else if (isPlaying) player.pause();
                                        else player.play();
                                    }}
                                >
                                    <Ionicons
                                        name={status === 'idle' ? "reload-circle" : isPlaying ? "pause-circle" : "play-circle"}
                                        size={40}
                                        color="white"
                                    />
                                </CTouchableOpacity>
                            </View>
                        ) : (
                            <>

                                <Image source={{ uri: value }} style={styles.image} />
                            </>
                        )
                    )
                ) : (
                    <>
                        <Ionicons name="image-outline" size={40} color="#aaa" />
                        {label && <CText style={styles.placeholderText}>{label}</CText>}
                    </>
                )}

                {value && !isUploading && (
                    <CTouchableOpacity style={styles.removeButton} onPress={removeImage}>
                        <Ionicons name="close-circle" size={22} color="#fff" />
                    </CTouchableOpacity>
                )}
            </CTouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoLoadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 500,
        height: 275,
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
        color: primaryOrange,
        textAlign: 'center',
    },
    expoThumbnail: {
        width: 200,
        height: 320,
    },
    playPauseButton: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 2,
        borderRadius: 50,
    },
    skipButton: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 2,
        borderRadius: 50,
    },

    videoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,

    },
    controlsContainer: {
        padding: 10,
    },
    video: {
        width: 500,
        height: 275,
    },
    box: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#fafafa',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: primaryOrange,
        borderRadius: 20,
        padding: 2,
    },
    placeholderText: {
        marginTop: 8,
        fontSize: 13,
        color: '#999',
        textAlign: "center"
    },
    labelBelow: {
        marginTop: 8,
        fontSize: 14,
        color: '#444',
        fontFamily: 'PoppinsMedium',
        textAlign: 'center',
    },
    progressBarContainer: {
        width: '80%',
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginTop: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: primaryOrange,
        borderRadius: 4,
    },
});

export default CImagePicker;
