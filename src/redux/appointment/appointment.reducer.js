import AppointmentActionTypes from './appointment.types';

const INITIAL_STATE = {
  isLoading: false,
  appointments: null,
};

const appointmentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    //Either any of the cases
    case AppointmentActionTypes.BOOK_APPOINTMENT:
      return {
        ...state,
        isLoading: true,
      };

    case AppointmentActionTypes.GET_APPOINTMENTS_START:
      return {
        ...state,
        isLoading: true,
      };

    case AppointmentActionTypes.GET_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        appointments: action.payload,
        isLoading: false,
      };

    case AppointmentActionTypes.SET_IS_lOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };
    case AppointmentActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        downloads: null,
        myDownloads: null,
        subscription: null,
        message: null,
        token: null,
        success: null,
        error: null,
        isLoading: null,
        confirmMessage: null,
        paymentData: null,
      };
    case AppointmentActionTypes.SIGN_IN_FAILURE:
    case AppointmentActionTypes.SIGN_OUT_FAILURE:
    case AppointmentActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default appointmentReducer;
