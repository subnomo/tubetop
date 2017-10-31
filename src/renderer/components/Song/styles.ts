import styled from 'styled-components';
import { ListItemText } from 'material-ui/List';

import { primary } from '../../colors';

export const Thumb = styled.img`
  border-radius: 5px;
`;

export const ActiveListItemText = styled(ListItemText)`
  h3 {
    color: ${primary} !important;
    opacity: 0.9;
  }
`;
