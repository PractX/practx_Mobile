import AppointmentActionTypes from './user.types';

const INITIAL_STATE = {
  appointments: null,
};

const appointmentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    //Either any of the cases
    case AppointmentActionTypes.EDIT_PROFILE:
      return {
        ...state,
        isLoading: true,
      };
    case AppointmentActionTypes.CHANGE_PASSWORD:
      return {
        ...state,
        isLoading: true,
      };
    case AppointmentActionTypes.VERIFY_ACCOUNT:
      return {
        ...state,
        isLoading: true,
        currentUser: null,
        token: null,
        error: null,
      };
    case AppointmentActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        // isLoading: true,
        error: null,
        // message: null,
        success: null,
        // paymentData: '',
        currentUser: action.payload,
      };
    case AppointmentActionTypes.SET_MY_DOWNLOADS:
      return {
        ...state,
        // isLoading: true,
        error: null,
        // message: null,
        success: null,
        // paymentData: '',
        myDownloads: action.payload,
      };
    case AppointmentActionTypes.CHECK_USER_SESSION:
      return {
        ...state,
        // isLoading: true,
        error: null,
        // message: null,
        success: null,
        // paymentData: '',
      };
    case AppointmentActionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.payload,
        error: null,
        success: null,
      };
    case AppointmentActionTypes.SET_DOWNLOADS:
      return {
        ...state,
        downloads: action.payload,
        error: null,
        success: null,
        isLoading: null,
      };
    case AppointmentActionTypes.SET_SUBSCRIPTION:
      return {
        ...state,
        subscription: action.payload,
        error: null,
        success: null,
      };
    case AppointmentActionTypes.SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
        error: null,
        success: null,
      };
    case AppointmentActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        message: null,
        error: null,
        success: null,
        paymentData: null,
      };
    case AppointmentActionTypes.SET_PAYMENT_DATA:
      return {
        ...state,
        message: null,
        paymentData: action.payload,
        isLoading: true,
        error: null,
        success: null,
      };

    case AppointmentActionTypes.USER_PAYMENT_START:
      return {
        ...state,
        message: null,
        isLoading: true,
        error: null,
        success: null,
      };

    case AppointmentActionTypes.USER_PAYMENT_SUCCESS:
      return {
        ...state,
        message: null,
        isLoading: false,
        error: null,
        success: null,
        // paymentData: null,
      };

    case AppointmentActionTypes.USER_PAYMENT_FAILURE:
      return {
        ...state,
        message: action.payload,
        isLoading: false,
        error: null,
        success: null,
        // paymentData: null,
      };
    case AppointmentActionTypes.FORGET_PASSWORD_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: null,
      };
    case AppointmentActionTypes.FORGET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        success: null,
      };
    case AppointmentActionTypes.RESEND_CONFIRM_EMAIL_START:
      return {
        ...state,
        isLoading: true,
        message: action.payload,
        error: null,
        success: null,
      };
    case AppointmentActionTypes.RESEND_CONFIRM_EMAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        message: action.payload,
        error: null,
        success: null,
      };
    case AppointmentActionTypes.SIGN_UP_START:
      return {
        ...state,
        isLoading: true,
        currentUser: null,
        token: null,
        error: null,
        success: null,
      };
    case AppointmentActionTypes.SIGN_OUT_START:
      return {
        ...state,
        isLoading: false,
        currentUser: null,
        subscription: null,
        downloads: null,
        myDownloads: null,
        token: null,
        error: null,
      };
    case AppointmentActionTypes.SIGN_UP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentUser: action.payload,
        error: null,
      };
    case AppointmentActionTypes.SIGN_IN_START:
      return {
        ...state,
        isLoading: true,
        currentUser: null,
        token: null,
        error: null,
      };
    case AppointmentActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentUser: action.payload,
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
