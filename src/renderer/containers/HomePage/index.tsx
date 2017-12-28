import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import { SongData } from 'components/Song';
import SongList from 'components/SongList';
import { selectSongs } from 'containers/App/selectors';

interface IProps extends React.Props<HomePage> {
  songs: SongData[];
}

export class HomePage extends React.PureComponent<IProps, {}> {
  render() {
    const { songs } = this.props;

    return (
      <div>
        <SongList songs={songs} />
      </div>
    );
  }
}

export function mapStateToProps(state: any) {
  const songs: List<SongData> = selectSongs(state);

  return {
    songs: songs.toArray(),
  };
}

export default connect(mapStateToProps)(HomePage as any);
