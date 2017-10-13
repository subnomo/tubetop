import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import * as colors from '../../colors';
import NavBar from '../../components/NavBar';
import Player from '../../components/Player';
import HomePage from '../HomePage';
import { PageContainer } from './styles';

export default class App extends React.PureComponent {
  render() {
    return (
      <div>
        <NavBar title="TubeTop" color={colors.primary} />

        <PageContainer>
          <Switch>
            <Route exact path="/" component={HomePage} />
          </Switch>
        </PageContainer>

        <Player />
      </div>
    );
  }
}
