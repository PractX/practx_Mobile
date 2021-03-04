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

const pubnub = new PubNub({
  publishKey: 'pub-c-448db23e-9ad4-4039-aff5-789495e7a5bd',
  subscribeKey: 'sub-c-36862c7a-ec50-11ea-92d8-06a89e77181a',
  autoNetworkDetection: true, // enable for non-browser environment automatic reconnection
  restore: true, // enable catchup on missed messages
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
              backgroundColor: 'green',
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
