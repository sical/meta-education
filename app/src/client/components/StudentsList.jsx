import React from 'react'
import { connect } from 'react-redux'

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import Subheader from 'material-ui/Subheader';
import ActionFace from 'material-ui/svg-icons/action/face';
import ContentSend from 'material-ui/svg-icons/content/send';

import store from '../store'
import  { ActionTypes } from '../actions'
import AsyncAPI from '../AsyncAPI'

import moment from 'moment'

import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import RefreshButton from './RefreshButton/RefreshButton.jsx'

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


class StudentsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toggled : []
    }
  }

  componentWillReceiveProps(nextProps) {

  }


  handleClickProject (projectId, userId) {
    store.dispatch({type : ActionTypes.SELECT_PROJECTS, project : { id : projectId, userId : userId }})
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
    if (this.state.toggled.indexOf(userId) > -1)
      this.setState({
        toggled: this.state.toggled.filter(id => id !== userId)
      })
    else
      this.setState({
        toggled: [...this.state.toggled, userId]
      })
  }

  render() {

    let self = this

    let students = this.props.projects.map( (student,i) => {

      let rightIconMenu = (
        <IconMenu iconButtonElement={iconButtonElement}>
          <MenuItem
            onTouchTap={self.toggleProjects.bind(this, student.id)}>
            Changer de carte
          </MenuItem>
        </IconMenu>
      );

      let toggled = this.state.toggled.indexOf(student.id) > -1 ? true : false
      let projects = student.projects.map( (project, j) => {

        let isSelected = this.props.selectedProjects
          .map(d => d ? d.id : null)
          .indexOf(project.id)

        return (
          <ListItem
            primaryText={`${project.name}`}
            secondaryText={`${project.actionsCount} actions. Edité ${ moment(project.end).fromNow()}`}
            onClick={
              self.handleClickProject.bind(this, project.id, student.id)
            }
            key={j}
            className={ isSelected > -1 ? "selected" : null}
            rightIcon={<ContentSend />}
            />
        )
      }
      )

      return (
        <ListItem
            primaryText={student.name}
            key={i}
            open={toggled}
            leftAvatar={
              <Avatar
              icon={<ActionFace />}
               />
            }
            nestedItems={projects}
            rightIconButton={rightIconMenu}
            onClick={
              self.state.toggled.indexOf(student.id) > -1 ?
                self.toggleProjects.bind(this, student.id)
                :
                self.handleClickStudent.bind(this, student.id)
            }
          />
        )
      }
    )

    return (
      <div>
        <RefreshButton />
        <List>
          {students}
        </List>
      </div>
    )
  }
}

const mapStateToProps = (state) => {

  return {
      projects : state.api.projects,
      selectedProjects : state.api.selectedProjects,
      currentClasse : state.viz.currentClasse,
      stats : state.api.stats,
      currentProject : state.viz.currentProject
  }
}

export default connect(mapStateToProps)(StudentsList)
