import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import MenuIcon from 'material-ui-icons/Menu';
import { Root, MenuButton, FlexTypo } from './styles';

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
