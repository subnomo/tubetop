import * as React from 'react';
import { Route } from 'react-router-dom';
import { shallow, ShallowWrapper } from 'enzyme';

import App from '..';
import NavBar from 'components/NavBar';
import Player from 'components/Player';

describe('<App />', () => {
  let appComponent: ShallowWrapper<any, any>;

  beforeEach(() => {
    appComponent = shallow(<App />);
  });

  it('should render the NavBar', () => {
    expect(appComponent.find(NavBar)).toHaveLength(1);
  });

  it('should render at least one Route', () => {
    expect(appComponent.find(Route).length).toBeGreaterThanOrEqual(1);
  });

  it('should render the Player', () => {
    expect(appComponent.find(Player)).toHaveLength(1);
  });
});
