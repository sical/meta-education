import React from 'react';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

import StudentsList from '../components/Students/StudentsList.jsx'

import { version } from '../../../package.json'

const sticky = {
  position: 'fixed',
  color: '#ccc',
  bottom: '0',
  width: '25%'
}

export default class SideNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false }
  }

  handleClick(classeId) {
    this.props.selectClasse(classeId)
    this.handleClose()
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  render() {
    let menuItems = this.props.students.map( (classe, i) =>
      <MenuItem
        key={i}
        onTouchTap={this.handleClick.bind(this, classe.classeId)}
        style={ classe.classeId === this.props.currentClasse ? { backgroundColor : "rgba(0,0,0,.3)"} : {} }
        >
        {classe.professeur　+ " " + classe.name}
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
          <Subheader>Classes</Subheader>
          {menuItems}
          <Divider />
          <Subheader>Elèves</Subheader>
          <StudentsList />
          <MenuItem style={sticky}>v{version}</MenuItem>

        </Drawer>
      </div>
    );
  }
}


SideNav.defaultProps = {
  projects : []
}
