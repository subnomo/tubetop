import styled from 'styled-components';
import { grey } from 'material-ui/colors';
import IconButton from 'material-ui/IconButton';
import PlayCircleFilled from 'material-ui-icons/PlayCircleFilled';

import { primary } from '../../colors';

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

export const PlayButton = styled(IconButton)`
  width: 80px !important;
  height: 80px !important;
`;

export const PlayIcon = styled(PlayCircleFilled)`
  color: ${primary};
  width: 70px !important;
  height: 70px !important;
`;
