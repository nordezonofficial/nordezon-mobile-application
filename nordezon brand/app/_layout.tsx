import { API_URL } from '@/constants/keys';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { setCategoriesList, setOnAuthstateChangedUser } from '@/store/slices/user';
import { store } from '@/store/store';
import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';


export const unstable_settings = {
  anchor: '(tabs)',
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    PoppinsRegular: Poppins_400Regular,
    PoppinsSemiBold: Poppins_600SemiBold,
  });
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    // Note: setBackgroundColorAsync is not supported with edge-to-edge mode
    // NavigationBar.setBackgroundColorAsync('#ffffff'); // or any visible color
    NavigationBar.setButtonStyleAsync('dark'); // makes nav buttons dark
  }, []);



  const [authLanding, setAuthLanding] = useState<boolean | null>(null);
  const [isLogged, setLogged] = useState<boolean | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function checkauthLanding() {
      try {
        const value = await AsyncStorage.getItem('@auth_landing');
        setAuthLanding(value ? true : false);
      } catch (error) {
        console.error('Error reading AsyncStorage:', error);
      }
    }
    checkauthLanding();
  }, []);

  // Check for @access_token and call onAuthStateChanged if present
  useEffect(() => {
    async function checkAccessTokenAndAuthState() {
      try {
        const token = await AsyncStorage.getItem('@access_token');

        if (token) {
          try {
            const response = await fetch(`${API_URL}/api/v1/auth/on-auth-state-change`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });



            const result = await response.json();
            store.dispatch(setOnAuthstateChangedUser(result.data))
            if (result.data.categories.length == 0) {
              const categoriesList = result?.categoriesList;
              store.dispatch(setCategoriesList(categoriesList))

              router.replace('/(user)/setUpProfile');
            } else {
              setLogged(true);
            }
          } catch (err) {
            setLogged(false);
            console.error('Error calling onAuthStateChanged:', err);
          }
        } else {
          setLogged(false);
        }
      } catch (e) {
        console.error('Error checking @access_token in AsyncStorage:', e);
        setLogged(false);
      }
    }

    checkAccessTokenAndAuthState();
  }, []);




  useEffect(() => {
    if (isLogged) {
      // router.replace('/(brand)/brandHome');
      router.replace('/(home)/(tabs)/home');

    }
  }, [isLogged]);


  // if (!fontsLoaded) return null;
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ThemeProvider value={isDarkMode ? DefaultTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                {/* Auth flow */}
                <Stack.Screen name="(auth)" />
                {/* Main app flow */}
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(chat)" />            </Stack>
            </ThemeProvider>
            <StatusBar style={isDarkMode ? 'dark' : 'light'} />
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
