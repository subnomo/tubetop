import * as React from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import QueueMusic from 'material-ui-icons/QueueMusic';
import Typography from 'material-ui/Typography';

import { SongData } from 'components/Song';
import SongList from 'components/SongList';
import { selectSongs } from 'containers/App/selectors';
import { HomeContainer, PlaceholderContainer } from './styles';

interface IProps extends React.Props<HomePage> {
  songs: SongData[];
}

export class HomePage extends React.PureComponent<IProps, {}> {
  render() {
    const { songs } = this.props;

    const Placeholder: JSX.Element = (
      <PlaceholderContainer>
        <QueueMusic />

        <Typography type="headline" color="inherit">
          Your queue is empty
        </Typography>

        <Typography type="subheading" color="inherit">
          Start typing in the search bar to add some music!
        </Typography>
      </PlaceholderContainer>
    );

    return (
      <HomeContainer>
        {songs.length === 0 ? Placeholder : <SongList songs={songs} />}
      </HomeContainer>
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
