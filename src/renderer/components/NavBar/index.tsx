import * as React from 'react';
import styled from 'styled-components';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

// Styled components

const Root = styled.div`
  width: 100%;
`;

const MenuButton = styled(IconButton)`
  margin-left: 12px;
  margin-right: 20px;
`;

const FlexTypo = styled(Typography)`
  flex: 1;
`;

interface IProps extends React.Props<NavBar> {
  title: string;
}

export default class NavBar extends React.PureComponent<IProps, {}> {
  render() {
    return (
      <Root>
        <AppBar position="static">
          <Toolbar disableGutters>
            <MenuButton color="contrast" aria-label="Menu">
              <MenuIcon />
            </MenuButton>

            <FlexTypo type="title" color="inherit">
              {this.props.title}
            </FlexTypo>
          </Toolbar>
        </AppBar>
      </Root>
    );
  }
}
