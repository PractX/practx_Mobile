import PracticesActionTypes from './practices.types';

const INITIAL_STATE = {
  practices: null,
  isLoading: null,
  isFetching: null,
  isSearching: null,
  filter: { opt1: true, opt2: true, opt3: true },
  joinedPractices: null,
  currentPracticeId: 0,
  practiceDms: null,
  practiceSubgroups: [],
  error: null,
  allMessages: [],
  searchResult: null,
  searchData: null,
  searchHistory: [],
};

const practicesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PracticesActionTypes.CLEAR_PRACTICE_DATA:
      return {
        ...state,
        practices: null,
        isLoading: null,
        isFetching: null,
        filter: { opt1: true, opt2: true, opt3: true },
        joinedPractices: null,
        currentPracticeId: 0,
        practiceDms: null,
        practiceSubgroups: [],
        allMessages: [],
        searchResult: null,
        searchData: null,
        searchHistory: [],
      };

    case PracticesActionTypes.SET_SEARCH_HISTORY:
      return {
        ...state,
        searchHistory: action.payload,
      };

    case PracticesActionTypes.SET_SEARCH_DATA:
      return {
        ...state,
        searchData: action.payload,
        searchResult: [],
        isSearching: true,
      };

    case PracticesActionTypes.SET_SEARCH_RESULT:
      return {
        ...state,
        searchResult: action.payload,
        isSearching: false,
      };

    case PracticesActionTypes.SET_SEARCHING:
      return {
        ...state,
        isSearching: action.payload,
      };

    case PracticesActionTypes.SET_ALL_MESSAGES:
      return {
        ...state,
        allMessages: action.payload,
      };
    case PracticesActionTypes.CHAT_WITH_PRACTICE_START:
      return {
        ...state,
        isFetching: true,
      };

    case PracticesActionTypes.CHAT_WITH_PRACTICE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoading: false,
        practiceDms: action.payload,
      };
    case PracticesActionTypes.SET_PRACTICE_ID:
      return {
        ...state,
        currentPracticeId: action.payload,
      };
    case PracticesActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case PracticesActionTypes.GET_PRACTICES_DMS_START:
      return {
        ...state,
        isFetching: true,
      };
    case PracticesActionTypes.GET_PRACTICES_DMS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoading: false,
        practiceDms: action.payload,
      };
    case PracticesActionTypes.GET_PRACTICE_SUBGROUPS_START:
      return {
        ...state,
        isFetching: true,
      };
    case PracticesActionTypes.GET_PRACTICE_SUBGROUPS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoading: false,
        practiceSubgroups: action.payload,
      };

    case PracticesActionTypes.GET_ALL_PRACTICES_START:
      return {
        ...state,
        isFetching: true,
      };
    case PracticesActionTypes.GET_ALL_PRACTICES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoading: false,
        practices: action.payload,
      };

    case PracticesActionTypes.GET_ALL_PRACTICES_FAILURE:
      return {
        ...state,
        isFetching: false,
        isLoading: false,
        error: action.payload,
      };

    case PracticesActionTypes.GET_JOIN_PRACTICES_START:
      return {
        ...state,
        isFetching: true,
      };
    case PracticesActionTypes.GET_JOIN_PRACTICES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoading: false,
        joinedPractices: action.payload,
      };
    case PracticesActionTypes.JOIN_PRACTICES:
      return {
        ...state,
        isFetching: false,
        isLoading: true,
      };
    case PracticesActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        isFetching: action.payload,
      };
    default:
      return state;
  }
};

export default practicesReducer;
