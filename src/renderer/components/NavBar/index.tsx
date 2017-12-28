import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import MenuIcon from 'material-ui-icons/Menu';
import LibraryMusic from 'material-ui-icons/LibraryMusic';
import Settings from 'material-ui-icons/Settings';

import { Root, MenuButton, FlexTypo, StyledLink, DrawerContainer } from './styles';
import Search from 'components/Search';

interface IProps extends React.Props<NavBar> {
  title: string;
}

interface IState {
  drawerOpen: boolean;
}

export default class NavBar extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      drawerOpen: false,
    };
  }

  toggleDrawer = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen,
    });
  }

  render() {
    return (
      <Root>
        <AppBar position="static" color="primary">
          <Toolbar>
            <MenuButton color="contrast" aria-label="Menu" onClick={this.toggleDrawer}>
              <MenuIcon />
            </MenuButton>

            {/* Side drawer */}
            <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer}>
              <DrawerContainer
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer}
                onKeyDown={this.toggleDrawer}
              >
                <List>
                  <StyledLink to="/">
                    <ListItem button>
                      <ListItemIcon>
                        <LibraryMusic />
                      </ListItemIcon>

                      <ListItemText primary="Listen" />
                    </ListItem>
                  </StyledLink>

                  <StyledLink to="/settings">
                    <ListItem button>
                      <ListItemIcon>
                        <Settings />
                      </ListItemIcon>

                      <ListItemText primary="Settings" />
                    </ListItem>
                  </StyledLink>
                </List>
              </DrawerContainer>
            </Drawer>

            <FlexTypo type="title" color="inherit">
              <StyledLink to="/">
                {this.props.title}
              </StyledLink>
            </FlexTypo>

            <Search />
          </Toolbar>
        </AppBar>
      </Root>
    );
  }
}
