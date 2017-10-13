import { fromJS } from 'immutable';

import { AppAction } from './actions';
import { SongData } from '../../components/Song';
import {
  ADD_SONG,
  PLAY_SONG,
  REMOVE_SONG,
} from './constants';

const initialState = fromJS({
  songs: [],
});

export default function appReducer(state = initialState, action: AppAction) {
  switch (action.type) {
    case ADD_SONG:
      return state
        .set('songs', [...state.get('songs'), action.song]);
    case REMOVE_SONG:
      return state
        .set('songs', [
          ...state.get('songs').slice(0, action.index),
          ...state.get('songs').slice(action.index + 1),
        ]);
    case PLAY_SONG:
      return state.set('songs', state.get('songs').map((song: SongData, i: number) => {
        // Play given song, stop all others
        if (i === action.index) {
          return { ...song, playing: true };
        } else {
          return { ...song, playing: false };
        }
      }));
    default:
      return state;
  }
}
