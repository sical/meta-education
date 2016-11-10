import React from 'react'
import { connect } from 'react-redux'

import {List, ListItem, makeSelectable} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionFace from 'material-ui/svg-icons/action/face';
import ContentSend from 'material-ui/svg-icons/content/send';
import Badge from 'material-ui/Badge';
import Subheader from 'material-ui/Subheader';

import store from '../store'
import  { ActionTypes } from '../actions'
import AsyncAPI from '../AsyncAPI'

import moment from 'moment'

let SelectableList = makeSelectable(List);

// set to French
moment.locale('fr')

class StudentsList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
      // this.setState({ selected : this.props.selectedProjects })
  }


  handleClickProject (projectId, userId) {
    store.dispatch({type : ActionTypes.SELECT_PROJECTS, project : { id : projectId, userId : userId }})
  }

  render() {

    let students = this.props.projects.map( (student,i) => {
      let selection = 0

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
            primaryTogglesNestedList={true}
            // onClick={this.handleClickStudent.bind(this, student)}
            nestedItems={projects}
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
