import CommentsBottomSheet from '@/components/common/CommentsBottomSheet';
import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import Description from '@/components/common/Description';
import { primaryOrange } from '@/constants/colors';
import { formatDate } from '@/helpers';
import { useLikePostMutation } from '@/store/api/v1/likes';
import { setLikePost } from '@/store/slices/post';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface PostViewPopUpProps {
  visible: boolean;
  onClose: () => void;
  post: any,
  brand: any,
  _count: {
    likes: number,
    comments: number
  }
}

const PostViewPopUp: React.FC<PostViewPopUpProps> = ({ visible, onClose, post, brand, _count }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [likePost] = useLikePostMutation();
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const dispatch = useDispatch();

  const { postLikesComments } = useSelector((state: any) => state.post)

  const currentPostLikesComments = postLikesComments.find(
    (p: any) => p.postId === post.id
  );


  const handlePressLike = () => {
    const newIsLiked = !currentPostLikesComments?.isLiked;

    // Update local state
    dispatch(setLikePost({
      postId: post.id,
      isLiked: newIsLiked,
    }));

    // Call API with string status
    likePost({
      postId: post.id,
      isLiked: newIsLiked ? "LIKED" : "UNLIKED",
    }).unwrap();
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View
        style={[
          styles.overlay,
          { opacity: opacityAnim },
        ]}
      >
        <Animated.View
          style={[
            styles.popup,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandInfo}>
              <Image source={{ uri: brand.logo }} style={styles.brandLogo} />
              <View>
                <View style={styles.titleRow}>
                  <CText style={styles.brandName}>{brand.name}</CText>
                  {brand.verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={primaryOrange}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
                <CText style={styles.time}>{formatDate(post.createdAt)}</CText>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Image */}
          <Image
            source={{
              uri: post.url
            }}
            resizeMode='contain'
            style={styles.image}
          />

          {/* Description */}
          {/* <CText style={styles.description}>{post.description}</CText> */}
          <Description text={post.title} />

          {/* Likes and Comments */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <CTouchableOpacity onPress={handlePressLike}>
                <Ionicons
                  name={currentPostLikesComments?.isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={currentPostLikesComments?.isLiked ? "#ff3040" : "#000"}
                />
              </CTouchableOpacity>
              <Text style={styles.statText}>{currentPostLikesComments?.likesCount || 0}</Text>
            </View>
            <CTouchableOpacity onPress={() => {
              setShowComments(true)
            }} style={styles.stat}>
              <Ionicons name="chatbubble-outline" size={20} color="#555" />
              <Text style={styles.statText}>{currentPostLikesComments?.commentsCount}</Text>
            </CTouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>

      {
        showComments && (
          <CommentsBottomSheet
            post={post}
            visible={showComments}
            onClose={() => setShowComments(false)}
          />
        )
      }
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(178, 250, 254, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: primaryOrange,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  time: {
    fontSize: 12,
    color: '#777',
  },
  image: {
    width: '100%',
    height: 390,
    borderRadius: 10,
    marginBottom: 10,

  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 5,
    color: '#333',
    fontSize: 14,
  },
});

export default PostViewPopUp;
