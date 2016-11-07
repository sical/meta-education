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


class StudentsList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.dispatch(AsyncAPI.getProjectsList())
  }

  handleClickStudent (userId) {
    // this.props.dispatch(AsyncAPI.getProjectsList(userId))
  }

  handleClickProject (_id) {
    this.props.dispatch(AsyncAPI.getProject(_id))
  }

  render() {
    console.log(this.props.projects);
    let students = this.props.projects.map( (student,i) => {

      let projects = student.projects.map( (project, j) =>
        <ListItem
          primaryText={`project ${j} (${project.count} actions)`}
          onClick={this.handleClickProject.bind(this, project.projectId)}
          key={j}
        />
      )

      return (
        <ListItem
            primaryText={"student " + i}
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
      count: state.counter,
      isWaiting : state.api.isWaiting,
      students : state.api.students,
      projects : state.api.projects
  }
}

export default connect(mapStateToProps)(StudentsList)
