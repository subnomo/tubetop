import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import HomePage from '../HomePage';

export default class App extends React.PureComponent {
  render() {
    return (
      <div>
        <NavBar title="TubeTop" />

        <Switch>
          <Route exact path="/" component={HomePage} />
        </Switch>
      </div>
    );
  }
}
