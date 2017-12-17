import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import { Settings, IState, mapStateToProps } from '..';
import { SettingsContainer, SettingsButton, SettingsTextField } from '../styles';
import { saveSettings } from '../actions';
import { mockState } from 'utils/setupTests';

describe('<Settings />', () => {
  let dispatch: jest.Mock<{}>;
  let settings: IState;
  let settingsComponent: ShallowWrapper<any, any>;

  beforeEach(() => {
    dispatch = jest.fn();
    settings = {
      youtubeAPIKey: 'test_youtube_api_key',
    };

    settingsComponent = shallow(
      <Settings dispatch={dispatch} settings={settings} />
    );
  });

  it('should render settings', () => {
    expect(settingsComponent.find(SettingsContainer)).toHaveLength(1);
    expect(settingsComponent.find(SettingsButton)).toHaveLength(1);
    expect(settingsComponent.find(SettingsTextField).length).toBeGreaterThanOrEqual(1);
  });

  it('should dispatch saveSettings when save button clicked', () => {
    settingsComponent.find(SettingsButton).simulate('click');
    expect(dispatch).toHaveBeenCalledWith(saveSettings(settings));
  });

  it('should update state when a text field is changed', () => {
    const testValue = 'test_changed_text';

    settingsComponent.find(SettingsTextField).forEach((setting) => {
      setting.simulate('change', {
        target: {
          id: setting.prop('id'),
          value: testValue,
        },
      });
    });

    const stateValues: string[] = (Object as any).values(settingsComponent.state());
    expect(stateValues.every((v) => v === testValue)).toBe(true);
  });

  describe('mapStateToProps', () => {
    it('should take the state and return an object containing settings', () => {
      const state = mockState({ toObject: () => settings }, 'settings');

      expect(mapStateToProps(state).settings).toEqual(settings);
    });
  });
});
