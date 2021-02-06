import { takeLatest, put, all, call, delay, select } from 'redux-saga/effects';
import {
  getJoinedPracticeApi,
  getMontApi,
  getPracticesApi,
  joinPracticeApi,
} from '../../apis/api';
import PracticesActionTypes from './practices.types';
import { REACT_APP_MONT } from '@env';
import {
  getJoinedPracticesSuccess,
  getPracticesAllStart,
  getPracticesAllSuccess,
  setLoading,
} from './practices.actions';
import { showMessage } from 'react-native-flash-message';

// const userActive = state => state.user.currentUser;
const userToken = (state) => state.user.token.key;

export function* willGetAllPractices() {
  const token = yield select(userToken);
  console.log('going in aoi');
  try {
    const result = yield getPracticesApi(token).then(function (response) {
      return response.data;
    });
    console.log(result);
    yield put(getPracticesAllSuccess(result.practices));
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

export function* willGetJoinedPractices() {
  const token = yield select(userToken);
  console.log('going in aoi');
  try {
    const result = yield getJoinedPracticeApi(token).then(function (response) {
      return response.data.patient;
    });
    console.log(result);
    yield put(getJoinedPracticesSuccess(result.practices));
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

export function* willJoinPractices({ payload: practiceId }) {
  const token = yield select(userToken);
  console.log('going in aoi');
  console.log(token);
  try {
    const result = yield joinPracticeApi(practiceId, token).then(function (
      response,
    ) {
      return response.data;
    });
    console.log(result);
    showMessage({
      message: result.message,
      type: 'success',
    });
    yield put(getPracticesAllStart());
  } catch (error) {
    console.log(error.response);
    if (error.response) {
      showMessage({
        message: error.response.data.message,
        type: 'danger',
      });
    } else {
      showMessage({
        message: error.message,
        type: 'danger',
      });
    }
    yield put(setLoading(false));
  }
}

export function* onGetAllPractices() {
  yield takeLatest(
    PracticesActionTypes.GET_ALL_PRACTICES_START,
    willGetAllPractices,
  );
}
export function* onJoinPractices() {
  yield takeLatest(PracticesActionTypes.JOIN_PRACTICES, willJoinPractices);
}
export function* onGetJoinedPractices() {
  yield takeLatest(
    PracticesActionTypes.GET_JOIN_PRACTICES_START,
    willGetJoinedPractices,
  );
}

export function* practicesSagas() {
  yield all([
    call(onGetAllPractices),
    call(onGetJoinedPractices),
    call(onJoinPractices),
    // call(onSignUpSuccess),
  ]);
}
