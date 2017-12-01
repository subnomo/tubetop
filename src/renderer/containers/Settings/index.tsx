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

export class Settings extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      youtubeAPIKey: props.settings.youtubeAPIKey,
    };
  }

  save = () => {
    this.props.dispatch(saveSettings(this.state));
  }

  handleChange = (event: any) => {
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    return (
      <SettingsContainer>
        <SettingsTextField
          id="youtubeAPIKey"
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
  const settings = state.get('settings').get('settings');

  return {
    settings: settings.youtubeAPIKey ? settings : settings.toObject(),
  };
}

export default connect(mapStateToProps)(Settings as any);
