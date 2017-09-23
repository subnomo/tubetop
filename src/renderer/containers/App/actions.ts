import { ADD_SONG } from './constants';

import { SongData } from '../../components/Song';

export interface AppAction {
  type: string;
  song?: SongData;
}

export function addSong(song: AppAction['song']): AppAction {
  return {
    type: ADD_SONG,
    song,
  };
}
