import { fromJS } from 'immutable';

import appReducer from '../reducer';
import {
  playSong,
  addSong,
  addSongs,
  editSong,
  editSongs,
  removeSong,
  clearSongs,
  searchSong,
  searchSuccess,
  searchFailure,
} from '../actions';
import { SongData } from 'components/Song';

describe('appReducer', () => {
  let state: any;
  const testSongs: SongData[] = [
    {
      key: 'test_key',
      id: 'test_id',
      title: 'test_title',
      thumb: 'test_thumb',
      duration: 60,
      playing: false,
    },

    {
      key: 'test_key2',
      id: 'test_id2',
      title: 'test_title2',
      thumb: 'test_thumb2',
      duration: 300,
      playing: true,
    },

    {
      key: 'test_key3',
      id: 'test_id3',
      title: 'test_title3',
      thumb: 'test_thumb3',
      duration: 5000,
      playing: false,
    }
  ];

  beforeEach(() => {
    state = fromJS({
      songs: [],
      search: {
        loading: false,
        error: false,
        results: [],
      },
    });

    state = state.set('songs', state.get('songs').concat(testSongs));
  });

  it('should return the initial state', () => {
    const expectedResult = fromJS({
      songs: [],
      search: {
        loading: false,
        error: false,
        results: [],
      },
    });

    expect(appReducer(undefined, {} as any)).toEqual(expectedResult);
  });

  it('should handle the playSong action correctly', () => {
    const newSongs: any = appReducer(state, playSong(0)).get('songs');
    expect(newSongs.get(0).playing).toBe(true);
    expect(newSongs.get(1).playing).toBe(false);
    expect(newSongs.get(2).playing).toBe(false);
  });

  it('should handle the addSong action correctly', () => {
    const newSong: SongData = {
      key: 'test_key4',
      id: 'test_id4',
      title: 'test_title4',
      thumb: 'test_thumb4',
      duration: 200,
      playing: false,
    };

    const expectedResult = state.set('songs', state.get('songs').push(newSong));
    expect(appReducer(state, addSong(newSong))).toEqual(expectedResult);
  });

  it('should handle the addSongs action correctly', () => {
    const newSongs: SongData[] = [
      {
        key: 'test_key4',
        id: 'test_id4',
        title: 'test_title4',
        thumb: 'test_thumb4',
        duration: 200,
        playing: false,
      },

      {
        key: 'test_key5',
        id: 'test_id5',
        title: 'test_title5',
        thumb: 'test_thumb5',
        duration: 70,
        playing: false,
      },
    ];

    const expectedResult = state.set('songs', state.get('songs').concat(newSongs));
    expect(appReducer(state, addSongs(newSongs))).toEqual(expectedResult);
  });

  it('should handle the editSong action correctly', () => {
    const editedSong: Partial<SongData> = {
      key: testSongs[0].key,
      id: 'abc',
      title: 'abc',
      thumb: 'abc',
      duration: 0,
    };

    const expectedResult = state.set('songs', state.get('songs')
      .update(0, (v: SongData) => ({ ...v, ...editedSong }))
    );

    expect(appReducer(state, editSong(editedSong))).toEqual(expectedResult);
  });

  it('should handle the editSongs action correctly', () => {
    const editedSongs: Partial<SongData>[] = [
      {
        key: testSongs[0].key,
        id: 'abc',
        title: 'abc',
        thumb: 'abc',
        duration: 0,
      },

      {
        key: testSongs[1].key,
        id: 'def',
        title: 'def',
        thumb: 'def',
        duration: 30,
      },
    ];

    const expectedResult = state.set('songs', state.get('songs')
      .update(0, (v: SongData) => ({ ...v, ...editedSongs[0] }))
      .update(1, (v: SongData) => ({ ...v, ...editedSongs[1] }))
    );

    expect(appReducer(state, editSongs(editedSongs))).toEqual(expectedResult);
  });

  it('should handle the removeSong action correctly', () => {
    const index = 1;
    const expectedResult = state.set('songs', state.get('songs').delete(index));

    expect(appReducer(state, removeSong(index))).toEqual(expectedResult);
  });

  it('should handle the clearSongs action correctly', () => {
    const expectedResult = fromJS({
      songs: [],
      search: {
        loading: false,
        error: false,
        results: [],
      },
    });

    expect(appReducer(state, clearSongs())).toEqual(expectedResult);
  });

  it('should handle the searchSong action correctly', () => {
    const expectedResult = state
      .setIn(['search', 'loading'], true)
      .setIn(['search', 'error'], false);

    expect(appReducer(state, searchSong('abc'))).toEqual(expectedResult);
  });

  it('should handle the searchSuccess action correctly', () => {
    const resultsArray = [
      { kind: 'youtube#searchResults' },
    ];

    const expectedResult = state
      .setIn(['search', 'results'], fromJS(resultsArray))
      .setIn(['search', 'loading'], false);

    expect(appReducer(state, searchSuccess(resultsArray))).toEqual(expectedResult);
  });

  it('should handle the searchFailure action correctly', () => {
    const error = {
      response: {
        ok: false,
        status: 400,
      },
    };

    const expectedResult = state
      .setIn(['search', 'error'], fromJS(error))
      .setIn(['search', 'loading'], false);

    expect(appReducer(state, searchFailure(error))).toEqual(expectedResult);
  });
});
