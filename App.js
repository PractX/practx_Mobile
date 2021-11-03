import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  Linking,
} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useLinking,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ColorList } from './src/utils/color';
import { selectThemeMode } from './src/redux/settings/settings.selector';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Orientation from 'react-native-orientation-locker';

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
import {
  selectChatChannels,
  selectCurrentChatChannel,
} from './src/redux/practices/practices.selector';
import { setCurrentChatChannel } from './src/redux/practices/practices.actions';
// import notifee, { EventType } from '@notifee/react-native';

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
const Stack = createStackNavigator();
const App = ({
  themeMode,
  user,
  token,
  chatChannels,
  setCurrentChatChannel,
}) => {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    color: null,
    scheme: null,
    theme: null,
  });
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = useState();
  let lastId = 0;
  let chaList = '';
  const [groupCha, setGroupCha] = useState([]);

  const config = {
    screens: {
      MainScreen: {
        screens: {
          Chats: {
            screens: {
              ChatMessages: {
                path: 'chatMessages/:ids',
                parse: {
                  ids: String,
                },
              },
            },
          },
        },
      },
    },
  };

  const { getInitialState } = useLinking(navigationRef, {
    prefixes: ['https://practx.com/', 'practx://'],
    config,
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
    Orientation.lockToPortrait();
    //     if(themeMode === 'Dark'){
    //       const me = ;
    // console.log()
    //     };
    themeMode === 'Dark'
      ? changeNavigationBarColor(ColorList[1].background)
      : changeNavigationBarColor(ColorList[0].background);
  }, [themeMode]);

  useEffect(() => {
    setCurrentChatChannel('');
  }, []);

  useEffect(() => {
    getInitialState()
      .catch(() => {})
      .then(initState => {
        console.log('InitState', initState);
        if (initState !== undefined) {
          setInitialState(initState);
        }

        setIsReady(true);
      });
  }, [getInitialState, themeMode]);

  // Subscribe to events
  // useEffect(() => {
  //   const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
  //     const { notification, pressAction, input } = detail;
  //     if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
  //       console.log('In app Replied Text-------------', input);
  //       // console.log('Notification', notification);
  //       // sendMessage(notification?.data, input);
  //       // updateChatOnServer(notification.data.conversationId, input);
  //     } else {
  //       console.log('Action Type', type);
  //       switch (type) {
  //         case EventType.DISMISSED:
  //           console.log('User dismissed notification', detail.notification);
  //           break;
  //         case EventType.PRESS:
  //           console.log('User pressed notification', detail.notification);
  //           break;
  //       }
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  // useEffect(() => {
  //   notifee.onBackgroundEvent(async ({ type, detail }) => {
  //     const { notification, pressAction } = detail;

  //     // Check if the user pressed the "Mark as read" action
  //     console.log('Valuesss Background Events', detail);
  //     if (
  //       type === EventType.ACTION_PRESS &&
  //       pressAction.id === 'mark-as-read'
  //     ) {
  //       // Update external API
  //       // await fetch(
  //       //   `https://my-api.com/chat/${notification.data.chatId}/read`,
  //       //   {
  //       //     method: 'POST',
  //       //   },
  //       // );

  //       // Remove the notification
  //       await notifee.cancelNotification(notification.id);
  //     }
  //   });
  // }, []);

  if (!isReady) {
    return <></>;
  }
  return (
    <>
      {/* <SafeAreaView style={{ flex: 2, backgroundColor: state.color }}> */}
      <StatusBar backgroundColor={state.color} barStyle={state.scheme} />
      <NavigationContainer
        initialState={initialState}
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
  chatChannels: selectChatChannels,
  currentChatChannel: selectCurrentChatChannel,
});
const mapDispatchToProps = dispatch => ({
  setCurrentChatChannel: data => dispatch(setCurrentChatChannel(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
