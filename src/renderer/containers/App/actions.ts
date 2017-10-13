import { SongData } from '../../components/Song';
import {
  ADD_SONG,
  PLAY_SONG,
  REMOVE_SONG,
} from './constants';

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

export function removeSong(index: number): AppAction {
  return {
    type: REMOVE_SONG,
    index,
  };
}

export function playSong(index: number): AppAction {
  return {
    type: PLAY_SONG,
    index,
  };
}
