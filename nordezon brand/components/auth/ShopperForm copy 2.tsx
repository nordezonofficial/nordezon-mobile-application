import { primaryOrange } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CityPicker from '../CityList';
import CButton from '../common/CButton';
import CDatePickerField from '../common/CDatePickerField';
import CText from '../common/CText';
import CTextField from '../common/CTextField';
import CTouchableOpacity from '../common/CTouchableOpacity';

const ShopperMultiStepForm = () => {
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [city, setCity] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Step Navigation
  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <>
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((num) => (
          <View
            key={num}
            style={[
              styles.circle,
              step === num && { backgroundColor: primaryOrange },
            ]}
          >
            <CText style={[styles.circleText, step === num && { color: '#fff' }]}>
              {num}
            </CText>
          </View>
        ))}
      </View>

      {/* Step 1 - Personal Info */}
      {step === 1 && (
        <>
          <CTextField
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            icon="person-outline"
          />
          <CTextField
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />
          <CTextField
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showToggle
            icon="lock-closed-outline"
          />
        </>
      )}

      {/* Step 2 - Contact Info */}
      {step === 2 && (
        <>
          <CTextField
            label="Phone Number"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            icon="call-outline"
            keyboardType="phone-pad"
          />
          <CDatePickerField
            placeholder="Date Of Birth"
            value={dob}
            onChange={setDob}
            maximumDate={new Date()}
          />
          <CityPicker city={city} setCity={setCity} />
        </>
      )}

      {/* Step 3 - Agreement */}
      {step === 3 && (
        <>
          <CTouchableOpacity
            style={[styles.checkboxContainer, { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }]}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.9}
          >
            <Ionicons
              name={agreed ? 'checkbox-outline' : 'square-outline'}
              size={22}
              color={agreed ? primaryOrange : '#999'}
            />
            <CText style={[styles.checkboxText, { marginLeft: 8 }]}>
              I agree with{' '}
            </CText>
            <CTouchableOpacity onPress={() => console.log('Terms clicked')}>
              <CText style={[styles.linkText]}>Terms & Conditions</CText>
            </CTouchableOpacity>
            <CText style={[styles.checkboxText]}> and </CText>
            <CTouchableOpacity onPress={() => console.log('Privacy clicked')}>
              <CText style={[styles.linkText]}>Privacy Policy</CText>
            </CTouchableOpacity>
          </CTouchableOpacity>
        </>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        {step > 1 && (
          <CButton
            text="Back"
            onPress={prevStep}
            style={[styles.navButton, styles.backButton]}
            textStyle={styles.backButtonText}
          />
        )}

        {step < 3 ? (
          <CButton
            text="Next"
            onPress={nextStep}
            style={styles.navButton}
            textStyle={styles.navButtonText}
          />
        ) : (
          <CButton
            text="Register"
            onPress={() => console.log('Form submitted')}
            style={styles.navButton}
            textStyle={styles.navButtonText}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  circleText: {
    fontFamily: 'PoppinsSemiBold',
    color: '#333',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  navButton: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: primaryOrange,
  },
  navButtonText: {
    color: '#fff',
    fontFamily: 'PoppinsSemiBold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#eee',
  },
  backButtonText: {
    color: '#333',
  },
  checkboxContainer: {
    marginTop: 20,
  },
  checkboxText: {
    fontFamily: 'PoppinsRegular',
    fontSize: 14,
    color: '#555',
  },
  linkText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 14,
    color: primaryOrange,
  },
});

export default ShopperMultiStepForm;
