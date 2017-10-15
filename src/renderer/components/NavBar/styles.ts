import styled from 'styled-components';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import { Link } from 'react-router-dom';

// Styled components

export const Root = styled.div`
  width: 100%;
`;

export const MenuButton = styled(IconButton)`
  margin-left: -4px;
  margin-right: 20px;
`;

export const FlexTypo = styled(Typography)`
  flex: 1;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const DrawerContainer = styled.div`
  width: 250px;
`;
