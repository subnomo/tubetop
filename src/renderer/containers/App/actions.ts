import { SongData } from '../../components/Song';
import {
  PLAY_SONG,
  ADD_SONG,
  ADD_SONGS,
  EDIT_SONG,
  EDIT_SONGS,
  REMOVE_SONG,
  CLEAR_SONGS,
} from './constants';

export interface AppAction {
  type: string;
  song?: SongData;
  songs?: SongData[];
  index?: number;
}

export function playSong(index: number): AppAction {
  return {
    type: PLAY_SONG,
    index,
  };
}

export function addSong(song: SongData): AppAction {
  return {
    type: ADD_SONG,
    song,
  };
}

export function addSongs(songs: SongData[]): AppAction {
  return {
    type: ADD_SONGS,
    songs,
  };
}

export function editSong(song: SongData): AppAction {
  return {
    type: EDIT_SONG,
    song,
  };
}

export function editSongs(songs: SongData[]): AppAction {
  return {
    type: EDIT_SONGS,
    songs,
  };
}

export function removeSong(index: number): AppAction {
  return {
    type: REMOVE_SONG,
    index,
  };
}

export function clearSongs(): AppAction {
  return {
    type: CLEAR_SONGS,
  };
}
