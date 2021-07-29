import { createTheme } from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000',
    },
    secondary: {
      main: deepOrange['A400'],
    },
    background: {
      default: deepOrange['50'],
    },
  },
  typography: {
    fontFamily: 'Inter, Arial',
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 24,
  },
});

export default theme;
