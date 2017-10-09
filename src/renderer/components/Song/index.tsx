import * as React from 'react';
import { connect } from 'react-redux';
import { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import { parseTime } from './util';
import { AppAction, playSong } from '../../containers/App/actions';

export interface SongData {
  key: string;
  id: string;
  title: string;
  thumb: string;
  duration: number;
  playing: boolean;
}

interface IProps extends React.Props<Song> {
  dispatch: (action: AppAction) => void;
  song: SongData;
  index: number;
}

class Song extends React.PureComponent<IProps, {}> {
  playItem = () => {
    const { dispatch, index } = this.props;

    dispatch(playSong(index));
  }

  render() {
    const { song, index } = this.props;

    return (
      <ListItem button onClick={this.playItem}>
        <ListItemAvatar>
          <Avatar src={song.thumb} />
        </ListItemAvatar>

        <ListItemText
          primary={song.title}
          secondary={parseTime(song.duration)}
        />
      </ListItem>
    );
  }
}

export default connect()(Song as any);
