import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import settingsReducer from './settings/settings.reducer';
import practicesReducer from './practices/practices.reducer';

import userReducer from './user/user.reducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // blacklist: ['navigation'],
  // whitelist: ['auth', 'notes'],
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  user: userReducer,
  practice: practicesReducer,
});

export default persistReducer(persistConfig, rootReducer);
