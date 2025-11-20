import { primaryOrange } from '@/constants/colors';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import CText from '../common/CText';
import CTouchableOpacity from '../common/CTouchableOpacity';

const socialPlatforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Website'];

const SocialLinksForm = ({
  setActiveOn,
  activeOn
}: {
  setActiveOn: (param: { key: string; value: string }[]) => void
  activeOn: { key: string; value: string }[]
}) => {
  const togglePlatform = (platform: string) => {
    const existingIndex = activeOn.findIndex(item => item.key === platform);

    if (existingIndex !== -1) {
      // Remove platform
      const updatedActiveOn = activeOn.filter(item => item.key !== platform);
      setActiveOn(updatedActiveOn);
    } else {
      // Add platform with empty link
      setActiveOn([...activeOn, { key: platform, value: '' }]);
    }
  };

  const handleLinkChange = (platform: string, value: string) => {
    const updatedActiveOn = activeOn.map(item =>
      item.key === platform ? { ...item, value } : item
    );
    setActiveOn(updatedActiveOn);
  };

  const isPlatformActive = (platform: string) => {
    return activeOn.some(item => item.key === platform);
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <CText style={styles.label}>Active On</CText>

      {/* Platform buttons */}
      <View style={styles.platformContainer}>
        {socialPlatforms.map((platform, index: number) => (
          <CTouchableOpacity
            key={index}
            onPress={() => togglePlatform(platform)}
            style={[
              styles.platformBox,
              isPlatformActive(platform) && { backgroundColor: primaryOrange },
            ]}
          >
            <CText style={{ color: isPlatformActive(platform) ? '#fff' : '#333' }}>
              {platform}
            </CText>
          </CTouchableOpacity>
        ))}
      </View>

      {/* Dynamic TextInputs for links */}
      {activeOn.map((item, index) => (
        <View key={index} style={styles.inputContainer}>
          <CText>{item.key} Link</CText>
          <TextInput
            value={item.value}
            onChangeText={(text) => handleLinkChange(item.key, text)}
            placeholder={`Enter your ${item.key} link`}
            style={styles.input}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 14, fontFamily: 'PoppinsSemiBold', marginBottom: 6, color: '#333' },
  platformContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  platformBox: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  inputContainer: { marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 4,
    color: '#333',
  },
});

export default SocialLinksForm;
