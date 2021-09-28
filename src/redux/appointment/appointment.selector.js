import { createSelector } from 'reselect';

const selectAppointment = (state) => state.appointment;

export const selectIsLoading = createSelector(
  [selectAppointment],
  (appointment) => appointment.isLoading,
);
