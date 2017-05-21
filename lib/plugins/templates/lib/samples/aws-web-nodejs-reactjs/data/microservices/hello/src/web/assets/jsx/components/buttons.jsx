'use strict';

import RaisedButton from 'material-ui/RaisedButton';
import { Theme } from '../../../../../../../web/assets/jsx/components/theme';

const style = {
  margin : 5
};

class Buttons extends React.Component {
  render() {
    return (
      <Theme>
        <div>
          <RaisedButton label="Default" style={style}/>
          <RaisedButton label="Primary" primary={true} style={style}/>
          <RaisedButton label="Secondary" secondary={true} style={style}/>
          <RaisedButton label="Disabled" disabled={true} style={style}/>
        </div>
      </Theme>
    );
  }
}

export default Buttons;
