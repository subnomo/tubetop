import { createSelector } from 'reselect';

export const selectGlobal = (state: any) => state.get('global');

export const selectSongs = createSelector(
  selectGlobal,
  (globalState: any) => globalState.get('songs'),
);

export const selectSearch = createSelector(
  selectGlobal,
  (globalState: any) => globalState.get('search'),
);

export const selectSearchLoading = createSelector(
  selectSearch,
  (searchState: any) => searchState.get('loading'),
);

export const selectSearchError = createSelector(
  selectSearch,
  (searchState: any) => searchState.get('error'),
);

export const selectSearchResults = createSelector(
  selectSearch,
  (searchState: any) => searchState.get('results'),
);
