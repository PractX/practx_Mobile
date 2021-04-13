import Axios from 'axios';
import {
  REACT_APP_API,
  REACT_APP_SIGNUP,
  REACT_APP_SIGNIN,
  REACT_APP_VERIFY,
  REACT_APP_FORGET_PASSWORD,
  REACT_APP_CHANGE_PASSWORD,
} from '@env';
export const signUpApi = async (
  email,
  firstname,
  lastname,
  dob,
  mobileNo,
  password,
) => {
  const headers = {
    'Content-Type': 'multipart/form-data,',
  };
  const collectionsMap = await Axios.post(
    REACT_APP_API + REACT_APP_SIGNUP,
    {
      email,
      firstname,
      lastname,
      dob,
      mobileNo,
      password,
    },
    headers,
  );
  return collectionsMap;
};

export const signInApi = async (email, password) => {
  console.log(password);
  const collectionsMap = await Axios.post(REACT_APP_API + REACT_APP_SIGNIN, {
    email: email,
    password: password,
  });
  return collectionsMap;
};

export const verifyAccountApi = async (verificationKey) => {
  console.log(verificationKey);
  const collectionsMap = await Axios.post(REACT_APP_API + REACT_APP_VERIFY, {
    verificationKey: verificationKey,
  });
  return collectionsMap;
};

export const forgetPasswordApi = async (email) => {
  const url = REACT_APP_API + REACT_APP_FORGET_PASSWORD;
  const collectionsMap = await Axios.post(url, { email });
  return collectionsMap;
};

export const changePasswordApi = async (
  token,
  { oldPassword, newPassword },
) => {
  console.log(newPassword);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const collectionsMap = await Axios.post(
    REACT_APP_API + REACT_APP_CHANGE_PASSWORD,
    { oldPassword, newPassword },
    { headers: headers },
  );
  return collectionsMap;
};
// export const signInByTokenApi = async (token) => {
//   const collectionsMap = await Axios.post(
//     REACT_APP_API + REACT_APP_SIGNBYTOKEN,
//     {
//       token,
//     },
//   );
//   return collectionsMap;
// };

// export const resendConfirmEmailApi = async (token) => {
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: 'Bearer ' + token,
//   };
//   const url = REACT_APP_API + REACT_APP_RESEND_CONFIRM_EMAIL;
//   const collectionsMap = await Axios.get(url, {
//     headers: headers,
//   });
//   return collectionsMap;
// };

// export const changePasswordApi = async (token, old_password, new_password) => {
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: 'Bearer ' + token,
//   };
//   const url = REACT_APP_API + REACT_APP_CHANGE_PASSWORD;
//   const data = { old_password, new_password };
//   const collectionsMap = await Axios.patch(url, data, {
//     headers: headers,
//   });
//   return collectionsMap;
// };

// export const resetPasswordApi = async (token, password) => {
//   const collectionsMap = await Axios.patch(
//     REACT_APP_API + REACT_APP_RESET_PASSWORD + token,
//     {
//       password,
//     },
//   );
//   return collectionsMap;
// };
