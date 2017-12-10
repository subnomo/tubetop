import { IState } from '../index';
import { saveSettings } from '../actions';
import { SAVE_SETTINGS } from '../constants';

describe('Settings Actions', () => {
  describe('saveSettings', () => {
    it('should return the correct type and the passed settings', () => {
      const settings: IState = {
        youtubeAPIKey: 'test_youtube_api_key',
      };

      const expectedResult = {
        type: SAVE_SETTINGS,
        settings,
      };

      expect(saveSettings(settings)).toEqual(expectedResult);
    });
  });
});
