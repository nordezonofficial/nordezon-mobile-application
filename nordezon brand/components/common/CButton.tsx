import { primaryOrange } from '@/constants/colors';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CButton = ({
  text,
  onPress,
  style,
  textStyle,
  icon,
  loading,
  disabled,

  afterIcon, 
}: {
  text?: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  icon?: React.ReactNode;
  afterIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={!isDisabled ? onPress : undefined}
      style={[
        styles.button,
        style,
        isDisabled && styles.disabledButton,
      ]}
      disabled={isDisabled}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            {icon && <View style={{ top: text ? -2 : 0, marginRight: text ? 6 : 0 }}>{icon}</View>}
            {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
            {afterIcon && <View style={{ top: text ? -2 : 0, marginRight: text ? 6 : 0 }}>{afterIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 10,
    backgroundColor: primaryOrange,
  },
  disabledButton: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: 'PoppinsSemiBold',
    fontSize: 16,
  },
});

export default CButton;
