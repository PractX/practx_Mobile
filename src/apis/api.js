import Axios from 'axios';
import {
  REACT_APP_API,
  REACT_APP_INSTAGRAM,
  REACT_APP_SINGLE_POST,
  REACT_APP_USERNAME_POST,
  REACT_APP_LIMIT,
  REACT_APP_HASHTAG_POST,
  REACT_APP_HIGHLIGHT_POST,
  REACT_APP_SINGLE_HIGHLIGHT_POST,
  REACT_APP_STORY_POST,
  REACT_APP_SAVE_DOWNLOAD,
  REACT_APP_GET_DOWNLOADS,
  REACT_APP_GET_SUBSCRIPTION,
  REACT_APP_WAVE_DL_API,
  REACT_APP_TWITTER_VIDEO,
  REACT_APP_FACEBOOK_VIDEO,
  REACT_APP_GET_USERNAME,
  REACT_APP_MONT,
} from '@env';

export const getUserNameApi = async (userId) => {
  // const headers = {
  //   'Content-Type': 'application/json',
  //   Authorization: 'Bearer ' + token,
  // };
  const url = REACT_APP_API + REACT_APP_GET_USERNAME + userId;
  const collectionsMap = await Axios.get(
    url,
    // { headers: headers }
  );
  return collectionsMap;
};

export const singlePostApi = async (url, token) => {
  const apiUrl = REACT_APP_API + REACT_APP_SINGLE_POST + url;
  const collectionsMap = await Axios.get(apiUrl);
  return collectionsMap;
};

export const usernamePostApi = async (username, numberOfPost, token) => {
  // const headers = {
  //   'Content-Type': 'application/json',
  //   Authorization: 'Bearer ' + token,
  // };
  const apiUrl =
    REACT_APP_API +
    REACT_APP_USERNAME_POST +
    username +
    REACT_APP_LIMIT +
    numberOfPost;
  const collectionsMap = await Axios.get(
    apiUrl,
    //   {
    //   headers: headers,
    // }
  );
  return collectionsMap;
};

export const hashtagPostApi = async (hashTag, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const url = REACT_APP_API + REACT_APP_HASHTAG_POST + hashTag;
  const collectionsMap = await Axios.get(
    url,
    //    {
    //   headers: headers,
    // }
  );
  return collectionsMap;
};

export const highlightPostApi = async (username, token) => {
  // const headers = {
  //   'Content-Type': 'application/json',
  //   Authorization: 'Bearer ' + token,
  // };
  const url = REACT_APP_API + REACT_APP_HIGHLIGHT_POST + username;
  const collectionsMap = await Axios.get(
    url,
    //   {
    //   headers: headers,
    // }
  );
  return collectionsMap;
};

export const storyPostApi = async (username, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const url = REACT_APP_API + REACT_APP_STORY_POST + username;
  const collectionsMap = await Axios.get(
    url,
    //    {
    //   headers: headers,
    // }
  );
  return collectionsMap;
};

export const idcodePostApi = async (idcode, token) => {
  // const headers = {
  //   'Content-Type': 'application/json',
  //   Authorization: 'Bearer ' + token,
  // };
  const url = REACT_APP_API + REACT_APP_SINGLE_HIGHLIGHT_POST + idcode;
  const collectionsMap = await Axios.get(
    url,
    // { headers: headers }
  );
  return collectionsMap;
};

export const shortcodePostApi = async (shortcode, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const url =
    REACT_APP_API + REACT_APP_SINGLE_POST + REACT_APP_INSTAGRAM + shortcode;
  const collectionsMap = await Axios.get(
    url,
    // { headers: headers }
  );
  return collectionsMap;
};

export const saveDownloadApi = async (token, downloadData) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const url = REACT_APP_API + REACT_APP_SAVE_DOWNLOAD;
  const data = downloadData;
  const collectionsMap = await Axios.patch(url, data, {
    headers: headers,
  });
  return collectionsMap;
};

export const getDownloadsApi = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const url = REACT_APP_API + REACT_APP_GET_DOWNLOADS;
  const collectionsMap = await Axios.get(url, { headers: headers });
  return collectionsMap;
};

export const getSubscriptionApi = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const url = REACT_APP_API + REACT_APP_GET_SUBSCRIPTION;
  const collectionsMap = await Axios.get(url, { headers: headers });
  return collectionsMap;
};

// Twitter Route
export const twitterVideoApi = async (url, token) => {
  const apiUrl =
    REACT_APP_WAVE_DL_API + REACT_APP_TWITTER_VIDEO + `?url=${url}`;
  const data = await Axios.get(apiUrl);
  return data;
};

// Facebook Route
export const facebookVideoApi = async (url, token) => {
  const apiUrl =
    REACT_APP_WAVE_DL_API + REACT_APP_FACEBOOK_VIDEO + `?url=${url}`;
  const data = await Axios.get(apiUrl);
  return data;
};

export const getMontApi = async () => {
  const apiUrl = REACT_APP_API + REACT_APP_MONT;
  console.log(REACT_APP_API + REACT_APP_MONT);
  const data = await Axios.get(apiUrl);
  return data;
};
