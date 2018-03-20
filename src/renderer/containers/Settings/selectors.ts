import { createSelector } from 'reselect';

export const selectSettings = (state: any) => state.get('settings').get('settings');

export const selectYoutubeAPIKey = createSelector(
  selectSettings,
  (settingsState: any) => settingsState.get('youtubeAPIKey'),
);
