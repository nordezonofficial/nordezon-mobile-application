import { primaryOrange } from '@/constants/colors';
import { FORGET, FORGOT, LOGIN, SIGNUP } from '@/constants/keys';
import { useUserLoginMutation } from '@/store/api/v1/auth';
import { setCategoriesList, setUser } from '@/store/slices/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import CButton from '../common/CButton';
import CTextField from '../common/CTextField';
import CTouchableOpacity from '../common/CTouchableOpacity';
import KeyboardAvoiding from '../common/KeyboardAvoiding';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, isError }] = useUserLoginMutation();
  const dispatch = useDispatch();
  /* -- navigation --*/
  const navigation = useRouter();
  const [loading, setLoading] = useState(false)


  /* -- push to the signup ---*/
  /* -- push to the signup ---*/
  const handleNavigatePress = async (param: string) => {
    try {
      if (param == LOGIN) {
        setLoading(true)
        // navigation.push('/(brand)/brandHome')
        let payload: any = {
          email: email,
          password: password,
        }
        let response = await login(payload);

        // Check if there's an error in the response
        if (response.error) {
          const errorMessage = ('data' in response.error && (response.error.data as any)?.message)
            ? String((response.error.data as any).message)
            : 'Login failed. Please try again.';
          Alert.alert('Login Error', errorMessage);
          setLoading(false)

          return;
        }
        let user = response.data.data;
        let accessToken = response.data.data.accessToken
        payload = {
          accessToken: accessToken,
          user: user,
        }
        await AsyncStorage.setItem('@access_token', accessToken);
        dispatch(setUser(payload))

        if (user.categories.length == 0) {
          dispatch(setCategoriesList(response.data.categoriesList))
          navigation.push('/(user)/setUpProfile');

          return;
        }

        console.log("user.role", user.role);
        
        if (user.role == "BRAND") {
          let userInterestCategories = response.data.data.categories;
          // let categoriesList = userInterestCategories.map((item: any) => item.category);
          setLoading(false)

          dispatch(setCategoriesList(userInterestCategories))
          navigation.push('/(brand)/brandHome')

        } else {
          navigation.replace('/(home)/(tabs)/home')
        }


      }
    } catch (error) {
      console.log("Error:", error);

      setLoading(false)

    }
    if (param == SIGNUP) {
      navigation.push('/(auth)/signup');
    }
    if (param == FORGET) {
      navigation.push({
        pathname: '/(otp)/otp',
        params: { type: FORGOT },
      });
    }
  }
  return (
    <KeyboardAvoiding>



      {/* Logo */}
      <Image source={require('../../assets/images/Elogo.png')} style={styles.logo} />

      {/* Subtitle */}
      <Text style={styles.subtitle}>Login to your account</Text>

      {/* Email Input */}
      <CTextField
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        icon="mail-outline"
      />

      {/* Password Input */}
      <CTextField
        label="Password"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        icon="lock-closed-outline"
        showToggle
      />

      {/* Forgot Password */}
      <CTouchableOpacity style={styles.forgotContainer} onPress={() => handleNavigatePress(FORGET)}>
        <Text style={[styles.forgotText, {
          color: primaryOrange
        }]}>Forgot Password?</Text>
      </CTouchableOpacity>

      {/* Login Button */}
      <CButton
        loading={loading}
        text="Login"
        style={[styles.loginButton]}
        textStyle={styles.loginButtonText}
        onPress={() => handleNavigatePress(LOGIN)}
      />

      {/* Don’t have an account */}
      <View style={styles.footer}>
        <CTouchableOpacity onPress={() => {
        }}>
          <Text style={styles.footerText}>Don’t have an account? </Text>
        </CTouchableOpacity>
        <CTouchableOpacity onPress={() => handleNavigatePress(SIGNUP)}>
          <Text style={[styles.footerLink, {
            color: primaryOrange
          }]}>Sign up</Text>
        </CTouchableOpacity>
      </View>
    </KeyboardAvoiding>

  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 200,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: '#33e0eb',
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: '#ffc242',
    borderRadius: 50,
    paddingVertical: 15,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontFamily: 'PoppinsSemiBold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#666',
    fontFamily: 'PoppinsRegular',
  },
  footerLink: {
    fontFamily: 'PoppinsSemiBold',
  },
});

export default LoginForm;
