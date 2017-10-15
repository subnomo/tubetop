import { fromJS } from 'immutable';

import { SAVE_SETTINGS } from './constants';

const initialState = fromJS({
  settings: {},
});

export default function settingsReducer(state = initialState, action: any) {
  switch (action.type) {
    case SAVE_SETTINGS:
      return state
        .set('settings', action.settings);
    default:
      return state;
  }
}
