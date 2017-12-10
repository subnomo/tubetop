import { fromJS } from 'immutable';

import { IState } from '../index';
import settingsReducer from '../reducer';
import { saveSettings } from '../actions';

describe('settingsReducer', () => {
  let state: any;

  beforeEach(() => {
    state = fromJS({
      settings: {
        youtubeAPIKey: 'AIzaSyDwXKHjw1IoqsLQNf4yykNj6YEn-VlsOa8',
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

    const expectedResult = state.set('settings', settings);
    expect(settingsReducer(state, saveSettings(settings))).toEqual(expectedResult);
  });
});
