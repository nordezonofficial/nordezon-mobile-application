import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface CTextProps {
  children: React.ReactNode;
  style?: any;
  numberOfLines?: any;
  ellipsizeMode?: any;
}

const CText = ({ children, style, numberOfLines, ellipsizeMode }: CTextProps) => {
  return (
    <Text numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode} style={[styles.text, style]}>{children}</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'PoppinsRegular',
  },
});

export default CText;
