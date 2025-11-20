import { useDeletePostMutation } from '@/store/api/v1/post';
import { removePost, setRenderKey, setSinglePost } from '@/store/slices/post';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import CText from '../common/CText';
import CTouchableOpacity from '../common/CTouchableOpacity';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2; // 2 cards per row

const Product = ({
  overlayButtons,
  hasEyes,
  onPress,
  item,
  handlePressOverLay,
  hasItem = false,
  setSnackbarVisible,
  setSnackbarMessage,
  setSnackbarType,
}: {
  overlayButtons?: boolean
  hasEyes?: boolean
  onPress?: (param: any) => void,
  item: any,
  hasItem?: boolean,
  setSnackbarMessage?: any,
  setSnackbarType?: any,
  setSnackbarVisible?: any,
  handlePressOverLay?: any,
}) => {
  const dispatch = useDispatch();
  const [deletePost] = useDeletePostMutation();
  const [isDeleting, setIsDeleting] = useState(false); // 👈 local loading state
  /* --- handle Delete Post ---*/
  const handlePressDelete = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this Catalogue?\n\nThis action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true); // show loader
              const response = await deletePost(id);
              if (response?.data?.status === 'success') {
                dispatch(removePost(id));
                setSnackbarMessage('Catalogue Deleted Successfully');
                setSnackbarType('success');
                setSnackbarVisible(true);

              }
            } catch (error) {
              console.error('Delete failed:', error);
              setSnackbarMessage('action is failed');
              setSnackbarType('error');
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
    <View style={styles.card}>
      {/* Image with optional overlay when deleting */}
      <CTouchableOpacity onPress={() => onPress && onPress("as")} disabled={isDeleting}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: item.url }} style={styles.image} />

          {/* 👇 Overlay Loader */}
          {isDeleting && (
            <View style={styles.overlay}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <CText style={styles.title}>{item.title}</CText>

          <View style={styles.priceRow}>
            <CText style={styles.price}>
              PKR {item.discountedPrice ? item.discountedPrice : item.price}
            </CText>
            <CText style={styles.discountPrice}>
              {item.discountedPrice !== 0 &&
                item.discountedPrice &&
                item.discountedPrice < item.price &&
                `PKR ${item.price}`}
            </CText>
          </View>

          <CText style={styles.tag}>
            {item.discountedPrice && item.discountedPrice < item.price
              ? `${Math.round(
                ((item.price - item.discountedPrice) / item.price) * 100
              )}% OFF`
              : ''}
          </CText>
        </View>
      </CTouchableOpacity>

      {overlayButtons && (
        <View style={styles.actionContainer}>
          {
            hasEyes && (
              <CTouchableOpacity style={styles.iconButton} onPress={() => handlePressOverLay("EYE", item)} onLongPress={() => handlePressOverLay("EYE", item)}>
                <Ionicons name="eye" size={16} color="#fff" />
              </CTouchableOpacity>
            )
          }
          <CTouchableOpacity
            style={styles.iconButton}
            disabled={isDeleting}
            onPress={() => {
              dispatch(setRenderKey());
              dispatch(setSinglePost(item));
              router.push({
                pathname: '/(brand)/editCatalogue',
                params: { type: 'EDIT' },
              });
            }}
          >
            <Ionicons name="create-outline" size={16} color="#fff" />
          </CTouchableOpacity>

          <CTouchableOpacity
            style={styles.iconButton}
            disabled={isDeleting}
            onPress={() => handlePressDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
          </CTouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * (5 / 4),
    resizeMode: 'cover',
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  detailsContainer: {
    marginTop: 8,
  },
  title: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'PoppinsSemiBold',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 13,
    color: '#27ae60',
    fontFamily: 'PoppinsSemiBold',
  },
  discountPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  tag: {
    marginTop: 4,
    fontSize: 10,
    color: '#e74c3c',
    fontFamily: 'PoppinsMedium',
  },
  actionContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
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

export default Product;
