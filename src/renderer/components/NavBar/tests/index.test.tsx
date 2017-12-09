import * as React from 'react';
import { shallow } from 'enzyme';

import NavBar from '../index';

describe('<NavBar />', () => {
  it('should render title', () => {
    const renderedComponent = shallow(<NavBar title="TestTitle" />);
    expect(renderedComponent.contains('TestTitle')).toBe(true);
  });

  it('should toggle drawer', () => {
    const renderedComponent = shallow(<NavBar title="title" />).instance() as NavBar;
    expect(renderedComponent.state.drawerOpen).toBe(false);
    renderedComponent.toggleDrawer();
    expect(renderedComponent.state.drawerOpen).toBe(true);
  });
});
