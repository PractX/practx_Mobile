import { takeLatest, put, all, call, delay } from 'redux-saga/effects';
import { select } from 'redux-saga/effects';
import UserActionTypes from './user.types';
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
  signUpSuccess,
  forgetPasswordSuccess,
  userPaymentFailure,
  setLoading,
} from './user.actions';
import {
  editProfileApi,
  getDownloadsApi,
  getSubscriptionApi,
} from '../../apis/api';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { clearPracticeData } from '../practices/practices.actions';

// const userActive = state => state.user.currentUser;
const userToken = (state) => state.user.token.key;
const userExpire = (state) => state.user.token.expire;

export function* signUp({
  payload: { email, firstname, lastname, dob, mobileNo, password, navigation },
}) {
  try {
    console.log(email);
    // const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    const result = yield signUpApi(
      email,
      firstname,
      lastname,
      dob,
      mobileNo,
      password,
    ).then(function (response) {
      return response.data;
    });
    console.log(result);
    showMessage({
      message: result.message,
      type: 'success',
    });
    yield delay(5000);
    // yield put(signUpSuccess(result.patient));
    yield put(navigation.navigate('verifyAccount'));
  } catch (error) {
    console.log(error);
    console.log(error.response);
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

    yield put(
      signUpFailure(
        error.response
          ? error.response.data.errors || error.response.data.errors
          : 'Oops!!, Poor internet connection, Please check your connectivity, And try again',
      ),
    );
  }
}

// export function* getSnapshotFromUserAuth(userAuth) {
//   try {
//     yield put(signInSuccess(userAuth));
//   } catch (error) {
//     yield put(
//       signInFailure(
//         error.response
//           ? error.response.data.message || error.response.data.error
//           : 'Oops!!, Poor internet connection, Please check your connectivity, And try again',
//       ),
//     );
//   }
// }

export function* signIn({ payload: { email, password } }) {
  console.log('I am here');
  console.log(email, 'and');
  try {
    const result = yield signInApi(email, password).then(function (response) {
      return response.data;
    });
    console.log(result);
    const token = {
      key: result.token,
      expire: tokenExpiration(),
    };
    if (result) {
      console.log(result);
      showMessage({
        message: result.message,
        type: 'success',
      });
      yield delay(500);
      yield put(setToken(token));
      yield yield put(signInSuccess(result.patient));
    }
  } catch (error) {
    // console.log(error.response.data);
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
    // yield delay(1000);
    yield put(
      signInFailure(
        error.response
          ? error.response.data.errors || error.response.data.errors
          : 'Sign in failed, Please check your connectivity, And try again',
      ),
    );
  }
}

export function* verifyAcct({ payload: verificationKey }) {
  console.log(verificationKey);
  try {
    const result = yield verifyAccountApi(verificationKey).then(function (
      response,
    ) {
      return response.data;
    });
    console.log(result);
    const token = {
      key: result.token,
      expire: tokenExpiration(),
    };
    if (result) {
      console.log(result);
      showMessage({
        message: result.message,
        type: 'success',
      });
      yield delay(2000);
      showMessage({
        message: 'Logging In...',
        type: 'success',
      });
      yield delay(3000);
      showMessage({
        message: 'Login successful!',
        type: 'success',
      });
      yield delay(3000);
      yield put(setToken(token));
      yield put(signInSuccess(result.patient));
    }
  } catch (error) {
    console.log(error.response);
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
    yield delay(2000);
    yield put(
      signInFailure(
        error.response
          ? error.response.data.errors || error.response.data.errors
          : 'Sign in failed, Please check your connectivity, And try again',
      ),
    );
  }
}

export function* willEditProfile({ payload: profileDetails }) {
  // console.log(profileDetails);
  const token = yield select(userToken);
  console.log(token);
  try {
    // console.log(email);
    // const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    const result = yield editProfileApi(token, profileDetails).then(function (
      response,
    ) {
      return response.data;
    });
    console.log(result);
    showMessage({
      message: 'Added new changes',
      type: 'success',
    });
    // yield delay(5000);
    yield yield put(signInSuccess(result.patient));
    // yield put(navigation.navigate('verifyAccount'));
  } catch (error) {
    console.log(error);
    console.log(error.response);
    let eMsg = '';
    if (error.response) {
      if (error.response.data.errors) {
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
          message: error.response.data.includes('Too Large')
            ? 'Profile Image file too large'
            : error.response.data,
          type: 'danger',
        });
      }
    } else {
      showMessage({
        message: error.message,
        type: 'danger',
      });
    }

    yield put(
      signUpFailure(
        error.response
          ? error.response.data.errors ||
            error.response.data.errors ||
            error.response.data.includes('Too Large')
            ? 'Profile Image file too large'
            : error.response.data
          : 'Oops!!, Poor internet connection, Please check your connectivity, And try again',
      ),
    );
  }
}

export function* willChangePassword({ payload: passwordDetails }) {
  // console.log(profileDetails);
  const token = yield select(userToken);
  console.log(passwordDetails);
  try {
    // console.log(email);
    // const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    const result = yield changePasswordApi(token, passwordDetails).then(
      function (response) {
        return response.data;
      },
    );
    console.log(result);
    showMessage({
      message: 'Password was changed successfully',
      type: 'success',
    });
    // yield delay(5000);
    yield yield put(setLoading(false));
    // yield put(navigation.navigate('verifyAccount'));
  } catch (error) {
    console.log(error);
    console.log(error.response);
    let eMsg = '';
    if (error.response) {
      if (error.response.data.errors) {
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
          message: error.response.data.includes('Too Large')
            ? 'Profile Image file too large'
            : error.response.data,
          type: 'danger',
        });
      }
    } else {
      showMessage({
        message: error.message,
        type: 'danger',
      });
    }

    yield put(
      signUpFailure(
        error.response
          ? error.response.data.errors ||
            error.response.data.errors ||
            error.response.data.includes('Too Large')
            ? 'Profile Image file too large'
            : error.response.data
          : 'Oops!!, Poor internet connection, Please check your connectivity, And try again',
      ),
    );
  }
}

export function* isForgetPassword({ payload: email }) {
  console.log(email);
  try {
    const result = yield forgetPasswordApi(email).then(function (response) {
      return response.data;
    });
    if (result) {
      console.log(result);
      showMessage({
        message: result.message,
        type: 'success',
      });
      yield delay(5000);
      yield put(forgetPasswordSuccess());
      // yield put(setMessage({ type: 'success', message: result.message }));
      // yield delay(8000);
      // yield put(setMessage(null));
    }
  } catch (error) {
    console.log(error.response);
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
    yield delay(2000);
    yield put(
      signInFailure(
        error.response
          ? error.response.data.errors || error.response.data.errors
          : 'Sign in failed, Please check your connectivity, And try again',
      ),
    );
  }
}

// export function* signByToken({ payload: token }) {
//   try {
//     const result = yield signInByTokenApi(token).then(function (response) {
//       return response.data.data;
//     });
//     const tokens = {
//       key: result.token,
//       expire: tokenExpiration(),
//     };
//     if (result) {
//       const download = yield getDownloadsApi(tokens.key).then(function (
//         response,
//       ) {
//         return response.data.data;
//       });
//       const subscription = yield getSubscriptionApi(tokens.key).then(function (
//         response,
//       ) {
//         return response.data.data;
//       });
//       yield put(setToken(tokens));
//       yield put(setSubscription(subscription.subscription));
//       yield put(setDownloads(download.downloads));
//       yield put(signInSuccess(result.user));
//     }
//   } catch (error) {
//     yield put(
//       signInFailure(
//         error.response
//           ? error.response.data.message || error.response.data.error
//           : 'Oops!!, Poor internet connection, Please check your connectivity, And try again',
//       ),
//     );
//   }
// }

const tokenExpiration = () => {
  const loginExp = new Date();
  const timeExp = loginExp.setHours(loginExp.getHours() + 12);
  // const timeExp = loginExp.setSeconds(loginExp.getSeconds() + 10);
  const result = new Date(timeExp);
  return result;
};

export function* isResendConfirmEmail() {
  const token = yield select(userToken);
  try {
    const result = yield resendConfirmEmailApi(token).then(function (response) {
      return response.data.data;
    });
    if (result) {
      // yield put(resendConfirmEmailSuccess(""));
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
    yield delay(8000);
    yield put(setMessage(null));
  }
}

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

export function* makePayment({ payload: txref }) {
  const token = yield select(userToken);

  try {
    const result = yield paymentVerifyApi(token, txref).then(function (
      response,
    ) {
      return response.data.data;
    });
    yield put(setSubscription(result.subscription));
    yield put(signInSuccess(result.user));
    yield put(setMessage({ type: 'success', message: result.message }));
    yield delay(6000);
    yield put(setMessage(null));
  } catch (error) {
    // yield put(())
    yield put(
      userPaymentFailure({
        type: 'error',
        message: error.response
          ? error.response.data.message || error.response.data.error
          : 'Oops!!, Poor internet connection, Please check your connectivity, And try again',
      }),
    );
    // yield delay(6000);
    // yield put(setMessage(null));
  }
}

// export function* signInAfterSignUp({ payload: { user, additionalData } }) {
//   yield getSnapshotFromUserAuth(user, additionalData);
// }

export function* onSignInStart() {
  yield takeLatest(UserActionTypes.SIGN_IN_START, signIn);
}
export function* OnVerifyAccount() {
  yield takeLatest(UserActionTypes.VERIFY_ACCOUNT, verifyAcct);
}

export function* onEditProfileStart() {
  yield takeLatest(UserActionTypes.EDIT_PROFILE, willEditProfile);
}

export function* onChangePasswordStart() {
  yield takeLatest(UserActionTypes.CHANGE_PASSWORD, willChangePassword);
}

// verifyAcct;
// export function* onSignInByTokenStart() {
//   yield takeLatest(UserActionTypes.SIGN_IN_BY_TOKEN_START, signByToken);
// }

export function* onResendConfirmEmail() {
  yield takeLatest(
    UserActionTypes.RESEND_CONFIRM_EMAIL_START,
    isResendConfirmEmail,
  );
}
export function* onForgetPassword() {
  yield takeLatest(UserActionTypes.FORGET_PASSWORD_START, isForgetPassword);
}

export function* onResetPassword() {
  yield takeLatest(UserActionTypes.RESET_PASSWORD, isResetPassword);
}

export function* onCheckUserSession() {
  yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

// export function* onSignUpSuccess() {
//   yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
// }

export function* userSagas() {
  yield all([
    call(onSignInStart),
    call(OnVerifyAccount),
    call(onEditProfileStart),
    call(onChangePasswordStart),
    // call(onSignInByTokenStart),
    call(onResendConfirmEmail),
    call(onForgetPassword),
    call(onResetPassword),
    call(onCheckUserSession),
    call(onSignOutStart),
    call(onSignUpStart),
    // call(onSignUpSuccess),
  ]);
}
