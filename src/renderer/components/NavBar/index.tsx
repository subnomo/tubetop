import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import MenuIcon from 'material-ui-icons/Menu';

import { Root, MenuButton, FlexTypo, HomeLink } from './styles';
import Search from '../search';

interface IProps extends React.Props<NavBar> {
  title: string;
}

export default class NavBar extends React.PureComponent<IProps, {}> {
  render() {
    return (
      <Root>
        <AppBar position="static">
          <Toolbar>
            <MenuButton color="contrast" aria-label="Menu">
              <MenuIcon />
            </MenuButton>

            <FlexTypo type="title" color="inherit">
              <HomeLink to="/">
                {this.props.title}
              </HomeLink>
            </FlexTypo>

            <Search />
          </Toolbar>
        </AppBar>
      </Root>
    );
  }
}
