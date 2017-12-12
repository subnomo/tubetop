import { fromJS } from 'immutable';

import { SAVE_SETTINGS } from './constants';

const initialState = fromJS({
  settings: {
    youtubeAPIKey: 'AIzaSyDwXKHjw1IoqsLQNf4yykNj6YEn-VlsOa8',
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
