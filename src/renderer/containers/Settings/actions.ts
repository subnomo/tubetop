import { SAVE_SETTINGS } from './constants';

export function saveSettings(settings: any) {
  return {
    type: SAVE_SETTINGS,
    settings,
  };
}
