import Axios from 'axios';
import {
  REACT_APP_API,
  REACT_APP_PRACTICES,
  REACT_APP_JOIN_PRACTICES,
} from '@env';

export const getPracticesApi = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url = REACT_APP_API + REACT_APP_PRACTICES;
  const collectionsMap = await Axios.get(url, { headers: headers });
  return collectionsMap;
};

export const joinPracticeApi = async (practiceId, token) => {
  console.log(token);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  const url =
    REACT_APP_API + REACT_APP_JOIN_PRACTICES + '/' + practiceId + '/request';
  const collectionsMap = await Axios.post(url, {}, { headers: headers });
  return collectionsMap;
};

// Twitter Route
// export const twitterVideoApi = async (url, token) => {
//   const apiUrl =
//     REACT_APP_WAVE_DL_API + REACT_APP_TWITTER_VIDEO + `?url=${url}`;
//   const data = await Axios.get(apiUrl);
//   return data;
// };
