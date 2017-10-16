import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import { SongData } from '../../components/Song';
import SongList from '../../components/SongList';

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

function mapStateToProps(state: any) {
  const songs: SongData[] | List<SongData> = state.get('global').get('songs');

  return {
    songs: Array.isArray(songs) ? songs : songs.toArray(),
  };
}

export default connect(mapStateToProps)(HomePage as any);
