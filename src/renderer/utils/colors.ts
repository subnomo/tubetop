import { createMuiTheme } from 'material-ui/styles';
import { red } from 'material-ui/colors';

const main = red;

export const primary = main['500'];

export const theme = createMuiTheme({
  palette: {
    primary: main,
  }
});
