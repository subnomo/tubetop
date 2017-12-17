import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ListItem, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

import { Song, SongData } from '..';
import { parseTime } from '../util';
import { ActiveListItemText, Thumb } from '../styles';
import { playSong, removeSong } from 'containers/App/actions';

describe('<Song />', () => {
  let dispatch: jest.Mock<{}>;
  let testSong: SongData;
  let songComponent: ShallowWrapper<any, any>;

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

    songComponent = shallow(
      <Song dispatch={dispatch} song={testSong} index={0} />
    );
  });

  it('should render the thumbnail', () => {
    expect(songComponent.find(Thumb).prop('src')).toBe(testSong.thumb);
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

  it('should dispatch playSong when song is clicked', () => {
    songComponent.find(ListItem).simulate('click');
    expect(dispatch).toHaveBeenCalledWith(playSong(0));
  });

  it('should dispatch removeSong when remove button is clicked', () => {
    songComponent.find(IconButton).simulate('click');
    expect(dispatch).toHaveBeenCalledWith(removeSong(0));
  });
});
