import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import { Settings, IState, mapStateToProps } from '../index';
import { SettingsContainer, SettingsButton, SettingsTextField } from '../styles';
import { saveSettings } from '../actions';

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
    it('should take state and return object containing settings', () => {
      // Mock immutablejs
      const state = {
        get: (s: string) => {
          if (s !== 'settings') return;

          return {
            get: (s: string) => {
              if (s !== 'settings') return;

              return settings;
            }
          };
        }
      };

      expect(mapStateToProps(state).settings).toEqual(settings);
    });

    it('should take default immutable state and return object containing settings', () => {
      // Mock immutablejs
      const state = {
        get: (s: string) => {
          if (s !== 'settings') return;

          return {
            get: (s: string) => {
              if (s !== 'settings') return;

              return { toObject: () => settings };
            }
          };
        }
      };

      expect(mapStateToProps(state).settings).toEqual(settings);
    });
  });
});
