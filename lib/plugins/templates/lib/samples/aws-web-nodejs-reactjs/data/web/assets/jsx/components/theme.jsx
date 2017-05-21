'use strict';

import React from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { pink500 } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette : {
    accent1Color : pink500
  },
});

export function Theme(props) {
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      {props.children}
    </MuiThemeProvider>
  );
}
