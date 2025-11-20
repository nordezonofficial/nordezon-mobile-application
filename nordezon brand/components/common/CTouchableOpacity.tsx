import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

interface CTouchableOpacityProps {
  children: React.ReactNode;
  onPress: () => void;
  onLongPress?: () => void;
  onPressOut?: () => void;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number
  disabled?: boolean
}

export default function CTouchableOpacity({
  children,
  onPress,
  onLongPress,
  onPressOut,
  style,
  activeOpacity = 0.8,
  disabled = false
}: CTouchableOpacityProps) {
  return (
    <TouchableOpacity delayLongPress={160} onPressOut={onPressOut && onPressOut} disabled={disabled} activeOpacity={activeOpacity} onPress={onPress} style={style} onLongPress={onLongPress}>
      {children}
    </TouchableOpacity>
  );
}
