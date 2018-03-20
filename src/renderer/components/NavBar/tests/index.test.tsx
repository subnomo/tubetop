import * as React from 'react';
import { shallow } from 'enzyme';

import NavBar from '..';
import Search from 'components/Search';

describe('<NavBar />', () => {
  it('should render the title', () => {
    const renderedComponent = shallow(<NavBar title="TestTitle" />);
    expect(renderedComponent.contains('TestTitle')).toBe(true);
  });

  it('should render the <Search /> component', () => {
    const renderedComponent = shallow(<NavBar title="TestTitle" />);
    expect(renderedComponent.find(Search)).toHaveLength(1);
  });

  it('should toggle drawer', () => {
    const renderedComponent = shallow(<NavBar title="title" />).instance() as NavBar;
    expect(renderedComponent.state.drawerOpen).toBe(false);
    renderedComponent.toggleDrawer();
    expect(renderedComponent.state.drawerOpen).toBe(true);
  });
});
