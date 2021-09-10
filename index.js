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

// import Clipboard from '@react-native-community/clipboard';
// import admob, {MaxAdContentRating} from '@react-native-firebase/admob';
// import RNFetchBlob from 'rn-fetch-blob';
// import {firebase} from '@react-native-firebase/analytics';
import { LogBox, YellowBox } from 'react-native';
import { NetworkProvider } from 'react-native-offline';
import PushNotification from 'react-native-push-notification';

const pubnub = new PubNub({
  publishKey: 'pub-c-56fcc9f4-b494-494f-8ec3-5ade985b98b5',
  subscribeKey: 'sub-c-1657f96e-df4e-11eb-b709-22f598fbfd18',
  authKey: 'jasky',
  autoNetworkDetection: true, // enable for non-browser environment automatic reconnection
  restore: true, // enable catchup on missed messages
  // logVerbosity: true,
  ssl: true,
  presenceTimeout: 300,
  // uuid: 'myUniqueUUID',
});

YellowBox.ignoreWarnings(['']);
// SHOW NETWORK DEBUG
// global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
// global.FormData = global.originalFormData || global.FormData;

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
    </PersistGate>
  </Provider>
  //{/* </NetworkProvider> */}
);

AppRegistry.registerComponent(appName, () => RNRedux);
