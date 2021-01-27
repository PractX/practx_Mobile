import { all, call } from 'redux-saga/effects';
import { userSagas } from './user/user.sagas';
import { settingsSagas } from './settings/settings.sagas';
import { practicesSagas } from './practices/practices.sagas';

export default function* rootSaga() {
  yield all([call(userSagas), call(settingsSagas), call(practicesSagas)]);
}
