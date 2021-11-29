import PracticesActionTypes from './practices.types';

export const getPracticesAllStart = () => ({
  type: PracticesActionTypes.GET_ALL_PRACTICES_START,
});

export const setSearchHistory = history => ({
  type: PracticesActionTypes.SET_SEARCH_HISTORY,
  payload: history,
});

export const getPracticesAllSuccess = list => ({
  type: PracticesActionTypes.GET_ALL_PRACTICES_SUCCESS,
  payload: list,
});

export const getPracticesAllFailure = data => ({
  type: PracticesActionTypes.GET_ALL_PRACTICES_FAILURE,
  payload: data,
});

export const getJoinedPracticesStart = () => ({
  type: PracticesActionTypes.GET_JOIN_PRACTICES_START,
});

export const getJoinedPracticesSuccess = data => ({
  type: PracticesActionTypes.GET_JOIN_PRACTICES_SUCCESS,
  payload: data,
});

export const getPracticesDmsStart = data => ({
  type: PracticesActionTypes.GET_PRACTICES_DMS_START,
  payload: data,
});
export const getPracticesDmsSuccess = data => ({
  type: PracticesActionTypes.GET_PRACTICES_DMS_SUCCESS,
  payload: data,
});

export const getPracticeSubgroupsStart = id => ({
  type: PracticesActionTypes.GET_PRACTICE_SUBGROUPS_START,
  payload: id,
});
export const getPracticeSubgroupsSuccess = data => ({
  type: PracticesActionTypes.GET_PRACTICE_SUBGROUPS_SUCCESS,
  payload: data,
});

export const getPracticeStaffStart = id => ({
  type: PracticesActionTypes.GET_PRACTICE_STAFF_START,
  payload: id,
});

export const getAllPatientNotificationStart = () => ({
  type: PracticesActionTypes.GET_ALL_PATIENT_NOTIFICATION_START,
});
export const getAllPatientNotificationSuccess = data => ({
  type: PracticesActionTypes.GET_ALL_PATIENT_NOTIFICATION_SUCCESS,
  payload: data,
});

export const markNotification = id => ({
  type: PracticesActionTypes.MARK_NOTIFICATION,
  payload: id,
});

export const getPracticeStaffSuccess = data => ({
  type: PracticesActionTypes.GET_PRACTICE_STAFF_SUCCESS,
  payload: data,
});

export const leavePracticeStart = id => ({
  type: PracticesActionTypes.LEAVE_PRACTICE_START,
  payload: id,
});

export const chatWithPracticeStart = data => ({
  type: PracticesActionTypes.CHAT_WITH_PRACTICE_START,
  payload: data,
});

export const chatWithPracticeSuccess = data => ({
  type: PracticesActionTypes.CHAT_WITH_PRACTICE_SUCCESS,
  payload: data,
});

export const chatWithSubgroupStart = data => ({
  type: PracticesActionTypes.CHAT_WITH_SUBGROUP_START,
  payload: data,
});

export const chatWithSubgroupSuccess = data => ({
  type: PracticesActionTypes.CHAT_WITH_SUBGROUP_SUCCESS,
  payload: data,
});

export const setAllMessages = data => ({
  type: PracticesActionTypes.SET_ALL_MESSAGES,
  payload: data,
});

export const setPracticeId = data => ({
  type: PracticesActionTypes.SET_PRACTICE_ID,
  payload: data,
});

export const joinPractices = id => ({
  type: PracticesActionTypes.JOIN_PRACTICES,
  payload: id,
});

export const setLoading = action => ({
  type: PracticesActionTypes.SET_LOADING,
  payload: action,
});

export const setSearching = action => ({
  type: PracticesActionTypes.SET_SEARCHING,
  payload: action,
});

export const setFilter = data => ({
  type: PracticesActionTypes.SET_FILTER,
  payload: data,
});

export const setSearchData = data => ({
  type: PracticesActionTypes.SET_SEARCH_DATA,
  payload: data,
});

export const setSearchResult = data => ({
  type: PracticesActionTypes.SET_SEARCH_RESULT,
  payload: data,
});

export const setSignals = data => ({
  type: PracticesActionTypes.SET_SIGNALS,
  payload: data,
});

export const setChatChannels = data => ({
  type: PracticesActionTypes.SET_CHAT_CHANNELS,
  payload: data,
});

export const setCurrentChatChannel = data => ({
  type: PracticesActionTypes.SET_CURRENT_CHAT_CHANNEL,
  payload: data,
});

export const clearPracticeData = () => ({
  type: PracticesActionTypes.CLEAR_PRACTICE_DATA,
});
