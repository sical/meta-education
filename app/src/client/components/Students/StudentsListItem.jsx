import React from 'react'
import { connect } from 'react-redux'

import { ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionFace from 'material-ui/svg-icons/action/face';
import ContentSend from 'material-ui/svg-icons/content/send';

import moment from 'moment'

import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

// set to French
moment.locale('fr')

// tooltip
const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);


export default class StudentsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      toggled : false
    }
  }

  toggleProjects(userId) {
    let toggled = this.state.toggled ? false : true
    this.setState({ toggled: toggled })
  }

  handleClickStudent(userId) {
    let projectIndex = this.props.selectedProjects.map(d => d.userId).indexOf(userId)
    let projectId = this.props.selectedProjects[projectIndex].id
    this.props.handleClickStudentYo(projectId)
  }

  render() {

    let rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem
          onTouchTap={this.toggleProjects.bind(this)}>
          Changer de carte
        </MenuItem>
      </IconMenu>
    );

    return (
      <ListItem
          primaryText={this.props.student.name}
          secondaryText={this.props.student.name}
          open={this.state.toggled}
          leftAvatar={
            <Avatar
            icon={<ActionFace />}
             />
          }
          nestedItems={this.props.nested}
          rightIconButton={rightIconMenu}
          onClick={
            this.state.toggled ?
              this.toggleProjects.bind(this, this.props.student.id)
              :
              this.handleClickStudent.bind(this,this.props.student.id)
          }
        />
      )
  }
}
