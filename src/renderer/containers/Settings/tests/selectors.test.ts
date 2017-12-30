import { fromJS } from 'immutable';

import { selectSettings, selectYoutubeAPIKey } from '../selectors';

describe('selectSettings', () => {
  it('should select the settings state', () => {
    const settings = fromJS({});
    const mockedState = fromJS({
      settings: {
        settings,
      },
    });

    expect(selectSettings(mockedState)).toEqual(settings);
  });
});

describe('selectYoutubeAPIKey', () => {
  it('should select the YouTube API key', () => {
    const key = 'API_KEY';
    const mockedState = fromJS({
      settings: {
        settings: {
          youtubeAPIKey: key,
        },
      },
    });

    expect(selectYoutubeAPIKey(mockedState)).toEqual(key);
  });
});
