/**
 * @format
 */
// "@notifee/react-native": "^3.0.4",
import { AppRegistry } from 'react-native';
import React, { useCallback, useState } from 'react';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { name as appName } from './app.json';
import { MenuProvider } from 'react-native-popup-menu';
import PubNub from 'pubnub';
import { PubNubProvider, usePubNub } from 'pubnub-react';
import { Provider as RNPProvider } from 'react-native-paper';
import notifee, { EventType } from '@notifee/react-native';
// import Clipboard from '@react-native-community/clipboard';
// import admob, {MaxAdContentRating} from '@react-native-firebase/admob';
// import RNFetchBlob from 'rn-fetch-blob';
// import {firebase} from '@react-native-firebase/analytics';
import { LogBox, YellowBox } from 'react-native';
import { NetworkProvider } from 'react-native-offline';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
// curl 'http://ps.pndsn.com/v1/push/sub-key/sub-c-1657f96e-df4e-11eb-b709-22f598fbfd18/devices/e9a0cde23c63bdb1b71efd67c0cab471538ff17899964bc43291ccce99432f34?type=apns2'
import SocketContext, { getSocket } from './src/context/socketContext';
const pubnub = new PubNub({
  // http://pubsub.pubnub.com/v1/push/sub-key/sub-c-1657f96e-df4e-11eb-b709-22f598fbfd18/devices/e9a0cde23c63bdb1b71efd67c0cab471538ff17899964bc43291ccce99432f34?type=apns
  publishKey: 'pub-c-56fcc9f4-b494-494f-8ec3-5ade985b98b5',
  subscribeKey: 'sub-c-1657f96e-df4e-11eb-b709-22f598fbfd18',
  // authKey: 'jasky',
  autoNetworkDetection: true, // enable for non-browser environment automatic reconnection
  restore: true, // enable catchup on missed messages
  // logVerbosity: true,
  ssl: true,
  // presenceTimeout: 300,
  // uuid: 'myUniqueUUID',
});

YellowBox.ignoreWarnings(['']);

// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   if (type === EventType.PRESS) {
//     console.log('User pressed the notification.', detail.pressAction.id);
//   }
// });

// const sendMessage = (data, input) => {
//   console.log('Channel name', data);
//   // console.log('SENDING____')

//   //UNCOMMENT LATER

//   // chatRef.scrollToEnd();
//   pubnub.setUUID(data ? data?.chatId : 0);
//   if (data) {
//     pubnub.publish(
//       {
//         message: {
//           // text: data[0].text,
//           text: input,
//           userType: 'patient',
//           profile: {
//             id: parseInt(data?.userId),
//             name: data?.firstname + ' ' + data?.lastname,
//           },
//         },
//         channel: data?.channel,
//       },
//       (status, response) => {
//         // setMessage('');
//         // handle status, response
//         console.log('Status', status);
//         console.log('Response', response);
//         // console.log(oldLength, 'SENT____', messages.length);
//       },
//     );
//   } else {
//     console.log('NO message');
//   }
// };

// SHOW NETWORK DEBUG
// global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
// global.FormData = global.originalFormData || global.FormData;

// eslint-disable-next-line no-extend-native
String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(
    new RegExp(
      str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'),
      ignore ? 'gi' : 'g',
    ),
    typeof str2 === 'string' ? str2.replace(/\$/g, '$$$$') : str2,
  );
};
// const chatChannels = [
//   '32_13_ciqrmNksp',
//   '32_62_mdgHKKMhz',
//   '32_19_u-eyqEx1v',
//   '32_21_s3cDJYcYCV',
//   '32_20_W7IysYgvY3',
//   '32_22_0AsRA3mD_T',
//   '32_17_bBew4Tsm0',
//   '32_18_rsPyDKvnt4',
//   '32_24_Yx4YAO6NSH',
//   '32_25_FNawpJUEOs',
//   '32_26_X0PRJdDex',
//   '32_27_1GujRZ9Ndg',
// ];

// const currentChatChannel = '';

// PushNotification.configure({
//   // Called when Token is generated.
//   onRegister: function (token) {
//     console.log('TOKEN:', token);
//     if (token.os === 'ios' && pubnub) {
//       // pubnub.push.addChannels(
//       //   {
//       //     channels: chatChannels,
//       //     device: token.token,
//       //     pushGateway: 'apns2',
//       //     environment: 'production', /// Required for APNS2
//       //     topic: 'com.bcapturetech.practx',
//       //   },
//       //   function (status) {
//       //     console.log('Testing APNS2', status);
//       //   },
//       // );
//       console.log('Date', new Date().getTime());
//       pubnub.push.addChannels(
//         {
//           channels: chatChannels,
//           // channels: ['channel1'],
//           device: token.token,
//           pushGateway: 'apns2',
//           environment: 'development', // Required for APNs2
//           topic: 'com.bcapturetech.practx', // Required for APNs2
//         },
//         function (status) {
//           console.log(status);
//         },
//       );
//       // Send iOS Notification from debug console: {"pn_apns":{"aps":{"alert":"Hello World."}}}
//     } else if (token.os === 'android' && pubnub) {
//       // console.log(pubnub);
//       pubnub.push.addChannels({
//         channels: chatChannels,
//         device: token.token,
//         pushGateway: 'gcm', // apns, gcm, mpns
//       });
//       // Send Android Notification from debug console: {"pn_gcm":{"data":{"message":"Hello World."}}}
//     }
//   },
//   // Something not working?
//   // See: https://support.pubnub.com/hc/en-us/articles/360051495432-How-can-I-troubleshoot-my-push-notification-issues-
//   // Called when a remote or local notification is opened or received.
//   onNotification: function (notification) {
//     console.log('NOTIFICATION:', notification);
//     // setInitialState('chats');
//     // setGroupCha([...new Set([...groupCha, notification.data.channel])]);

//     console.log(notification.data.type);
//     // if (!chaList.includes(notification.data.channel)) {
//     console.log(
//       'test channels',
//       [currentChatChannel],
//       ' +----',
//       notification.data.channel,
//     );
//     // }
//     if (!notification.userInteraction) {
//       // notification.data.channel;
//       console.log('I am here 1');
//       if (
//         !notification.foreground ||
//         currentChatChannel !== notification.data.channel
//       ) {
//         console.log('I am here 1a', notification);
//         // pushLocalNotification({
//         //   id: notification.id ? notification.id : '2',
//         //   data: notification.data,
//         //   groupCha: groupCha,
//         // });
//         // onDisplayChatNotification({
//         //   data: notification.data,
//         //   groupCha: groupCha,
//         // });
//       }
//     } else {
//       console.log('I am here 2');
//       // setGroupCha([]);
//       // Linking.openURL(
//       //   `practx://chatMessages/${
//       //     notification.data.practiceId +
//       //     '-' +
//       //     notification.data.channel +
//       //     '-' +
//       //     notification.data.type +
//       //     '-' +
//       //     notification.data.groupId
//       //   }`,
//       // );
//       PushNotification.cancelAllLocalNotifications();
//       console.log('NO Push', notification);
//     }

//     //   .then((url) => console.log('Hello uRl', url))
//     //   .catch((err) => console.log(err));
//     // Do something with the notification.
//     // Required on iOS only (see fetchCompletionHandler docs: https://reactnative.dev/docs/pushnotificationios)
//     notification.finish(PushNotificationIOS.FetchResult.NoData);
//   },
//   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//   onAction: function (notification) {
//     console.log('ACTION:', notification.action);
//     console.log('NOTIFICATIONS:', notification);

//     // PushNotification.getChannels(function (channel_ids) {
//     //   console.log('Channel ID', channel_ids); // ['channel_id_1']
//     // });

//     // process the action
//   },

//   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError: function (err) {
//     console.log('THis is the error registering notification', err);
//     console.error(err.message, err);
//   },

//   // IOS ONLY (optional): default: all - Permissions to register.
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },

//   // Should the initial notification be popped automatically
//   // default: true
//   popInitialNotification: true,

//   /**
//    * (optional) default: true
//    * - Specified if permissions (ios) and token (android and ios) will requested or not,
//    * - if not, you must call PushNotificationsHandler.requestPermissions() later
//    * - if you are not using remote notification or do not have Firebase installed, use this:
//    *     requestPermissions: Platform.OS === 'ios'
//    */
//   requestPermissions: true,
//   // ANDROID: GCM or FCM Sender ID
//   senderID: '732342770141',
// });

const RNRedux = () => (
  // <NetworkProvider
  //   pingTimeout={5000}
  //   pingServerUrl={'https://www.google.com/'}
  //   shouldPing={true}
  //   pingInterval={20000}
  //   pingOnlyIfOffline={false}
  //   pingInBackground={false} //should be false
  // >
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <RNPProvider>
        <PubNubProvider client={pubnub}>
          <MenuProvider
            customStyles={{
              menuProviderWrapper: {
                // backgroundColor: 'green',
                padding: 0,
              },
            }}>
            <App />
          </MenuProvider>
        </PubNubProvider>
      </RNPProvider>
    </PersistGate>
  </Provider>
  //{/* </NetworkProvider> */}
);

AppRegistry.registerComponent(appName, () => RNRedux);
