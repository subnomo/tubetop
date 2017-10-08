import * as React from 'react';
import { connect } from 'react-redux';

import { SongData } from '../../components/Song';
import SongList from '../../components/SongList';

interface IProps extends React.Props<HomePage> {
  songs: SongData[];
}

export class HomePage extends React.PureComponent<IProps, {}> {
  render() {
    const songs = Array.isArray(this.props.songs) ? this.props.songs : [];

    return (
      <div>
        <SongList songs={songs} />
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    songs: state.get('global').get('songs'),
  };
}

export default connect(mapStateToProps)(HomePage as any);
