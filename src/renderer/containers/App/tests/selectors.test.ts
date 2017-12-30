import { fromJS } from 'immutable';

import {
  selectGlobal,
  selectSongs,
  selectSearch,
  selectSearchLoading,
  selectSearchError,
  selectSearchResults,
} from '../selectors';

describe('selectGlobal', () => {
  it('should select the global state', () => {
    const globalState = fromJS({});
    const mockedState = fromJS({
      global: globalState,
    });

    expect(selectGlobal(mockedState)).toEqual(globalState);
  });
});

describe('selectSongs', () => {
  it('should select the current songs', () => {
    const songs = fromJS([]);
    const mockedState = fromJS({
      global: {
        songs,
      },
    });

    expect(selectSongs(mockedState)).toEqual(songs);
  });
});

describe('selectSearch', () => {
  it('should select the search', () => {
    const search = fromJS({});
    const mockedState = fromJS({
      global: {
        search,
      },
    });

    expect(selectSearch(mockedState)).toEqual(search);
  });
});

describe('selectSearchLoading', () => {
  it('should select the search.loading', () => {
    const search = fromJS({ loading: true });
    const mockedState = fromJS({
      global: {
        search,
      },
    });

    expect(selectSearchLoading(mockedState)).toEqual(true);
  });
});

describe('selectSearchError', () => {
  it('should select the search.error', () => {
    const search = fromJS({ error: true });
    const mockedState = fromJS({
      global: {
        search,
      },
    });

    expect(selectSearchError(mockedState)).toEqual(true);
  });
});

describe('selectSearchResults', () => {
  it('should select the search.results', () => {
    const search = fromJS({ results: [] });
    const mockedState = fromJS({
      global: {
        search,
      },
    });

    expect(selectSearchResults(mockedState)).toEqual(fromJS([]));
  });
});
