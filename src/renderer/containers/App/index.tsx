import * as React from 'react';
import { connect } from 'react-redux';
import NavBar from '../../components/NavBar';

export default class App extends React.PureComponent {
  render() {
    return (
      <div>
        <NavBar title="TubeTop" />
      </div>
    );
  }
}
