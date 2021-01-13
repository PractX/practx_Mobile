import { takeLatest, put, all, call, delay } from 'redux-saga/effects';
import { getMontApi } from '../../apis/api';
import SettingsActionTypes from './settings.types';
// import { select } from 'redux-saga/effects';
// const userActive = state => state.user.currentUser;
// const userToken = (state) => state.user.token.key;
import { REACT_APP_MONT } from '@env';
import { setMont } from './settings.actions';

export function* getMontNow() {
  console.log('Hellow', REACT_APP_MONT);
  console.log('going in aoi');
  try {
    const result = yield getMontApi().then(function (response) {
      return response.data.data;
    });
    console.log(result[0]);
    yield put(setMont(result[0]));
  } catch (error) {
    console.log(error.response);
    // yield put(
    //   signInFailure(
    //     error.response
    //       ? error.response.data.message || error.response.data.error
    //       : 'Sign in failed, Please check your connectivity, And try again',
    //   ),
    // );
  }
}

export function* onGetMont() {
  yield takeLatest(SettingsActionTypes.GET_MONT, getMontNow);
}

export function* settingsSagas() {
  yield all([
    call(onGetMont),
    // call(onSignUpSuccess),
  ]);
}
