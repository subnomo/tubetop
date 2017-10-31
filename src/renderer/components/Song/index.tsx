import * as React from 'react';
import { connect } from 'react-redux';
import { ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui-icons/Delete';

import { parseTime } from './util';
import { Thumb } from './styles';
import { AppAction, playSong, removeSong } from '../../containers/App/actions';

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

  removeItem = () => {
    const { dispatch, index } = this.props;

    dispatch(removeSong(index));
  }

  render() {
    const { song, index } = this.props;

    return (
      <ListItem button onClick={this.playItem}>
        <ListItemAvatar>
          <Thumb width="72" src={song.thumb} />
        </ListItemAvatar>

        <ListItemText
          primary={song.title}
          secondary={parseTime(song.duration)}
        />

        <ListItemSecondaryAction>
          <IconButton onClick={this.removeItem}>
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default connect()(Song as any);
