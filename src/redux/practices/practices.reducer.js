import PracticesActionTypes from './practices.types';

const INITIAL_STATE = {
  practices: null,
  isLoading: null,
};

const practicesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PracticesActionTypes.GET_ALL_PRACTICES_START:
      return {
        ...state,
        isLoading: true,
      };
    case PracticesActionTypes.GET_ALL_PRACTICES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        practices: action.payload,
      };
    case PracticesActionTypes.JOIN_PRACTICES:
      return {
        ...state,
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
