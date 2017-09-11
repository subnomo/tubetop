import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Input from 'material-ui/Input';
import MenuIcon from 'material-ui-icons/Menu';
import SearchIcon from 'material-ui-icons/Search';
import { Root, MenuButton, FlexTypo, SearchBox, HomeLink } from './styles';

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

            <SearchBox>
              <div className="searchIcon">
                <SearchIcon />
              </div>

              <Input disableUnderline />
            </SearchBox>
          </Toolbar>
        </AppBar>
      </Root>
    );
  }
}
