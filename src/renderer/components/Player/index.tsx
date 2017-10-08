import * as React from 'react';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import IconButton from 'material-ui/IconButton';
import SkipPrevious from 'material-ui-icons/SkipPrevious';
import SkipNext from 'material-ui-icons/SkipNext';

import { primary } from '../../colors';
import { PlayerContainer, Controls, PlayButton, PlayIcon } from './styles';
import { AppAction } from '../../containers/App/actions';

const sliderStyle = {
  position: 'absolute',
  top: 0,
  backgroundColor: primary,
  borderColor: primary,
};

interface IProps extends React.Props<Player> {
  dispatch: (action: AppAction) => void;
}

interface IState {
  currentTime: number;
}

class Player extends React.PureComponent<IProps, IState> {
  constructor() {
    super();

    this.state = {
      currentTime: 0,
    };
  }

  render() {
    return (
      <PlayerContainer>
        {/* Seekbar */}
        <Slider
          /* value={this.state.currentTime} */
          trackStyle={sliderStyle as any}
          railStyle={{...sliderStyle as any, backgroundColor: ''}}
          handleStyle={sliderStyle as any}
        />

        {/* Player controls */}
        <Controls>
          <IconButton aria-label="Previous">
            <SkipPrevious />
          </IconButton>

          <PlayButton aria-label="Play">
            <PlayIcon />
          </PlayButton>

          <IconButton aria-label="Next">
            <SkipNext />
          </IconButton>
        </Controls>
      </PlayerContainer>
    );
  }
}

export default connect()(Player as any);
