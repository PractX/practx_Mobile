import { createSelector } from 'reselect';

const selectPractices = (state) => state.practice;

export const selectAllPractices = createSelector(
  [selectPractices],
  (practices) => practices.practices,
);
export const selectIsLoading = createSelector(
  [selectPractices],
  (practices) => practices.isLoading,
);
// export const selectToken = createSelector([selectUser], (user) => user.token);
