import {
  playSong,
  addSong,
  addSongs,
  editSong,
  editSongs,
  removeSong,
  clearSongs,
} from '../actions';

import {
  PLAY_SONG,
  ADD_SONG,
  ADD_SONGS,
  EDIT_SONG,
  EDIT_SONGS,
  REMOVE_SONG,
  CLEAR_SONGS,
} from '../constants';
import { SongData } from '../../../components/Song';

describe('App Actions', () => {
  const testSongs: SongData[] = [
    {
      key: 'test_key',
      id: 'test_id',
      title: 'test_title',
      thumb: 'test_thumb',
      duration: 60,
      playing: false,
    },

    {
      key: 'test_key2',
      id: 'test_id2',
      title: 'test_title2',
      thumb: 'test_thumb2',
      duration: 300,
      playing: true,
    },

    {
      key: 'test_key3',
      id: 'test_id3',
      title: 'test_title3',
      thumb: 'test_thumb3',
      duration: 5000,
      playing: false,
    }
  ];

  describe('playSong', () => {
    it('should return the correct type and the passed index', () => {
      const expectedResult = {
        type: PLAY_SONG,
        index: 3,
      };

      expect(playSong(3)).toEqual(expectedResult);
    });
  });

  describe('addSong', () => {
    it('should return the correct type and the passed song', () => {
      const expectedResult = {
        type: ADD_SONG,
        song: testSongs[1],
      };

      expect(addSong(testSongs[1])).toEqual(expectedResult);
    });
  });

  describe('addSongs', () => {
    it('should return the correct type and the passed array of songs', () => {
      const expectedResult = {
        type: ADD_SONGS,
        songs: testSongs,
      };

      expect(addSongs(testSongs)).toEqual(expectedResult);
    });
  });

  describe('editSong', () => {
    it('should return the correct type and the passed song', () => {
      const expectedResult = {
        type: EDIT_SONG,
        song: testSongs[1],
      };

      expect(editSong(testSongs[1])).toEqual(expectedResult);
    });
  });

  describe('editSongs', () => {
    it('should return the correct type and the passed array of songs', () => {
      const expectedResult = {
        type: EDIT_SONGS,
        songs: testSongs,
      };

      expect(editSongs(testSongs)).toEqual(expectedResult);
    });
  });

  describe('removeSong', () => {
    it('should return the correct type and the passed index', () => {
      const expectedResult = {
        type: REMOVE_SONG,
        index: 3,
      };

      expect(removeSong(3)).toEqual(expectedResult);
    });
  });

  describe('clearSongs', () => {
    it('should return the correct type', () => {
      const expectedResult = {
        type: CLEAR_SONGS,
      };

      expect(clearSongs()).toEqual(expectedResult);
    });
  });
});
