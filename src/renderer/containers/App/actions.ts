import { ADD_SONG } from './constants';

import { SongData } from '../../components/Song';

export interface AppAction {
  type: string;
  song?: SongData;
}

export function addSong(song: SongData): AppAction {
  return {
    type: ADD_SONG,
    song,
  };
}
