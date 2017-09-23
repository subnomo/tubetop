import { fromJS } from 'immutable';

import { ADD_SONG } from './constants';
import { AppAction } from './actions';

const initialState = fromJS({
  songs: [],
});

export default function appReducer(state = initialState, action: AppAction) {
  switch (action.type) {
    case ADD_SONG:
      return state
        .set('songs', [...state.get('songs'), action.song]);
    default:
      return state;
  }
}
