import { takeLatest, put, all, call, delay, select } from 'redux-saga/effects';
import {
  chatWithPracticeApi,
  getJoinedPracticeApi,
  getMontApi,
  getPracticesApi,
  getPracticesDmsApi,
  getPracticeSubGroupApi,
  joinPracticeApi,
  searchPracticesApi,
} from '../../apis/api';
import PracticesActionTypes from './practices.types';
import { REACT_APP_MONT } from '@env';
import {
  getJoinedPracticesSuccess,
  getPracticesAllFailure,
  getPracticesAllStart,
  getPracticesAllSuccess,
  getPracticesDmsSuccess,
  getPracticeSubgroupsSuccess,
  setLoading,
  setSearchResult,
  setSearching,
  // setPracticeId,
} from './practices.actions';
import { showMessage } from 'react-native-flash-message';

// const userActive = state => state.user.currentUser;
const userToken = (state) => state.user.token.key;
const havePracticeId = (state) => state.practice.currentPracticeId;
const practiceSubgroups = (state) => state.practice.practiceSubgroups;

export function* willGetAllPractices() {
  const token = yield select(userToken);
  const currentPracticeId = yield select(havePracticeId);
  // console.log('Do have Id', currentPracticeId);
  // console.log('going in aoi');
  try {
    const result = yield getPracticesApi(token).then(function (response) {
      return response.data;
    });
    console.log(result);
    let data = yield result.practices.rows.filter(
      (item) => item.patients.length === 1,
    );
    if (currentPracticeId > 0 && data.length) {
      console.log('have the Id');
      let haveIt = yield data.reduce(
        (accumulator, item) => accumulator || item.id === currentPracticeId,
        false,
      );
      console.log(data);

      // haveIt ? console.log('there is') : yield put(setPracticeId(data[0].id));
    } else {
      console.log('Dont have the Id');
      console.log(data);
      // yield put(setPracticeId(data.length === 0 ? 0 : data[0].id));
    }

    yield put(getPracticesAllSuccess(result.practices));
  } catch (error) {
    console.log(error);
    let eMsg = '';
    if (error.response) {
      error.response.data.errors.map(function (i, err) {
        if (error.response.data.errors.length > 1) {
          eMsg += err + 1 + '. ' + i + '\n';
          console.log(eMsg);
        } else {
          eMsg += i;
          console.log(eMsg);
        }
      });
      showMessage({
        message: eMsg,
        type: 'danger',
      });
    } else {
      showMessage({
        message: error.message,
        type: 'danger',
      });
    }
    // showMessage({
    //   message: error.response ? error.response.data.errors : error.message,
    //   type: 'danger',
    // });
    // yield delay(2000);
    yield put(
      getPracticesAllFailure(
        error.response
          ? error.response.data.errors || error.response.data.errors
          : eMsg || 'Please check your connectivity, And try again',
      ),
    );
  }
}

export function* willSearchPractices({ payload: searchData }) {
  const token = yield select(userToken);
  // console.log('going in aoi');
  // yield put(setPracticeId(55));
  // console.log(practiceId);
  try {
    const result = yield searchPracticesApi(token, searchData).then(function (
      response,
    ) {
      return response.data;
    });
    console.log(result);
    // showMessage({
    //   message: result.message,
    //   type: 'success',
    // });
    yield put(setSearchResult(result.practices));
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
    yield put(setSearching(false));
  }
}

export function* willGetJoinedPractices() {
  const token = yield select(userToken);
  console.log('going in aoi');
  try {
    const result = yield getJoinedPracticeApi(token).then(function (response) {
      return response.data.patient;
    });
    console.log('Result__', result);
    // setPracticeId;
    yield put(getJoinedPracticesSuccess(result.practices));
  } catch (error) {
    console.log(error);
    console.log(error.response);
    yield put(setLoading(false));
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

export function* willGetPracticesDms() {
  const token = yield select(userToken);
  // console.log('going in aoi');
  // yield put(setPracticeId(55));
  // console.log(practiceId);
  try {
    const result = yield getPracticesDmsApi(token).then(function (response) {
      return response.data;
    });
    console.log(result);
    // showMessage({
    //   message: result.message,
    //   type: 'success',
    // });
    yield put(getPracticesDmsSuccess(result.dms));
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

export function* willGetPracticeSubgroup({ payload: practiceId }) {
  const token = yield select(userToken);
  const allSubGroups = yield select(practiceSubgroups);
  console.log('getting subgroups');
  console.log(practiceId);
  try {
    const result = yield getPracticeSubGroupApi(token, practiceId).then(
      function (response) {
        return response.data;
      },
    );
    // showMessage({
    //   message: result.message,
    //   type: 'success',
    // });
    let data = [
      ...allSubGroups,
      {
        practiceId: practiceId,
        groups: result.subgroups,
      },
    ];
    yield put(getPracticeSubgroupsSuccess(getUniqueListBy(data, 'practiceId')));
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

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

export function* willChatWithPractice({ payload: practiceId }) {
  const token = yield select(userToken);
  // console.log('going in aoi');
  // const currentPracticeId = yield select(havePracticeId);
  console.log(practiceId);
  try {
    const result = yield chatWithPracticeApi(practiceId, token).then(function (
      response,
    ) {
      return response.data;
    });
    console.log(result);
    // showMessage({
    //   message: result.message,
    //   type: 'success',
    // });
    // yield put(getPracticesDmsSuccess(result.dms));
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

export function* onSearchPractices() {
  yield takeLatest(PracticesActionTypes.SET_SEARCH_DATA, willSearchPractices);
}

export function* onJoinPractices() {
  yield takeLatest(PracticesActionTypes.JOIN_PRACTICES, willJoinPractices);
}
export function* onGetPracticesDms() {
  yield takeLatest(
    PracticesActionTypes.GET_PRACTICES_DMS_START,
    willGetPracticesDms,
  );
}
export function* onGetPracticeSubgroups() {
  yield takeLatest(
    PracticesActionTypes.GET_PRACTICE_SUBGROUPS_START,
    willGetPracticeSubgroup,
  );
}
export function* onChatWithPractice() {
  yield takeLatest(
    PracticesActionTypes.CHAT_WITH_PRACTICE_START,
    willChatWithPractice,
  );
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
    call(onSearchPractices),
    call(onGetJoinedPractices),
    call(onJoinPractices),
    call(onGetPracticesDms),
    call(onGetPracticeSubgroups),
    call(onChatWithPractice),
  ]);
}
