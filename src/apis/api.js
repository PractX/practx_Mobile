import Axios from 'axios';
import {
  REACT_APP_API,
  REACT_APP_PRACTICES,
  REACT_APP_JOIN_PRACTICES,
  REACT_APP_EDIT_PROFILE,
  REACT_APP_GET_PRACTICES_DMS,
  REACT_APP_GET_SUBGROUPS,
  REACT_APP_SEARCH_PRACTICES,
  REACT_APP_GET_PRACTICES_STAFF,
  REACT_APP_GET_NOTIFICATION,
} from '@env';
import { Platform } from 'react-native';

export const getPracticesApi = async token => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url = REACT_APP_API + REACT_APP_PRACTICES;
  const collectionsMap = await Axios.get(url, { headers: headers });
  return collectionsMap;
};

export const getJoinedPracticeApi = async token => {
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

export const getPracticesDmsApi = async token => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url = REACT_APP_API + REACT_APP_GET_PRACTICES_DMS;
  const collectionsMap = await Axios.get(url, { headers: headers });
  return collectionsMap;
};

export const chatWithPracticeApi = async (practiceId, token) => {
  // console.log(token);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url =
    REACT_APP_API + REACT_APP_JOIN_PRACTICES + '/' + practiceId + '/dms';
  const collectionsMap = await Axios.post(url, {}, { headers: headers });
  return collectionsMap;
};

export const editProfileApi = async (token, data) => {
  // console.log(data.avatar);
  // console.log(data);

  const form = await new FormData();
  // const form2 = await new FormData();
  // form.append('avatar');
  data.avatar === undefined && delete data.avatar;
  const newData = data.avatar
    ? {
        ...data,
        avatar: {
          uri:
            Platform.OS === 'android'
              ? `${data.avatar.uri}`
              : `file://${data.avatar.uri}`,
          type: 'image/jpeg',
          name: data.avatar.fileName,
        },
      }
    : { ...data };
  for (const key in newData) {
    form.append(key, newData[key]);
  }

  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: token,
  };
  console.log(form);
  const collectionsMap = await Axios({
    method: 'patch',
    url: REACT_APP_API + REACT_APP_EDIT_PROFILE,
    headers: headers,
    data: form,
  });
  console.log(collectionsMap);
  return collectionsMap;
};

export const getPracticeSubGroupApi = async (token, practiceId) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url =
    REACT_APP_API +
    REACT_APP_PRACTICES +
    `/${practiceId}` +
    REACT_APP_GET_SUBGROUPS;
  const collectionsMap = await Axios.get(url, { headers: headers });
  return collectionsMap;
};

export const chatWithSubgroupApi = async (practiceId, subgroupId, token) => {
  // console.log(token);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url =
    REACT_APP_API +
    REACT_APP_JOIN_PRACTICES +
    '/' +
    practiceId +
    REACT_APP_GET_SUBGROUPS +
    '/' +
    subgroupId;
  const collectionsMap = await Axios.post(url, {}, { headers: headers });
  return collectionsMap;
};

export const getAllSubgroupApi = async token => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const apiUrl =
    REACT_APP_API + REACT_APP_JOIN_PRACTICES + REACT_APP_GET_SUBGROUPS;
  const data = await Axios.get(apiUrl, { headers: headers });
  return data;
};

export const getAllPracticeStaffApi = async (token, practiceId) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const apiUrl =
    REACT_APP_API +
    REACT_APP_JOIN_PRACTICES +
    '/' +
    practiceId +
    REACT_APP_GET_PRACTICES_STAFF;
  const data = await Axios.get(apiUrl, { headers: headers });
  return data;
};

export const searchPracticesApi = async (token, searchData) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url = REACT_APP_API + REACT_APP_SEARCH_PRACTICES + `${searchData}`;
  const collectionsMap = await Axios.get(url, { headers: headers });
  return collectionsMap;
};

export const leavePracticeApi = async (token, practiceId) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const apiUrl = REACT_APP_API + REACT_APP_JOIN_PRACTICES + '/' + practiceId;
  const data = await Axios.delete(apiUrl, { headers: headers });
  return data;
};

// APPOINTMENT ENDPOINTS

export const bookAppointmentApi = async (practiceId, data, token) => {
  // console.log(token);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url =
    REACT_APP_API +
    REACT_APP_JOIN_PRACTICES +
    '/' +
    practiceId +
    '/appointments';
  const collectionsMap = await Axios.post(url, data, { headers: headers });
  return collectionsMap;
};

export const getAllAppointmentsApi = async token => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const apiUrl = REACT_APP_API + REACT_APP_EDIT_PROFILE + '/appointments';
  const data = await Axios.get(apiUrl, { headers: headers });
  return data;
};

export const getAllNotificationsApi = async token => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const apiUrl = REACT_APP_API + REACT_APP_GET_NOTIFICATION;
  const data = await Axios.get(apiUrl, { headers: headers });
  return data;
};

export const viewAllNotificationsApi = async token => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const apiUrl = REACT_APP_API + REACT_APP_GET_NOTIFICATION;
  const data = await Axios.get(apiUrl, { headers: headers });
  return data;
};
