import * as React from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';

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
  const songs: List<Map<any, SongData>> = selectSongs(state);

  return {
    songs: songs.toJS(),
  };
}

export default connect(mapStateToProps)(HomePage as any);
