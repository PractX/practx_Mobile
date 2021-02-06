import PracticesActionTypes from './practices.types';

const INITIAL_STATE = {
  practices: null,
  isLoading: null,
  isFetching: null,
  filter: { opt1: true, opt2: true, opt3: true },
  joinedPractices: null,
};

const practicesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PracticesActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
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
      };
    default:
      return state;
  }
};

export default practicesReducer;
