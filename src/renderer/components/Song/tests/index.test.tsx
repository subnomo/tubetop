import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { ListItemText } from 'material-ui/List';

import { Song, SongData } from '../index';
import { parseTime } from '../util';
import { ActiveListItemText } from '../styles';
import { playSong, removeSong } from '../../../containers/App/actions';

describe('<Song />', () => {
  let dispatch: jest.Mock<{}>;
  let testSong: SongData;
  let songComponent: ReactWrapper<any, any>;

  beforeEach(() => {
    dispatch = jest.fn();
    testSong = {
      key: 'test_key',
      id: 'test_id',
      title: 'test_title',
      thumb: 'test_thumb',
      duration: 60,
      playing: false,
    };

    songComponent = mount(
      <Song dispatch={dispatch} song={testSong} index={0} />
    );
  });

  it('should dispatch playSong when song is clicked', () => {
    (songComponent.instance() as Song).playItem();
    expect(dispatch).toHaveBeenCalledWith(playSong(0));
  });

  it('should dispatch removeSong when remove button is clicked', () => {
    (songComponent.instance() as Song).removeItem();
    expect(dispatch).toHaveBeenCalledWith(removeSong(0));
  });

  it('should render the song', () => {
    expect(songComponent.find('img').prop('src')).toBe(testSong.thumb);
    expect(songComponent.find('h3').text()).toBe(testSong.title);
    expect(songComponent.find('p').text()).toBe(parseTime(testSong.duration));
  });

  it('should render the title and duration', () => {
    const text: JSX.Element = (
      <ListItemText
        primary={testSong.title}
        secondary={parseTime(testSong.duration)}
      />
    );

    expect(songComponent.contains(text)).toBe(true);
  });

  it('should render a colored title if the song is playing', () => {
    songComponent.setProps({
      song: {
        ...testSong,
        playing: true,
      },
    });

    const text: JSX.Element = (
      <ActiveListItemText
        primary={testSong.title}
        secondary={parseTime(testSong.duration)}
      />
    );

    expect(songComponent.contains(text)).toBe(true);
  });
});
