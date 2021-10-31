/**
 * @format
 */

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
// curl 'http://ps.pndsn.com/v1/push/sub-key/sub-c-1657f96e-df4e-11eb-b709-22f598fbfd18/devices/e9a0cde23c63bdb1b71efd67c0cab471538ff17899964bc43291ccce99432f34?type=apns2'

const pubnub = new PubNub({
  // http://pubsub.pubnub.com/v1/push/sub-key/sub-c-1657f96e-df4e-11eb-b709-22f598fbfd18/devices/e9a0cde23c63bdb1b71efd67c0cab471538ff17899964bc43291ccce99432f34?type=apns
  publishKey: 'pub-c-56fcc9f4-b494-494f-8ec3-5ade985b98b5',
  subscribeKey: 'sub-c-1657f96e-df4e-11eb-b709-22f598fbfd18',
  // authKey: 'jasky',
  autoNetworkDetection: true, // enable for non-browser environment automatic reconnection
  restore: true, // enable catchup on missed messages
  // logVerbosity: true,
  ssl: true,
  presenceTimeout: 300,
  // uuid: 'myUniqueUUID',
});

YellowBox.ignoreWarnings(['']);
// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   if (type === EventType.PRESS) {
//     console.log('User pressed the notification.', detail.pressAction.id);
//   }
// });

// const sendMessage = (data) => {
//   // console.log('Channel name', channelName);
//   // console.log('SENDING____')

//   //UNCOMMENT LATER

//   // chatRef.scrollToEnd();
//   pubnub.setUUID(currentUser ? currentUser.chatId : 0);
//   if (data) {
//     pubnub.publish(
//       {
//         message: {
//           // text: data[0].text,
//           text: data,
//           userType: 'patient',
//           profile: {
//             id: currentUser.id,
//             name: currentUser.firstname + ' ' + currentUser.lastname,
//           },
//         },
//         channel: channelName,
//       },
//       (status, response) => {
//         // setMessage('');
//         // handle status, response
//         status.error
//           ? setErrorMessage("Couldn't send message")
//           : setErrorMessage('');
//         console.log('Status', status);
//         console.log('Response', response);
//         // console.log(oldLength, 'SENT____', messages.length);
//       },
//     );
//   } else {
//     console.log('NO message');
//   }
// };

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction, input } = detail;

  if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
    console.log('Replied Text-------------', input);
    console.log('Notification', detail);
    // updateChatOnServer(notification.data.conversationId, input);
  }
});
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
