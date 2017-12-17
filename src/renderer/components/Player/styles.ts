import styled from 'styled-components';
import { grey } from 'material-ui/colors';
import IconButton from 'material-ui/IconButton';
import PlayCircleFilled from 'material-ui-icons/PlayCircleFilled';
import PauseCircleFilled from 'material-ui-icons/PauseCircleFilled';
import Repeat from 'material-ui-icons/Repeat';
import RepeatOne from 'material-ui-icons/RepeatOne';

import { primary } from 'utils/colors';

export const PlayerContainer = styled.div`
  position: fixed;
  height: 100px;
  bottom: 0;
  z-index: 1;
  width: 100%;
  background-color: white;
  box-shadow: ${grey[400]} 0 -1px 10px 0;
`;

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

export const ExtraControls = styled.div`

`;

const buttonSize = 60;

export const PlayButton = styled(IconButton)`
  width: ${buttonSize + 10}px !important;
  height: ${buttonSize + 10}px !important;
`;

export const PlayIcon = styled(PlayCircleFilled)`
  width: ${buttonSize}px !important;
  height: ${buttonSize}px !important;
`;

export const PauseIcon = styled(PauseCircleFilled)`
  width: ${buttonSize}px !important;
  height: ${buttonSize}px !important;
`;

export const VolumeContainer = styled.div`
  width: 150px;
  height: 100%;
  position: absolute;
  top: 50%;
  bottom: 0;
  margin: auto;
  margin-right: 10px;
  right: 10%;

  .rc-slider {
    display: inline;
    position: absolute !important;
    top: 22px;
  }
`;

export const TimerContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  top: 0;
  left: 10%;
`;

export const sliderStyle = {
  position: 'absolute',
  zIndex: 5,
  top: 0,
  backgroundColor: primary,
  borderColor: primary,
};

export const ActiveIcon = styled.div`
  display: flex;

  * {
    fill: ${primary};
  }
`;
