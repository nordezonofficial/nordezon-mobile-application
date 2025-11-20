import { primaryOrange } from '@/constants/colors';
import { BRAND, LOGIN, SHOPPER } from '@/constants/keys';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import BackgroundContainer from '../common/BackgroundContainer';
import CButton from '../common/CButton';
import CText from '../common/CText';
import CTouchableOpacity from '../common/CTouchableOpacity';
const AuthSelection = () => {
  /* -- navigation --*/
  const navigation = useRouter();

  /* -- push to the login ---*/
  const handleNavigatePress = (param: string) => {
    if (param == LOGIN) {
      navigation.push('/(auth)/login');
    }
    if (param == SHOPPER || param == BRAND) {
      navigation.push({
        pathname: '/(auth)/signup',
        params: { type: param }, 
      });
    }

  }
  return (
    <BackgroundContainer>
      <View style={styles.container}>
        {/* ---- Logo ---- */}
        <Image source={require('../../assets/images/Ulogo.png')} style={styles.logo} />

        {/* 🟦 Shopper button */}
        <CButton
          style={[styles.continueAsGuest, styles.buttonBlue]}
          textStyle={styles.continueAsGuestText}
          text="Sign up as Shopper"
          icon={<Ionicons name="person-add-outline" size={20} color="#000" />}
          onPress={() => handleNavigatePress("SHOPPER")}
        />

        {/* ---- OR Separator ---- */}
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* ---- Brand button  ---- */}
        <CButton
          style={[styles.continueAsGuest, styles.buttonBgOrange]}
          textStyle={[styles.continueAsGuestText, { color: '#fff' }]}
          text="Sign up as Brand"
          icon={<Ionicons name="storefront-outline" size={20} color="#fff" />}
          onPress={() => handleNavigatePress("BRAND")}
        />

        {/* ---- Already have an account section ---- */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <CTouchableOpacity onPress={() => handleNavigatePress(LOGIN)}>
            <CText style={styles.footerLink}>Log in</CText>
          </CTouchableOpacity>
        </View>
      </View>
    </BackgroundContainer>

  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  continueAsGuest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
  },
  continueAsGuestText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'PoppinsSemiBold',
    marginLeft: 10,
  },
  buttonBgOrange: {
    backgroundColor: '#ffc242',
    // backgroundColor: '#ffc242',
  },
  buttonBlue: {
    backgroundColor: '#33e0eb',
  },
  // 🟣 OR Separator Styles
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#999',
    fontFamily: 'PoppinsSemiBold',
  },
  // 👇 Footer
  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontFamily: 'PoppinsRegular',
  },
  footerLink: {
    color: primaryOrange,
    fontFamily: 'PoppinsSemiBold',
  },
});

export default AuthSelection;
