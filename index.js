/**
 * @format
 */

import {AppRegistry} from 'react-native';
import React, {useCallback, useState} from 'react';
import App from './App';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {name as appName} from './app.json';
// import Clipboard from '@react-native-community/clipboard';
// import admob, {MaxAdContentRating} from '@react-native-firebase/admob';
// import RNFetchBlob from 'rn-fetch-blob';
// import {firebase} from '@react-native-firebase/analytics';
import {
  LogBox,
  // YellowBox
} from 'react-native';
import {NetworkProvider} from 'react-native-offline';

const RNRedux = () => (
  <NetworkProvider
    pingTimeout={5000}
    pingServerUrl={'https://www.google.com/'}
    shouldPing={true}
    pingInterval={20000}
    pingOnlyIfOffline={false}
    pingInBackground={false} //should be false
  >
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </NetworkProvider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
