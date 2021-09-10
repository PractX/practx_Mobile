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
import {
  selectChatChannels,
  selectCurrentChatChannel,
} from './src/redux/practices/practices.selector';
import { setCurrentChatChannel } from './src/redux/practices/practices.actions';

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
  currentChatChannel,
  setCurrentChatChannel,
}) => {
  const pubnub = usePubNub();

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

  function pushLocalNotification({ id, data }) {
    console.log('Group cha in notify', groupCha);
    console.log('Screen', navigationRef.current.getCurrentRoute().name);
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: data.channel, // (required) channelId, if the channel doesn't exist, notification will not trigger.
      ticker: data.title, // (optional)
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
      largeIconUrl: data.practiceImage
        ? data.practiceImage
        : 'https://icon-library.com/images/staff-icon-png/staff-icon-png-17.jpg', // (optional) default: undefined
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      // data: data,
      // bigText: data.body, // (optional) default: "message" prop
      subText: data.type === 'group' ? data.subtitle : '', // (optional) default: none
      // bigPictureUrl: 'https://media.wired.com/photos/5b899992404e112d2df1e94e/master/pass/trash2-01.jpg', // (optional) default: undefined
      // bigLargeIcon: 'ic_launcher', // (optional) default: undefined
      bigLargeIconUrl:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fthenounproject.com%2Fterm%2Furl%2F&psig=AOvVaw0O76RRHtfjmmHni_NygrN9&ust=1631266534744000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCIjPpMfL8fICFQAAAAAdAAAAABAJ', // (optional) default: undefined
      color: 'gray', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // tag: 'some_tag', // (optional) add tag to message
      group: 'group', // (optional) add group to message
      groupSummary: !groupCha.includes(data.channel), // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: 'high', // (optional) set notification priority, default: high
      visibility: 'private', // (optional) set notification visibility, default: private
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false

      when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

      messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

      // actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
      // FOR CHAT REPLY TODO
      invokeApp: false, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      /* iOS only properties */
      // category: '', // (optional) default: empty string
      // subtitle: 'My Notification Subtitle', // (optional) smaller title below notification title

      /* iOS and Android properties */
      id: id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: !groupCha.includes(data.channel) ? data.title : data.title, // (optional)
      message:
        data.messageType === 'text'
          ? data.body
          : data.messageType === 'image'
          ? '📷 Photo'
          : data.messageType === 'video'
          ? '🎥 Video'
          : data.messageType === 'voiceNote'
          ? '🎤 Voice message'
          : data.messageType === 'file'
          ? '📁 File'
          : data.body, // (required)// (required)
      picture: 'https://www.example.tld/picture.jpg', // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
      userInfo: data, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: true, // (optional) default: true
      soundName: 'practx_notify', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
    // chaList = data.type;
  }

  // PushNotification.popInitialNotification((notification) => {
  //   console.log('Initial Notification', notification);
  // });
  PushNotification.configure({
    // Called when Token is generated.
    onRegister: function (token) {
      console.log('TOKEN:', token);
      if (token.os === 'ios' && pubnub) {
        pubnub.push.addChannels({
          channels: chatChannels,
          device: token.token,
          pushGateway: 'apns',
        });
        // Send iOS Notification from debug console: {"pn_apns":{"aps":{"alert":"Hello World."}}}
      } else if (token.os === 'android' && pubnub) {
        // console.log(pubnub);
        pubnub.push.addChannels({
          channels: chatChannels,
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
      const testArray = [
        {
          id: 17,
          name: 'Billing',
          subgroupChats: [
            {
              id: 32,
              PatientSubgroup: {
                patientId: 32,
                subgroupId: 17,
                channelName: '32_17_bBew4Tsm0',
                createdAt: '2021-05-20T23:27:00.660Z',
                updatedAt: '2021-05-20T23:27:00.660Z',
              },
            },
          ],
        },
        {
          id: 18,
          name: 'Frontdesk',
          subgroupChats: [
            {
              id: 32,
              PatientSubgroup: {
                patientId: 32,
                subgroupId: 18,
                channelName: '32_18_rsPyDKvnt4',
                createdAt: '2021-05-20T23:27:00.663Z',
                updatedAt: '2021-05-20T23:27:00.663Z',
              },
            },
          ],
        },
        {
          id: 24,
          name: 'Front office',
          subgroupChats: [
            {
              id: 32,
              PatientSubgroup: {
                patientId: 32,
                subgroupId: 24,
                channelName: '32_24_Yx4YAO6NSH',
                createdAt: '2021-07-03T21:27:52.030Z',
                updatedAt: '2021-07-03T21:27:52.030Z',
              },
            },
          ],
        },
        {
          id: 25,
          name: 'Billing dept',
          subgroupChats: [
            {
              id: 32,
              PatientSubgroup: {
                patientId: 32,
                subgroupId: 25,
                channelName: '32_25_FNawpJUEOs',
                createdAt: '2021-07-03T21:27:52.035Z',
                updatedAt: '2021-07-03T21:27:52.035Z',
              },
            },
          ],
        },
        {
          id: 26,
          name: 'Sleep tech',
          subgroupChats: [
            {
              id: 32,
              PatientSubgroup: {
                patientId: 32,
                subgroupId: 26,
                channelName: '32_26_X0PRJdDex',
                createdAt: '2021-07-03T21:27:52.237Z',
                updatedAt: '2021-07-03T21:27:52.237Z',
              },
            },
          ],
        },
        {
          id: 27,
          name: 'Respiratory therapist',
          subgroupChats: [
            {
              id: 32,
              PatientSubgroup: {
                patientId: 32,
                subgroupId: 27,
                channelName: '32_27_1GujRZ9Ndg',
                createdAt: '2021-07-03T21:27:52.293Z',
                updatedAt: '2021-07-03T21:27:52.293Z',
              },
            },
          ],
        },
      ];

      console.log(
        'Find data',
        testArray.find((item) => item.id === 18),
      );
      // setInitialState('chats');
      setGroupCha([...new Set([...groupCha, notification.data.channel])]);
      console.log(notification.data.type);
      // if (!chaList.includes(notification.data.channel)) {
      console.log(
        'test channels',
        currentChatChannel,
        ' +----',
        notification.data.channel,
      );
      // }
      if (!notification.userInteraction) {
        // notification.data.channel;
        if (currentChatChannel !== notification.data.channel) {
          pushLocalNotification({
            id: notification.id,
            data: notification.data,
            groupCha: groupCha,
          });
        }
      } else {
        setGroupCha([]);
        Linking.openURL(
          `practx://chatMessages/${
            notification.data.practiceId +
            '-' +
            notification.data.channel +
            '-' +
            notification.data.type +
            '-' +
            notification.data.groupId
          }`,
        );
        PushNotification.cancelAllLocalNotifications();
        console.log('NO Push', notification);
      }

      //   .then((url) => console.log('Hello uRl', url))
      //   .catch((err) => console.log(err));
      // Do something with the notification.
      // Required on iOS only (see fetchCompletionHandler docs: https://reactnative.dev/docs/pushnotificationios)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATIONS:', notification);

      // PushNotification.getChannels(function (channel_ids) {
      //   console.log('Channel ID', channel_ids); // ['channel_id_1']
      // });

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
      .then((initState) => {
        console.log('InitState', initState);
        if (initState !== undefined) {
          setInitialState(initState);
        }

        setIsReady(true);
      });
  }, [getInitialState, themeMode]);

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
const mapDispatchToProps = (dispatch) => ({
  setCurrentChatChannel: (data) => dispatch(setCurrentChatChannel(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
