import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import settingsReducer from './settings/settings.reducer';

import userReducer from './user/user.reducer';
import instagramReducer from './instagram/instagram.reducer';
import twitterReducer from './twitter/twitter.reducer';
import facebookReducer from './facebook/facebook.reducer';
import whatsappReducer from './whatsapp/whatsapp.reducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // blacklist: ['navigation'],
  // whitelist: ['auth', 'notes'],
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  whatsapp: whatsappReducer,
  user: userReducer,
  instagram: instagramReducer,
  twitter: twitterReducer,
  facebook: facebookReducer,
});

export default persistReducer(persistConfig, rootReducer);
