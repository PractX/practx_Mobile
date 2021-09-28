import AppointmentActionTypes from './appointment.types';

export const bookAppointment = (data) => ({
  type: AppointmentActionTypes.BOOK_APPOINTMENT,
  payload: data,
});

export const getAppointmentStart = () => ({
  type: AppointmentActionTypes.GET_APPOINTMENTS_START,
});

export const getAppointmentSuccess = (data) => ({
  type: AppointmentActionTypes.GET_APPOINTMENTS_SUCCESS,
  payload: data,
});
export const setIsLoading = (action) => ({
  type: AppointmentActionTypes.SET_IS_lOADING,
  payload: action,
});
