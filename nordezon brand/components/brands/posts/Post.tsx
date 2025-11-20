import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import { useDeletePostMutation } from '@/store/api/v1/post';
import { removeCatalogue, removeReel, removeStory, setSingleCatalogue } from '@/store/slices/post';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 3;
const CARD_WIDTH = (width - CARD_MARGIN * 4) / 3;

const Post = ({
  overlayButtons = false,
  hasActionButtons = false,
  hasEyes = false,
  isReel = false,
  isStory = false,
  handlePressOverLay,
  onPressPost,
  item,
  setSnackbarVisible,
  setSnackbarMessage,
  setSnackbarType,
}: {
  overlayButtons?: boolean
  hasEyes?: boolean
  isReel?: boolean
  isStory?: boolean
  hasActionButtons?: boolean
  handlePressOverLay: (param: string, item: any) => void
  onPressPost?: (item?: any) => void,
  item: any,
  setSnackbarMessage?: any,
  setSnackbarType?: any,
  setSnackbarVisible?: any,
}) => {
  const [imageHeight, setImageHeight] = useState(180);



  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false); // 👈 local loading state

  const [deletePost] = useDeletePostMutation();

  /* --- handle Delete Post ---*/
  const handlePressDelete = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this Post?\n\nThis action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true); // show loader
              const response = await deletePost(id);
              console.log("response", response);

              if (response?.data?.status === 'success') {
                let message: string;
                if (isReel) {
                  dispatch(removeReel(id))
                  message = 'Reel Delete Successfully'
                } else if (isStory) {
                  message = "Story Delete Successfully"
                  dispatch(removeStory(id))
                }
                else {
                  message = 'Post Deleted Successfully'
                  dispatch(removeCatalogue(id));
                }
                setSnackbarMessage(message);
                setSnackbarType('success');
                setSnackbarVisible(true);

              }
            } catch (error) {
              console.error('Delete failed:', error);
              setSnackbarType('error');
              setSnackbarMessage('action is failed');
              setSnackbarVisible(true);
            } finally {
              setIsDeleting(false); // hide loader
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>

      <CTouchableOpacity onPress={() => onPressPost && onPressPost(item)} style={styles.card}>
        <Image source={{ uri: item.videoThumbnail ? item.videoThumbnail : item.url }} style={[styles.image, { height: imageHeight }]} />

        {/* Overlay Buttons */}
        {isDeleting && (
          <View style={styles.overlay}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
        {
          overlayButtons && (
            <View style={styles.actionContainer}>
              {
                hasEyes && (
                  <CTouchableOpacity style={styles.iconButton} onPress={() => handlePressOverLay("EYE", item)} onLongPress={() => handlePressOverLay("EYE", item)}>
                    <Ionicons name="eye" size={16} color="#fff" />
                  </CTouchableOpacity>
                )
              }

              {
                hasActionButtons && (
                  <>
                    <CTouchableOpacity style={styles.iconButton} onPress={() => {
                      dispatch(setSingleCatalogue(item));
                      router.push({
                        pathname: '/(brand)/editPost',
                        params: {
                          type: isReel
                            ? "REEL"
                            : isStory
                              ? "STORY"
                              : "POST",
                        },
                      });

                    }}>
                      <Ionicons name="create-outline" size={16} color="#fff" />
                    </CTouchableOpacity>
                    <CTouchableOpacity style={styles.iconButton} onPress={() => {
                      handlePressDelete(item.id)
                    }}>
                      <Ionicons name="trash-outline" size={16} color="#fff" />
                    </CTouchableOpacity>
                  </>
                )
              }

            </View>
          )
        }

      </CTouchableOpacity>
    </>

  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  card: {
    width: CARD_WIDTH - 2,
    margin: CARD_MARGIN,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  iconButton: {
    padding: 4,
  },
});

export default Post;
