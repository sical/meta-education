import React from 'react'
import { connect } from 'react-redux'

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionFace from 'material-ui/svg-icons/action/face';
import ContentSend from 'material-ui/svg-icons/content/send';

import Subheader from 'material-ui/Subheader';

import store from '../store'
import  {ActionTypes} from '../actions'
import AsyncAPI from '../AsyncAPI'

import moment from 'moment'

// set to French
moment.locale('fr')

class StudentsList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.dispatch(AsyncAPI.getProjectsList(this.props.currentClasse))
  }

  handleClickStudent (userId) {
    // this.props.dispatch(AsyncAPI.getProjectsList(userId))
  }

  handleClickProject (_id) {
    // this.props.dispatch(AsyncAPI.getProject(_id))
  }

  render() {

    let students = this.props.projects.map( (student,i) => {

      let projects = student.projects.map( (project, j) =>
        <ListItem
          primaryText={`${project.name}`}
          secondaryText={`${project.actionsCount} actions. Edité ${ moment(project.end).fromNow()}`}
          onClick={this.handleClickProject.bind(this, project.projectId)}
          key={j}
        />
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
            rightIcon={<ContentSend />}
            primaryTogglesNestedList={true}
            onClick={this.handleClickStudent.bind(this, student)}
            nestedItems={projects}
          />
        )
      }
    )

    // console.log(students);
    return (
      <div>
        <Subheader>Elèves</Subheader>
        <List>
          {students}
        </List>
      </div>
    )
  }
}

const mapStateToProps = (state) => {

  return {
      projects : state.api.projects
  }
}

export default connect(mapStateToProps)(StudentsList)
