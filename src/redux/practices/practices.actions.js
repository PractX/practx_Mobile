import PracticesActionTypes from './practices.types';

export const getPracticesAllStart = () => ({
  type: PracticesActionTypes.GET_ALL_PRACTICES_START,
});

export const getPracticesAllSuccess = (list) => ({
  type: PracticesActionTypes.GET_ALL_PRACTICES_SUCCESS,
  payload: list,
});

export const getPracticesAllFailure = (data) => ({
  type: PracticesActionTypes.GET_ALL_PRACTICES_FAILURE,
  payload: data,
});

export const getJoinedPracticesStart = () => ({
  type: PracticesActionTypes.GET_JOIN_PRACTICES_START,
});

export const getJoinedPracticesSuccess = (data) => ({
  type: PracticesActionTypes.GET_JOIN_PRACTICES_SUCCESS,
  payload: data,
});

export const getPracticesDmsStart = (data) => ({
  type: PracticesActionTypes.GET_PRACTICES_DMS_START,
  payload: data,
});
export const getPracticesDmsSuccess = (data) => ({
  type: PracticesActionTypes.GET_PRACTICES_DMS_SUCCESS,
  payload: data,
});

export const setPracticeId = (data) => ({
  type: PracticesActionTypes.SET_PRACTICE_ID,
  payload: data,
});

export const joinPractices = (id) => ({
  type: PracticesActionTypes.JOIN_PRACTICES,
  payload: id,
});

export const setLoading = (action) => ({
  type: PracticesActionTypes.SET_LOADING,
  payload: action,
});

export const setFilter = (data) => ({
  type: PracticesActionTypes.SET_FILTER,
  payload: data,
});

export const clearPracticeData = () => ({
  type: PracticesActionTypes.CLEAR_PRACTICE_DATA,
});
