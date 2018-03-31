import { SongData } from 'components/Song';
import {
  PLAY_SONG,
  STOP_SONG,
  ADD_SONG,
  ADD_SONGS,
  EDIT_SONG,
  EDIT_SONGS,
  REMOVE_SONG,
  CLEAR_SONGS,
  SEARCH_SONG,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
} from './constants';

export interface AppAction {
  type: string;
  song?: Partial<SongData>;
  songs?: Partial<SongData>[];
  index?: number;
  query?: string;
  results?: any[];
  error?: any;
}

export function playSong(index: number): AppAction {
  return {
    type: PLAY_SONG,
    index,
  };
}

export function stopSong(index: number): AppAction {
  return {
    type: STOP_SONG,
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

export function editSong(song: Partial<SongData>): AppAction {
  return {
    type: EDIT_SONG,
    song,
  };
}

export function editSongs(songs: Partial<SongData>[]): AppAction {
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

export function searchSong(query: string): AppAction {
  return {
    type: SEARCH_SONG,
    query,
  };
}

export function searchSuccess(results: any[]): AppAction {
  return {
    type: SEARCH_SUCCESS,
    results,
  };
}

export function searchFailure(error: any): AppAction {
  return {
    type: SEARCH_FAILURE,
    error,
  };
}
