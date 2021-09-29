import { createSelector } from 'reselect';

const selectAppointment = (state) => state.appointment;

export const selectIsLoading = createSelector(
  [selectAppointment],
  (appointment) => appointment.isLoading,
);

export const selectAppointments = createSelector(
  [selectAppointment],
  (appointment) => appointment.appointments,
);
