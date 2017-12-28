import { fromJS } from 'immutable';

import { IState } from '..';
import settingsReducer from '../reducer';
import { saveSettings } from '../actions';
import { YOUTUBE_API_KEY } from 'utils/keys';

describe('settingsReducer', () => {
  let state: any;

  beforeEach(() => {
    state = fromJS({
      settings: {
        youtubeAPIKey: YOUTUBE_API_KEY,
      },
    });
  });

  it('should return the initial state', () => {
    expect(settingsReducer(undefined, {})).toEqual(state);
  });

  it('should handle the saveSettings action correctly', () => {
    const settings: IState = {
      youtubeAPIKey: 'test_youtube_api_key',
    };

    const expectedResult = state.set('settings', state.get('settings')
      .merge(settings));

    expect(settingsReducer(state, saveSettings(settings))).toEqual(expectedResult);
  });
});
