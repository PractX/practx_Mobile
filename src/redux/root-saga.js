import { all, call } from 'redux-saga/effects';
import { instagramSagas } from './instagram/instagram.sagas';
import { twitterSagas } from './twitter/twitter.sagas';
import { facebookSagas } from './facebook/facebook.sagas';
import { userSagas } from './user/user.sagas';
import { settingsSagas } from './settings/settings.sagas';

export default function* rootSaga() {
  yield all([
    call(instagramSagas),
    call(twitterSagas),
    call(facebookSagas),
    call(userSagas),
    call(settingsSagas),
  ]);
}
