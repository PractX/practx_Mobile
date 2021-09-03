import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ColorList } from './src/utils/color';
import { selectThemeMode } from './src/redux/settings/settings.selector';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Orientation from 'react-native-orientation-locker';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AuthScreen from './src/screens/auth/AuthScreen';
import MainScreen from './src/screens/main/MainScreen';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectCurrentUser, selectToken } from './src/redux/user/user.selector';
import FlashMessage from 'react-native-flash-message';
import { Keyboard } from 'react-native';
import { usePubNub } from 'pubnub-react';

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
const Stack = createStackNavigator();
const App = ({ themeMode, user, token }) => {
  const pubnub = usePubNub();
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    color: null,
    scheme: null,
    theme: null,
  });

  // PushNotification.popInitialNotification((notification) => {
  //   console.log('Initial Notification', notification);
  // });
  PushNotification.configure({
    // Called when Token is generated.
    onRegister: function (token) {
      console.log('TOKEN:', token);
      if (token.os === 'ios' && pubnub) {
        pubnub.push.addChannels({
          channels: ['channel-1'],
          device: token.token,
          pushGateway: 'apns',
        });
        // Send iOS Notification from debug console: {"pn_apns":{"aps":{"alert":"Hello World."}}}
      } else if (token.os === 'android' && pubnub) {
        // console.log(pubnub);
        pubnub.push.addChannels({
          channels: ['32_13_ciqrmNksp'],
          device: token.token,
          pushGateway: 'gcm', // apns, gcm, mpns
        });
        // Send Android Notification from debug console: {"pn_gcm":{"data":{"message":"Hello World."}}}
      }
    },
    // Something not working?
    // See: https://support.pubnub.com/hc/en-us/articles/360051495432-How-can-I-troubleshoot-my-push-notification-issues-
    // Called when a remote or local notification is opened or received.
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      // Do something with the notification.
      // Required on iOS only (see fetchCompletionHandler docs: https://reactnative.dev/docs/pushnotificationios)
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATIONS:', notification);

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
    // ANDROID: GCM or FCM Sender ID
    senderID: '732342770141',
  });

  useMemo(() => {
    Keyboard.dismiss();
    console.log(state.color);
    if (themeMode === 'Dark') {
      setState({
        ...state,
        color: ColorList[1].background,
        scheme: 'light-content',

        theme: {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            ...ColorList[1],
          },
        },
      });
    } else {
      setState({
        ...state,
        color: ColorList[0].background,
        scheme: 'dark-content',

        theme: {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            ...ColorList[0],
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Keyboard, themeMode]);
  useEffect(() => {
    // console.log(token);
    Orientation.lockToPortrait();
    themeMode === 'Dark'
      ? changeNavigationBarColor(ColorList[1].background)
      : changeNavigationBarColor(ColorList[0].background);
  }, [themeMode]);
  return (
    <>
      {/* <SafeAreaView style={{ flex: 2, backgroundColor: state.color }}> */}
      <StatusBar backgroundColor={state.color} barStyle={state.scheme} />
      <NavigationContainer
        theme={state.theme}
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
        }>
        <Stack.Navigator initialRouteName="NoAuth" headerMode="none">
          {isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : (user === null && token === null) || (user === null && token) ? (
            // No token found, user isn't signed in
            <Stack.Screen name="AuthScreen" component={AuthScreen} />
          ) : (
            // User is signed in
            <Stack.Screen name="MainScreen" component={MainScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage
        animated={true}
        animationDuration={500}
        floating={true}
        position={'right'}
        style={{
          width: '70%',
          alignSelf: 'center',
          zIndex: 20000,
          top: Platform.OS === 'ios' ? 30 : 0,
          // alignItems: 'center',
        }}
        titleStyle={{ textAlign: 'left', fontFamily: 'SofiaProRegular' }}
        duration={4000}
        icon={{ icon: 'auto', position: 'right' }}
      />
      {/* </SafeAreaView> */}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

const mapStateToProps = createStructuredSelector({
  themeMode: selectThemeMode,
  user: selectCurrentUser,
  token: selectToken,
});
export default connect(mapStateToProps)(App);
