import CText from '@/components/common/CText';
import CTouchableOpacity from '@/components/common/CTouchableOpacity';
import { primaryOrange } from '@/constants/colors';
import { statuses } from '@/constants/common';
import { useUpdateOrderStatusMutation } from '@/store/api/v1/orders';
import { setOrderStatus } from '@/store/slices/orders';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface OrderEditModalProps {
  visible: boolean;
  onClose: () => void;
  setSnackbarVisible: (visible: boolean) => void;
  setSnackbarMessage: (msg: string) => void;
  setSnackbarType: (type: 'success' | 'error' | 'info') => void;
}

const OrderEditModal: React.FC<OrderEditModalProps> = memo(
  ({ visible, onClose, setSnackbarVisible, setSnackbarMessage, setSnackbarType }) => {
    const { order } = useSelector((state: any) => state.order);
    const [updateOrder] = useUpdateOrderStatusMutation();
    const dispatch = useDispatch();

    // Don't render modal at all if not visible or if order is missing
    if (!visible || !order) return null;

    const handlePressStatus = async (param: string) => {
      const payload = {
        orderId: order.id,
        status: param,
      };

      try {
        // Optimistic update
        dispatch(setOrderStatus(payload));

        const response: any = await updateOrder(payload);

        if (response?.data?.status === 'success') {
          setSnackbarMessage(response.data.message || 'Order status updated successfully!');
          setSnackbarType('success');
        } else {
          throw new Error(response?.data?.message || 'Failed to update order status');
        }
      } catch (error: any) {
        // Rollback optimistic update (optional)
        dispatch(setOrderStatus({ orderId: order.id, status: order.status }));
        setSnackbarMessage(error?.message || 'Something went wrong while updating status');
        setSnackbarType('error');
      } finally {
        setSnackbarVisible(true);
        onClose();
      }
    };

    return (
      <Modal
        transparent
        animationType="slide"
        statusBarTranslucent // help avoid "expected static flag was missing" in some React Native configs
        visible={!!visible} // explicit boolean for clarity
        onRequestClose={onClose} // close on Android back
      >
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <CText style={styles.title}>Update Order Status</CText>

            {statuses.map((status: any, index: number) => (
              <CTouchableOpacity
                key={index}
                style={styles.optionBtn}
                onPress={() => handlePressStatus(status.value)}
              >
                <Ionicons name="swap-horizontal-outline" size={18} color="#000" />
                <Text style={styles.optionText}>{status.label}</Text>
              </CTouchableOpacity>
            ))}

            <View style={styles.divider} />
            <CTouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Close</Text>
            </CTouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  cancelBtn: {
    backgroundColor: primaryOrange,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default OrderEditModal;
