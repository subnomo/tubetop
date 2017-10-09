import { ADD_SONG, PLAY_SONG } from './constants';

import { SongData } from '../../components/Song';

export interface AppAction {
  type: string;
  song?: SongData;
  index?: number;
}

export function addSong(song: SongData): AppAction {
  return {
    type: ADD_SONG,
    song,
  };
}

export function playSong(index: number): AppAction {
  return {
    type: PLAY_SONG,
    index,
  };
}
