import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import * as colors from '../../colors';
import NavBar from '../../components/NavBar';
import Player from '../../components/Player';
import HomePage from '../HomePage';

export default class App extends React.PureComponent {
  render() {
    return (
      <div>
        <NavBar title="TubeTop" color={colors.primary} />

        <Switch>
          <Route exact path="/" component={HomePage} />
        </Switch>

        <Player />
      </div>
    );
  }
}
