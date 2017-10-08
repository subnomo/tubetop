import * as React from 'react';
import { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import { parseTime } from './util';

export interface SongData {
  key: string;
  id: string;
  title: string;
  thumb: string;
  duration: number;
  playing: boolean;
}

interface IProps extends React.Props<Song> {
  song: SongData;
  index: number;
}

export default class Song extends React.PureComponent<IProps, {}> {
  render() {
    const { song, index } = this.props;

    return (
      <ListItem button>
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
