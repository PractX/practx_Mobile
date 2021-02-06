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
