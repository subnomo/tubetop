import { fromJS } from 'immutable';

import { AppAction } from './actions';
import { SongData } from 'components/Song';
import {
  ADD_SONG,
  ADD_SONGS,
  PLAY_SONG,
  EDIT_SONG,
  EDIT_SONGS,
  REMOVE_SONG,
  CLEAR_SONGS,
  SEARCH_SONG,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
} from './constants';

const initialState = fromJS({
  songs: [],
  search: {
    loading: false,
    error: false,
    results: [],
  },
});

export default function appReducer(state = initialState, action: AppAction) {
  switch (action.type) {
    case PLAY_SONG:
      return state.set('songs', state.get('songs')
        .map((song: SongData, i: number) => {
          // Play given song, stop all others
          if (i === action.index) {
            return { ...song, playing: true };
          } else {
            return { ...song, playing: false };
          }
        })
      );
    case ADD_SONG:
      return state.set('songs', state.get('songs').push(action.song));
    case ADD_SONGS:
      return state.set('songs', state.get('songs').concat(action.songs));
    case EDIT_SONG:
      return state.set('songs', state.get('songs')
        .map((song: SongData) => {
          if (song.key === action.song.key) {
            return { ...song, ...action.song };
          } else {
            return song;
          }
        })
      );
    case EDIT_SONGS:
      return state.set('songs', state.get('songs')
        .map((song: SongData) => {
          for (let i = 0; i < action.songs.length; i++) {
            if (song.key === action.songs[i].key) {
              return { ...song, ...action.songs[i] };
            }
          }

          return song;
        })
      );
    case REMOVE_SONG:
      return state.set('songs', state.get('songs').delete(action.index));
    case CLEAR_SONGS:
      return state.set('songs', state.get('songs').clear());
    case SEARCH_SONG:
      return state
        .setIn(['search', 'loading'], true)
        .setIn(['search', 'error'], false);
    case SEARCH_SUCCESS:
      return state
        .setIn(['search', 'results'], fromJS(action.results))
        .setIn(['search', 'loading'], false);
    case SEARCH_FAILURE:
      return state
        .setIn(['search', 'error'], fromJS(action.error))
        .setIn(['search', 'loading'], false);
    default:
      return state;
  }
}
