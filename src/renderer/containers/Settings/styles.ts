import styled from 'styled-components';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

export const SettingsContainer = styled.div`
  width: 720px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 72px;
`;

export const SettingsTextField = styled(TextField)`
  width: 100%;
`;

export const SettingsButton = styled(Button)`
  margin-top: 10px;
  // background-color: white !important;
`;
