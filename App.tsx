/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, Text, useColorScheme, View, AppState, Platform, NativeEventEmitter, NativeModules } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useRef, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import AppStack from './src/screens/navigation/appStack'

const Stack = createNativeStackNavigator();
const { AppLockModule } = NativeModules;

// Export navigation ref for native modules
export const navigationRef = { current: null };

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const navRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'ios' && AppLockModule) {
      // Check for pending blocked app when app becomes active
      const checkPendingBlockedApp = async () => {
        try {
          if (AppLockModule.getPendingBlockedApp) {
            const data = await AppLockModule.getPendingBlockedApp();
            if (data && data.packageName && navRef.current) {
              navRef.current.navigate('AppBlocked', {
                packageName: data.packageName,
                appName: data.appName || data.packageName,
                icon: null
              });
            }
          }
        } catch (err) {
          // Ignore errors
        }
      };

      // Monitor app state changes on iOS - more aggressive checking
      let lastAppState = AppState.currentState;
      const subscriptionAppState = AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'active' && lastAppState !== 'active') {
          // App became active from background - check if we need to show blocked screen
          // This happens when user switches back to FWRD from another app
          setTimeout(() => {
            checkPendingBlockedApp();
          }, 300); // Small delay to ensure native module is ready
        }
        lastAppState = nextAppState;
      });

      // Check immediately on mount
      checkPendingBlockedApp();
      
      // Also check periodically when app is active (workaround for iOS limitations)
      const intervalId = setInterval(() => {
        if (AppState.currentState === 'active') {
          checkPendingBlockedApp();
        }
      }, 1000); // Check every 1 second for faster detection
      
      // Listen for iOS notification
      const notificationListener = require('react-native').DeviceEventEmitter?.addListener?.('FWRD_AppBlocked', (data: any) => {
        if (data && data.packageName && navRef.current) {
          navRef.current.navigate('AppBlocked', {
            packageName: data.packageName,
            appName: data.appName || data.packageName,
            icon: null
          });
        }
      });

      return () => {
        subscriptionAppState.remove();
        if (intervalId) {
          clearInterval(intervalId);
        }
        if (notificationListener) {
          notificationListener.remove();
        }
      };
    }
  }, []);

  return (
     <GestureHandlerRootView>
    <BottomSheetModalProvider>
    <NavigationContainer>
      <AppStack/>
    </NavigationContainer>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>

    
   
    

  );
}

export default App;
