import { fromJS } from 'immutable';

import { ADD_SONG, PLAY_SONG } from './constants';
import { AppAction } from './actions';
import { SongData } from '../../components/Song';

const initialState = fromJS({
  songs: [],
});

export default function appReducer(state = initialState, action: AppAction) {
  switch (action.type) {
    case ADD_SONG:
      return state
        .set('songs', [...state.get('songs'), action.song]);
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
