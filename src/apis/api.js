import Axios from 'axios';
import {
  REACT_APP_API,
  REACT_APP_PRACTICES,
  REACT_APP_JOIN_PRACTICES,
  REACT_APP_EDIT_PROFILE,
  REACT_APP_GET_PRACTICES_DMS,
} from '@env';
import { Platform } from 'react-native';

export const getPracticesApi = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url = REACT_APP_API + REACT_APP_PRACTICES;
  const collectionsMap = await Axios.get(url, { headers: headers });
  return collectionsMap;
};

export const getPracticesDmsApi = async (token, id) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url =
    REACT_APP_API +
    REACT_APP_PRACTICES +
    `/${id}` +
    REACT_APP_GET_PRACTICES_DMS;
  const collectionsMap = await Axios.get(url, { headers: headers });
  return collectionsMap;
};

export const getJoinedPracticeApi = async (token) => {
  // console.log(token);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url = REACT_APP_API + REACT_APP_JOIN_PRACTICES;
  const collectionsMap = await Axios.get(url, { headers: headers });
  return collectionsMap;
};

export const joinPracticeApi = async (practiceId, token) => {
  // console.log(token);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url =
    REACT_APP_API + REACT_APP_JOIN_PRACTICES + '/' + practiceId + '/request';
  const collectionsMap = await Axios.post(url, {}, { headers: headers });
  return collectionsMap;
};

// export const editProfileApi = async (token, data) => {
//   console.log(data);
//   const headers = {
//     'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
//     Authorization: token,
//   };
//   const collectionsMap = await Axios.patch(
//     REACT_APP_API + REACT_APP_EDIT_PROFILE,
//     data,
//     { headers: headers },
//   );
//   return collectionsMap;
// };

export const editProfileApi = async (token, data) => {
  // console.log(data.avatar);
  // console.log(data);

  const form = await new FormData();
  // const form2 = await new FormData();
  // form2.append('avatar', {
  //   uri:
  //     Platform.OS === 'android'
  //       ? `file:///${data.avatar.uri}`
  //       : `/private${data.avatar.uri}`,
  //   type: 'image/jpeg',
  //   name: 'image.jpg',
  // });
  // console.log(form2);
  // const newData = { ...data, avatar: form2 };

  // console.log(newData);
  for (const key in data) {
    form.append(key, data[key]);
  }

  const headers = {
    'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
    Authorization: token,
  };
  // console.log(form);
  const collectionsMap = await Axios.patch(
    REACT_APP_API + REACT_APP_EDIT_PROFILE,
    form,
    { headers },
  );
  // console.log(collectionsMap);
  return collectionsMap;
};
// Twitter Route
// export const twitterVideoApi = async (url, token) => {
//   const apiUrl =
//     REACT_APP_WAVE_DL_API + REACT_APP_TWITTER_VIDEO + `?url=${url}`;
//   const data = await Axios.get(apiUrl);
//   return data;
// };
