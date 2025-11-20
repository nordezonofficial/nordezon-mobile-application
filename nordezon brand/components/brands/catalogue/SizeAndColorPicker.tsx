import CText from '@/components/common/CText';
import { primaryOrange } from '@/constants/colors';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#808080', '#a52a2a',
  '#ffa500', '#800080', '#008000', '#ff69b4', '#c0c0c0',
  '#964B00', '#FFD700', '#87CEEB',
];

const SizeAndColorPicker = ({
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
}: {
  selectedSizes: string[];
  selectedColors: string[];
  setSelectedSizes: (param: string[]) => void;
  setSelectedColors: (param: string[]) => void;
}) => {
  // toggle size
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // toggle color
  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  return (
    <>
      {/* SIZE PICKER */}
      <CText
        style={{
          fontSize: 16,
          fontFamily: 'PoppinsSemiBold',
          marginTop: 10,
        }}
      >
        Select Sizes
      </CText>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginVertical: 10,
        }}
      >
        {SIZES.map((s) => {
          const isSelected = selectedSizes.includes(s);
          return (
            <TouchableOpacity
              key={s}
              onPress={() => toggleSize(s)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: isSelected ? primaryOrange : '#ccc',
                backgroundColor: isSelected ? primaryOrange : '#fff',
              }}
            >
              <CText style={{ color: isSelected ? '#fff' : '#000' }}>{s}</CText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* COLOR PICKER */}
      <CText
        style={{
          fontSize: 16,
          fontFamily: 'PoppinsSemiBold',
          marginTop: 10,
        }}
      >
        Select Colors
      </CText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          gap: 12,
        }}
      >
        {COLORS.map((c) => {
          const isSelected = selectedColors.includes(c);
          return (
            <TouchableOpacity
              key={c}
              onPress={() => toggleColor(c)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: c,
                borderWidth: isSelected ? 3 : 1,
                borderColor: isSelected ? primaryOrange : '#ccc',
              }}
            />
          );
        })}
      </ScrollView>
    </>
  );
};

export default SizeAndColorPicker;
