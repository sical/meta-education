import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

export default class SideNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false }
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  render() {
    let menuItems = this.props.projects.map( (d, i) =>
      <MenuItem
        key={i}
        // onTouchTap={this.handleClose}
        >
        Project {i} ({d.value})
      </MenuItem>
    )
    return (
      <div>
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <Subheader>Projects</Subheader>
          {menuItems}
          <Divider />
        </Drawer>
      </div>
    );
  }
}


SideNav.defaultProps = {
  projects : []
}
