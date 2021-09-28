import { takeLatest, put, all, call, delay } from 'redux-saga/effects';
import { select } from 'redux-saga/effects';
import AppointmentTypes from './appointment.types';
import {
  signUpApi,
  signInApi,
  signInByTokenApi,
  resendConfirmEmailApi,
  changePasswordApi,
  forgetPasswordApi,
  resetPasswordApi,
  verifyAccountApi,
} from '../../apis/auth';
import { paymentVerifyApi } from '../../apis/payment';
import {
  setToken,
  setDownloads,
  setMessage,
  setSubscription,
  signInSuccess,
  signInFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
  signUpFailure,
  bookAppointmentSusses,
  setIsLoading,
  getAppointmentSuccess,
} from './appointment.actions';
import {
  bookAppointmentApi,
  editProfileApi,
  getAllAppointmentsApi,
  getDownloadsApi,
  getSubscriptionApi,
} from '../../apis/api';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { clearPracticeData } from '../practices/practices.actions';

// const userActive = state => state.user.currentUser;
const userToken = (state) => state.user.token.key;
const userExpire = (state) => state.user.token.expire;

export function* isBookAppointment({
  payload: { title, description, date, practiceId },
}) {
  const token = yield select(userToken);
  try {
    console.log('Data', token);
    // const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    const result = yield bookAppointmentApi(
      practiceId,
      { title, description, date },
      token,
    ).then(function (response) {
      return response.data;
    });
    console.log(result);
    showMessage({
      message: result.message,
      type: 'success',
    });
    yield put(setIsLoading(false));
    yield delay(5000);

    // yield put(navigation.navigate('verifyAccount'));
  } catch (error) {
    console.log(error);
    console.log(error.response);
    yield put(setIsLoading(false));
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
  }
}

export function* willGetAppointments({}) {
  const token = yield select(userToken);
  try {
    console.log('Data', token);
    // const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    const result = yield getAllAppointmentsApi(token).then(function (response) {
      return response.data;
    });
    console.log(result);
    // showMessage({
    //   message: result.message,
    //   type: 'success',
    // });
    // yield put(navigation.navigate('verifyAccount'));
    yield put(getAppointmentSuccess(result.appointments));
    yield put(setIsLoading(false));
    // yield delay(5000);
  } catch (error) {
    console.log(error);
    console.log(error.response);
    yield put(setIsLoading(false));
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
  }
}
// export function* isResendConfirmEmail() {
//   const token = yield select(userToken);
//   try {
//     const result = yield resendConfirmEmailApi(token).then(function (response) {
//       return response.data.data;
//     });
//     if (result) {
//       // yield put(resendConfirmEmailSuccess(""));
//       yield put(setMessage({ type: 'success', message: result.message }));
//       yield delay(6000);
//       yield put(setMessage(null));
//     }
//   } catch (error) {
//     yield put(
//       setMessage({
//         type: 'error',
//         message: error.response
//           ? error.response.data.message || error.response.data.error
//           : 'Oops!!, Poor internet connection, Please check your connectivity, And try again',
//       }),
//     );
//     yield delay(8000);
//     yield put(setMessage(null));
//   }
// }

// export function* isChangePassword({ payload: { old_password, new_password } }) {
//   const token = yield select(userToken);
//   try {
//     const result = yield changePasswordApi(
//       token,
//       old_password,
//       new_password,
//     ).then(function (response) {
//       return response.data.data;
//     });
//     if (result) {
//       yield put(setMessage({ type: 'success', message: result.message }));
//       yield delay(6000);
//       yield put(setMessage(null));
//     }
//   } catch (error) {
//     yield put(
//       setMessage({
//         type: 'error',
//         message: error.response
//           ? error.response.data.message || error.response.data.error
//           : 'Oops!!, Poor internet connection, Please check your connectivity, And try again',
//       }),
//     );
//     yield delay(8000);
//     yield put(setMessage(null));
//   }
// }

export function* isResetPassword({ payload: { token, new_password } }) {
  try {
    const result = yield resetPasswordApi(token, new_password).then(function (
      response,
    ) {
      return response.data.data;
    });
    if (result) {
      yield put(setMessage({ type: 'success', message: result.message }));
      yield delay(6000);
      yield put(setMessage(null));
    }
  } catch (error) {
    yield put(
      setMessage({
        type: 'error',
        message: error.response
          ? error.response.data.message || error.response.data.error
          : 'Oops!!, Poor internet connection, Please check your connectivity, And try again',
      }),
    );
    yield delay(5000);
    yield put(setMessage(null));
  }
}

export function* isUserAuthenticated() {
  try {
    const expire = yield select(userExpire);
    if (new Date(expire) <= new Date(Date.now())) {
      const message = 'Login Session as expired, 🙏 Please re-login!!';
      yield put(setMessage({ type: 'error', message: message }));
      yield delay(3000);
      yield put(signOutStart());
      yield delay(2000);
      yield put(setMessage(null));
    }
  } catch (error) {
    yield delay(5000);
    yield put(setMessage(null));
  }
}

export function* signOut() {
  try {
    yield delay(2500);
    yield put(signOutSuccess());
    yield put(clearPracticeData());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

// export function* signInAfterSignUp({ payload: { user, additionalData } }) {
//   yield getSnapshotFromUserAuth(user, additionalData);
// }

// verifyAcct;
// export function* onSignInByTokenStart() {
//   yield takeLatest(UserActionTypes.SIGN_IN_BY_TOKEN_START, signByToken);
// }

export function* onBookAppointment() {
  yield takeLatest(AppointmentTypes.BOOK_APPOINTMENT, isBookAppointment);
}

export function* onGetAppointments() {
  yield takeLatest(
    AppointmentTypes.GET_APPOINTMENTS_START,
    willGetAppointments,
  );
}

export function* appointmentSagas() {
  yield all([call(onBookAppointment), call(onGetAppointments)]);
}
