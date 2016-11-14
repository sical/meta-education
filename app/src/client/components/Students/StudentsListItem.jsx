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

import store from '../../store'
import  { ActionTypes } from '../../actions'
import AsyncAPI from '../../AsyncAPI'

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
    console.log(props);
    this.state = {
      toggled : false
    }
  }

  handleClickStudent(userId) {

    let projectIndex = this.props.selectedProjects.map(d => d.userId).indexOf(userId)
    let projectId = this.props.selectedProjects[projectIndex].id

    if (! this.props.currentProject || this.props.currentProject != projectId ) {
      store.dispatch({ type : ActionTypes.SHOW_PROJECT, projectId : projectId})
      store.dispatch(AsyncAPI.getProject(projectId))
    }
    else store.dispatch({ type : ActionTypes.HIDE_PROJECT})
  }

  toggleProjects(userId) {
    let toggled = this.state.toggled ? false : true
    this.setState({ toggled: toggled })
  }

  render() {
    let self = this

    let rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem
          onTouchTap={self.toggleProjects.bind(this)}>
          Changer de carte
        </MenuItem>
      </IconMenu>
    );

    return (
      <ListItem
          primaryText={this.props.student.name}
          open={this.state.toggled}
          leftAvatar={
            <Avatar
            icon={<ActionFace />}
             />
          }
          nestedItems={this.props.nested}
          rightIconButton={rightIconMenu}
          onClick={
            self.state.toggled ?
              self.toggleProjects.bind(this, this.props.student.id)
              :
              self.handleClickStudent.bind(this, this.props.student.id)
          }
        />
      )
  }
}
