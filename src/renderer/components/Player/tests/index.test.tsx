import * as React from 'react';
import { mount, shallow, ReactWrapper, ShallowWrapper } from 'enzyme';
import { fromJS } from 'immutable';
import { getInfo } from 'ytdl-core';
import * as Slider from 'rc-slider/lib/Slider';
import VolumeMute from 'material-ui-icons/VolumeMute';
import VolumeDown from 'material-ui-icons/VolumeDown';
import VolumeUp from 'material-ui-icons/VolumeUp';
import RepeatIcon from 'material-ui-icons/Repeat';
import RepeatOne from 'material-ui-icons/RepeatOne';

import { Player, mapStateToProps, Repeat } from '..';
import { Order } from '../util';
import {
  ActiveIcon,
  PlayerContainer,
  TimerContainer,
  Controls,
  VolumeContainer,
} from '../styles';
import { SongData } from 'components/Song';
import { playSong, stopSong, clearSongs } from 'containers/App/actions';

// Mock functions

jest.mock('electron', () => ({
  ipcRenderer: {
    on: jest.fn((event: string, cb: () => void) => {}),
  },
}));

jest.mock('ytdl-core', () => ({
  getInfo: jest.fn((id: string, cb: (err: any, info: any) => void) => {
    const info = {
      formats: [
        {
          audioBitrate: 160,
          url: 'http://example.com/',
        },

        {
          audioBitrate: 120,
          url: 'http://example.com/',
        },
      ],
    };

    cb(null, info);
  }),

  filterFormats: jest.fn((formats: any[], filter: string) => {
    return formats;
  }),
}));

(window as any).HTMLAudioElement.prototype.play = () => {};
(window as any).HTMLAudioElement.prototype.pause = () => {};

describe('<Player />', () => {
  let dispatch: jest.Mock<{}>;
  let testSongs: SongData[]
  let playerComponent: ReactWrapper<any, any>;

  beforeEach(() => {
    dispatch = jest.fn();

    testSongs = [
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

    playerComponent = mount(
      <Player dispatch={dispatch} songs={[]} />
    );

    playerComponent.setProps({
      dispatch,
      songs: [...testSongs],
    });
  });

  describe('componentWillReceiveProps', () => {
    it('should play new song on song change', () => {
      const spy = jest.spyOn(playerComponent.instance() as any, 'play');

      testSongs[1].playing = false;
      testSongs[2].playing = true;

      const newProps = {
        dispatch,
        songs: testSongs,
      };

      playerComponent.setProps(newProps);
      const state = playerComponent.state();

      expect(state.current).toBe(2);
      expect(state.currentKey).toBe(testSongs[2].key);
      expect(spy).toHaveBeenCalledWith(newProps);
    });

    it('should reset state with no new songs', () => {
      const spy = jest.spyOn(playerComponent.instance() as any, 'reset');

      playerComponent.setProps({
        songs: [],
      });

      expect(spy).toHaveBeenCalled();
    });

    it('should update current index when songs are reordered', () => {
      const temp = testSongs[1];
      testSongs[1] = testSongs[2];
      testSongs[2] = temp;

      const newProps = {
        dispatch,
        songs: testSongs,
      };

      playerComponent.setProps(newProps);
      expect(playerComponent.state().current).toBe(2);
    });

    it('should reset state when songs stopped', () => {
      const spy = jest.spyOn(playerComponent.instance() as any, 'reset');

      testSongs[1].playing = false;

      const newProps = {
        dispatch,
        songs: testSongs,
      };

      playerComponent.setProps(newProps);
      expect(spy).toHaveBeenCalled();
    });

    it('should update order when a song is removed', () => {
      testSongs.pop();

      const newProps = {
        dispatch,
        songs: testSongs,
      };

      const oldOrder = playerComponent.state().order;

      playerComponent.setProps(newProps);

      const newOrder = playerComponent.state().order;
      expect(oldOrder).not.toEqual(newOrder);
    });

    it('should update order when new song is added', () => {
      testSongs.push({
        key: 'test_key4',
        id: 'test_id4',
        title: 'test_title4',
        thumb: 'test_thumb4',
        duration: 3000,
        playing: false,
      });

      const newProps = {
        dispatch,
        songs: testSongs,
      };

      const oldOrder = playerComponent.state().order;

      playerComponent.setProps(newProps);

      const newOrder = playerComponent.state().order;
      expect(oldOrder).not.toEqual(newOrder);
    });
  });

  describe('play', () => {
    let instance: Player;
    let playSongs: SongData[];

    beforeEach(() => {
      instance = playerComponent.instance() as Player;

      // Set playing in state to false
      playerComponent.setState({
        playing: false,
      });
    });

    it('should do nothing with no songs', () => {
      playerComponent.setProps({
        dispatch,
        songs: [],
      });

      const state = playerComponent.state();
      instance.play();
      expect(playerComponent.state()).toEqual(state);
    });

    it('should do nothing if playing and not paused', () => {
      playerComponent.setState({
        playing: true,
        paused: false,
      });

      const state = playerComponent.state();
      instance.play();
      expect(playerComponent.state()).toEqual(state);
    });

    it('should dispatch playSong if the current song is not playing', () => {
      testSongs[1].playing = false;
      instance.play();

      expect(dispatch).toHaveBeenCalledWith(playSong(1));
    });

    it('should resume if paused', () => {
      playerComponent.setState({
        playing: true,
        paused: true,
      });

      instance.play();
      expect(playerComponent.state().paused).toBe(false);
    });

    it('should log error if there was an error getting song info', () => {
      // Spy on console.error but disable output
      const spy = jest.spyOn(global.console, 'error');
      spy.mockImplementation((msg: string) => {});

      const errorMessage = 'There was an error getting song info!';

      (getInfo as any)
        .mockImplementation((id: string, cb: (err: any, info: any) => void) => {
          return cb(errorMessage, null);
        });

      instance.play();
      expect(spy).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('playButton', () => {
    it('should call play()', () => {
      const instance = playerComponent.instance() as Player;
      const spy = jest.spyOn(instance, 'play');

      instance.playButton();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    let instance: Player;

    beforeEach(() => {
      instance = playerComponent.instance() as Player;
    });

    it('should do nothing if the song is not playing', () => {
      playerComponent.setState({
        playing: false,
      });

      const state = playerComponent.state();
      instance.pause();
      expect(playerComponent.state()).toEqual(state);
    });

    it('should do nothing if already paused', () => {
      playerComponent.setState({
        playing: true,
        paused: true,
      });

      const state = playerComponent.state();
      instance.pause();
      expect(playerComponent.state()).toEqual(state);
    });

    it('should pause if playing a song and not already paused', () => {
      playerComponent.setState({
        playing: true,
        paused: false,
      });

      instance.pause();
      expect(playerComponent.state().paused).toBe(true);
    });
  });

  describe('toggle', () => {
    let instance: Player;

    beforeEach(() => {
      instance = playerComponent.instance() as Player;
    });

    it('should play if not playing', () => {
      const spy = jest.spyOn(instance, 'play');
      playerComponent.setState({
        playing: false,
      });

      instance.toggle();
      expect(spy).toHaveBeenCalled();
    });

    it('should play if paused', () => {
      const spy = jest.spyOn(instance, 'play');
      playerComponent.setState({
        playing: true,
        paused: true,
      });

      instance.toggle();
      expect(spy).toHaveBeenCalled();
    });

    it('should pause if playing and not paused', () => {
      const spy = jest.spyOn(instance, 'pause');
      playerComponent.setState({
        playing: true,
        paused: false,
      });

      instance.toggle();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset some of the state', () => {
      const defaultState = {
        current: 0,
        progress: 0,
        time: 0,
        playing: false,
        paused: false,
      };

      const instance = playerComponent.instance() as Player;
      instance.reset();

      const state = playerComponent.state();
      const newState = {
        current: state.current,
        progress: state.progress,
        time: state.current,
        playing: state.playing,
        paused: state.paused,
      };

      expect(newState).toEqual(defaultState);
    });
  });

  describe('stop', () => {
    it('should dispatch stopSong', () => {
      const instance = playerComponent.instance() as Player;
      instance.stop();

      expect(dispatch).toHaveBeenCalledWith(stopSong(playerComponent.state().current));
    });
  });

  describe('skipPrevious', () => {
    it('should skip to previous song if possible', () => {
      const instance = playerComponent.instance() as Player;
      instance.skipPrevious();

      expect(dispatch).toHaveBeenCalledWith(playSong(0));
    });

    it('should do nothing if current song is the first', () => {
      playerComponent.setState({
        current: 0,
      });

      const instance = playerComponent.instance() as Player;
      instance.skipPrevious();

      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe('skipNext', () => {
    it('should skip to next song if possible', () => {
      const instance = playerComponent.instance() as Player;
      instance.skipNext();

      expect(dispatch).toHaveBeenCalledWith(playSong(2));
    });

    it('should do nothing if current song is the last', () => {
      playerComponent.setState({
        current: 2,
      });

      const instance = playerComponent.instance() as Player;
      instance.skipNext();

      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe('toggleRepeat', () => {
    it('should cycle repeat mode', () => {
      const instance = playerComponent.instance() as Player;
      instance.toggleRepeat();

      expect(playerComponent.state().repeat).toBe(1);

      instance.toggleRepeat();
      instance.toggleRepeat();

      expect(playerComponent.state().repeat).toBe(0);
    });
  });

  describe('toggleShuffle', () => {
    it('should enable shuffle if not already enabled', () => {
      const order: Order = playerComponent.state().order;

      const instance = playerComponent.instance() as Player;
      instance.toggleShuffle();

      const newState = playerComponent.state();
      const newOrder: Order = newState.order;
      expect(newState.shuffle).toBe(true);
      expect(newOrder.equals(order)).toBe(false);
    });

    it('should not do a full shuffle if currently playing', () => {
      playerComponent.setState({
        playing: true,
      });

      const instance = playerComponent.instance() as Player;
      instance.toggleShuffle();

      const state = playerComponent.state();
      const order: Order = state.order;
      const current: number = state.current;

      expect(order.get(0)).toBe(current);
    });

    it('should disable shuffle if already enabled', () => {
      playerComponent.setState({
        shuffle: true,
      });

      const instance = playerComponent.instance() as Player;
      instance.toggleShuffle();

      const newState = playerComponent.state();
      const newOrder: Order = newState.order;
      expect(newState.shuffle).toBe(false);
      expect(newOrder.equals(new Order([0, 1, 2]))).toBe(true);
    });
  });

  describe('clearQueue', () => {
    it('should dispatch clearSongs', () => {
      const instance = playerComponent.instance() as Player;
      instance.clearQueue();

      expect(dispatch).toHaveBeenCalledWith(clearSongs());
    });
  });

  describe('seek', () => {
    it('should seek to given position', () => {
      const instance = playerComponent.instance() as Player;
      instance.seek(50);

      expect(playerComponent.state().progress).toBe(50);
    });
  });

  describe('handleTimeUpdate', () => {
    let instance: Player;

    beforeEach(() => {
      instance = playerComponent.instance() as Player;
    });

    it('should return if audio is paused', () => {
      Object.defineProperty(instance.audio, 'paused', {
        value: true,
      });

      const state = playerComponent.state();
      instance.handleTimeUpdate();

      expect(playerComponent.state()).toEqual(state);
    });

    it('should update progress', () => {
      expect(playerComponent.state().progress).toBe(0);

      Object.defineProperty(instance.audio, 'paused', {
        value: false,
      });

      Object.defineProperty(instance.audio, 'currentTime', {
        value: 30,
      });

      instance.handleTimeUpdate();
      expect(playerComponent.state().progress).toBe(10);
    });
  });

  describe('handleSongEnded', () => {
    let instance: Player;

    beforeEach(() => {
      instance = playerComponent.instance() as Player;
    });

    it('should replay the current song if repeat is set to One', () => {
      const spy = jest.spyOn(instance, 'seek');
      playerComponent.setState({
        repeat: Repeat.One,
      });

      instance.handleSongEnded();
      expect(spy).toHaveBeenCalledWith(0);
    });

    it('should try to skip to the next song', () => {
      const spy = jest.spyOn(instance, 'skipNext');

      instance.handleSongEnded();
      expect(spy).toHaveBeenCalled();
    });

    it('should dispatch playSong if repeat is set to All and we cannot skip', () => {
      playerComponent.setState({
        repeat: Repeat.All,
      });

      testSongs[1].playing = false;
      testSongs[2].playing = true;

      const newProps = {
        dispatch,
        songs: testSongs,
      };

      const order: Order =  playerComponent.state().order;
      playerComponent.setProps(newProps);
      instance.handleSongEnded();

      // Should dispatch with the first song in the order
      expect(dispatch).toHaveBeenCalledWith(playSong(order.get(0)));
    });

    it('should stop if repeat is set to None and we cannot skip', () => {
      const spy = jest.spyOn(instance, 'stop');
      playerComponent.setState({
        repeat: Repeat.None,
      });

      testSongs[1].playing = false;
      testSongs[2].playing = true;

      const newProps = {
        dispatch,
        songs: testSongs,
      };

      playerComponent.setProps(newProps);
      instance.handleSongEnded();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('handleChangeVolume', () => {
    it('should update the volume', () => {
      const instance = playerComponent.instance() as Player;
      instance.handleChangeVolume(100);

      expect(instance.audio.volume).toBe(1);
      expect(playerComponent.state().volume).toBe(100);
    });
  });

  describe('handleVolumeClick', () => {
    let instance: Player;

    beforeEach(() => {
      instance = playerComponent.instance() as Player;
    });

    it('should mute volume if it is not already muted', () => {
      expect(instance.audio.volume).toBe(1);
      expect(playerComponent.state().volume).toBe(50);

      instance.handleVolumeClick();

      expect(instance.audio.volume).toBe(0);
      expect(playerComponent.state().volume).toBe(0);
      expect(playerComponent.state().savedVolume).toBe(50);
    });

    it('should restore volume if it is already muted', () => {
      // Mute
      instance.handleVolumeClick();
      // Restore
      instance.handleVolumeClick();

      expect(instance.audio.volume).toBe(0.5);
      expect(playerComponent.state().volume).toBe(50);
    });
  });

  describe('render', () => {
    let shallowPlayer: ShallowWrapper<any, any>;

    beforeEach(() => {
      shallowPlayer = shallow(
        <Player dispatch={dispatch} songs={[]} />
      );
    });

    it('should render the correct volume icon', () => {
      shallowPlayer.setState({
        volume: 0,
      });

      expect(shallowPlayer.contains(<VolumeMute />)).toBe(true);

      shallowPlayer.setState({
        volume: 25,
      });

      expect(shallowPlayer.contains(<VolumeDown />)).toBe(true);

      shallowPlayer.setState({
        volume: 75,
      });

      expect(shallowPlayer.contains(<VolumeUp />)).toBe(true);
    });

    it('should render the correct repeat icon', () => {
      shallowPlayer.setState({
        repeat: Repeat.None,
      });

      expect(shallowPlayer.contains(<RepeatIcon />)).toBe(true);
      expect(shallowPlayer.contains(<ActiveIcon />)).toBe(false);

      shallowPlayer.setState({
        repeat: Repeat.All,
      });

      expect(shallowPlayer.contains((
        <ActiveIcon>
          <RepeatIcon />
        </ActiveIcon>
      ))).toBe(true);

      shallowPlayer.setState({
        repeat: Repeat.One,
      });

      expect(shallowPlayer.contains((
        <ActiveIcon>
          <RepeatOne />
        </ActiveIcon>
      ))).toBe(true);
    });

    it('should render the player container', () => {
      expect(shallowPlayer.find(PlayerContainer).exists()).toBe(true);
    });

    it('should render the audio element', () => {
      expect(shallowPlayer.find('audio').exists()).toBe(true);
    });

    it('should render the seek bar', () => {
      expect(shallowPlayer.find(Slider).exists()).toBe(true);
    });

    it('should render the timer', () => {
      expect(shallowPlayer.find(TimerContainer).exists()).toBe(true);
    });

    it('should render the player controls', () => {
      expect(shallowPlayer.find(Controls).exists()).toBe(true);
    });

    it('should render the volume controls', () => {
      expect(shallowPlayer.find(VolumeContainer).exists()).toBe(true);
    });
  });

  describe('mapStateToProps', () => {
    it('should take the state and return an object containing the songs', () => {
      const mockedState = fromJS({
        global: {
          songs: testSongs,
        },
      });

      expect(mapStateToProps(mockedState).songs).toEqual(testSongs);
    });
  });
});
