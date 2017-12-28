import { fromJS } from 'immutable';

import { SAVE_SETTINGS } from './constants';
import { YOUTUBE_API_KEY } from 'utils/keys';

const initialState = fromJS({
  settings: {
    youtubeAPIKey: YOUTUBE_API_KEY,
  },
});

export default function settingsReducer(state = initialState, action: any) {
  switch (action.type) {
    case SAVE_SETTINGS:
      return state.set('settings', state.get('settings').merge(action.settings));
    default:
      return state;
  }
}
