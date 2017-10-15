import * as React from 'react';
import { connect } from 'react-redux';

import { SettingsContainer, SettingsTextField, SettingsButton } from './styles';
import { saveSettings } from './actions';

interface IProps extends React.Props<Settings> {
  dispatch: (action: any) => void;
  settings: Partial<IState>;
}

interface IState {
  youtubeAPIKey: string;
}

class Settings extends React.PureComponent<IProps, IState> {
  constructor() {
    super();

    this.state = {
      youtubeAPIKey: '',
    };
  }

  save = () => {
    this.props.dispatch(saveSettings(this.state));
  }

  handleChange = (event) => {
    switch (event.target.id) {
      case 'ytAPI':
        this.setState({ youtubeAPIKey: event.target.value });
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <SettingsContainer>
        <SettingsTextField
          id="ytAPI"
          label="YouTube API Key"
          defaultValue={this.props.settings.youtubeAPIKey}
          onChange={this.handleChange}
        />

        <SettingsButton raised color="primary" aria-label="Save" onClick={this.save}>
          Save
        </SettingsButton>
      </SettingsContainer>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    settings: state.get('settings').get('settings'),
  };
}

export default connect(mapStateToProps)(Settings as any);
