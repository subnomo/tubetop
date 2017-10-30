import * as React from 'react';
import List from 'material-ui/List';

import Song, { SongData } from '../../components/Song';

interface IProps extends React.Props<SongList> {
  songs: SongData[];
}

export default class SongList extends React.PureComponent<IProps, {}> {
  render() {
    return (
      <List>
        {this.props.songs.map((song, i) => (
          <Song
            key={i}
            song={song}
            index={i}
          />
        ))}
      </List>
    );
  }
}
