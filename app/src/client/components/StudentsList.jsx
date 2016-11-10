import React from 'react'
import { connect } from 'react-redux'

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionFace from 'material-ui/svg-icons/action/face';
import ContentSend from 'material-ui/svg-icons/content/send';
import Badge from 'material-ui/Badge';
import Subheader from 'material-ui/Subheader';

import store from '../store'
import  { ActionTypes } from '../actions'
import AsyncAPI from '../AsyncAPI'

import moment from 'moment'

import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';


// set to French
moment.locale('fr')

class StudentsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toggled : []
    }
  }

  componentWillReceiveProps(nextProps) {
      // this.setState({ selected : this.props.selectedProjects })
  }


  handleClickProject (projectId, userId) {
    store.dispatch({type : ActionTypes.SELECT_PROJECTS, project : { id : projectId, userId : userId }})
  }

  toggleProjects(userId) {
    if (this.state.toggled.indexOf(userId) > -1) this.state.toggled.pop(toggled)
    else this.state.toggled.push(userId)
  }

  render() {

    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );

    let students = this.props.projects.map( (student,i) => {
      let selection = 0

      let rightIconMenu = (
        <IconMenu iconButtonElement={iconButtonElement}>
          <MenuItem
            onClick={this.toggleProjects(student.id)}>
            Changer de carte
          </MenuItem>
        </IconMenu>
      );

      let toggle = this.state.toggled.indexOf(student.id)

      let projects = student.projects.map( (project, j) => {

        let isSelected = this.props.selectedProjects
          .map(d => d ? d.id : null)
          .indexOf(project.id)

        // apply style
        if  (isSelected > -1) selection++

        return (
          <ListItem
            primaryText={`${project.name}`}
            secondaryText={`${project.actionsCount} actions. Edité ${ moment(project.end).fromNow()}`}
            onClick={this.handleClickProject.bind(this, project.id, student.id)}
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
            leftAvatar={
              <Avatar
              icon={<ActionFace />}
               />
            }
            nestedItems={projects}
            rightIconButton={rightIconMenu}
            rightAvatar= {
              selection ?
                <Badge
                  badgeContent={selection}
                  primary={true}
                />
                :
                null
            }

          />
        )
      }
    )

    return (
      <div>
        <ListItem
            primaryText="Elèves"
            secondaryText="Sélectionnez une carte par élève."
            disabled={true}
          />
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
      currentClasse : state.viz.currentClasse,
      selectedProjects : state.viz.selectedProjects
  }
}

export default connect(mapStateToProps)(StudentsList)
