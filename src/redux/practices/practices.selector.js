import { createSelector } from 'reselect';

const selectPractices = (state) => state.practice;

export const selectAllPractices = createSelector(
  [selectPractices],
  (practices) => {
    const { filter } = practices;
    // console.log(filter);
    if (practices.practices) {
      const data = practices.practices.rows.filter((item) => {
        // console.log(item);
        if (
          filter.opt1 === true &&
          filter.opt2 === false &&
          filter.opt3 === false
        ) {
          return item.patients.length === 0 && item.requests.length === 0;
        } else if (
          filter.opt1 === false &&
          filter.opt2 === true &&
          filter.opt3 === false
        ) {
          return item.patients.length === 0 && item.requests.length === 1;
        } else if (
          filter.opt1 === false &&
          filter.opt2 === false &&
          filter.opt3 === true
        ) {
          return item.patients.length === 1;
        } else if (
          filter.opt1 === true &&
          filter.opt2 === true &&
          filter.opt3 === false
        ) {
          return (
            (item.patients.length === 0 && item.requests.length === 0) ||
            (item.patients.length === 0 && item.requests.length === 1)
          );
        } else if (
          filter.opt1 === true &&
          filter.opt2 === false &&
          filter.opt3 === true
        ) {
          return (
            (item.patients.length === 0 && item.requests.length === 0) ||
            item.patients.length === 1
          );
        } else if (
          filter.opt1 === false &&
          filter.opt2 === true &&
          filter.opt3 === true
        ) {
          return (
            (item.patients.length === 0 && item.requests.length === 1) ||
            item.patients.length === 1
          );
        } else {
          return item;
        }

        // return practices.practices;
      });
      // console.log(data);
      return data;
    } else {
      return practices.practices;
    }
  },
);
export const selectFilter = createSelector(
  [selectPractices],
  (practices) => practices.filter,
);
export const selectIsLoading = createSelector(
  [selectPractices],
  (practices) => practices.isLoading,
);

export const selectIsFetching = createSelector(
  [selectPractices],
  (practices) => practices.isFetching,
);

export const selectIsSearching = createSelector(
  [selectPractices],
  (practices) => practices.isSearching,
);

export const selectJoinedPractices = createSelector(
  [selectPractices],
  (practices) => practices.joinedPractices,
);

export const selectCurrentPracticeId = createSelector(
  [selectPractices],
  (practices) => practices.currentPracticeId,
);

export const selectPracticeDms = createSelector(
  [selectPractices],
  (practices) => {
    if (practices.practiceDms) {
      const data = practices.practiceDms.filter(
        (item) => item.practiceId !== null,
      );
      return data;
    } else {
      return practices.practiceDms;
    }
  },
);

export const selectPracticeSubgroups = createSelector(
  [selectPractices],
  (practices) => practices.practiceSubgroups,
);

export const selectPracticeStaffs = createSelector(
  [selectPractices],
  (practices) => practices.practiceStaffs,
);

export const selectAllMessages = createSelector(
  [selectPractices],
  (practices) => practices.allMessages,
);

export const selectSearchResult = createSelector(
  [selectPractices],
  (practices) => practices.searchResult,
);
export const selectSearchData = createSelector(
  [selectPractices],
  (practices) => practices.searchData,
);

export const selectSearchHistory = createSelector(
  [selectPractices],
  (practices) => practices.searchHistory,
);

export const selectSignals = createSelector(
  [selectPractices],
  (practices) => practices.signals,
);

export const selectChatChannels = createSelector(
  [selectPractices],
  (practices) => practices.chatChannels,
);

export const selectCurrentChatChannel = createSelector(
  [selectPractices],
  (practices) => practices.currentChatChannel,
);
// joinedPractice;
// export const selectToken = createSelector([selectUser], (user) => user.token);
