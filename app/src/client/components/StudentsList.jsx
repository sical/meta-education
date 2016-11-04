import React from 'react'
import { connect } from 'react-redux'

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionFace from 'material-ui/svg-icons/action/face';
import ContentSend from 'material-ui/svg-icons/content/send';

import Subheader from 'material-ui/Subheader';

import store from '../store'
import  {ActionTypes} from '../actions'
import AsyncAPI from '../api'


class StudentsList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.dispatch(AsyncAPI.getStudentsList())
  }

  handleClickStudent (userId) {
    this.props.dispatch(AsyncAPI.getProjectsList(userId))
  }

  handleClickProject (_id) {
    this.props.dispatch(AsyncAPI.getProject(_id))
  }

  render() {

    let projects = this.props.projects.map( (p, i) =>
      <ListItem
        primaryText={`project ${i} (${p.value} actions)`}
        onClick={this.handleClickProject.bind(this, p._id)}
        key={i}
      />
    )

    let students = this.props.students.map( (id, i) =>
      <ListItem
          primaryText={"Brendan Lim"}
          key={i}
          leftAvatar={
            <Avatar
            icon={<ActionFace />}
             />
          }
          rightIcon={<ContentSend />}
          primaryTogglesNestedList={true}
          onClick={this.handleClickStudent.bind(this, id)}
          nestedItems={projects}
        />
    )

    return (
      <div>
        <Subheader>Selectable Contacts</Subheader>
        <List>
          {students}
        </List>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // console.log(state);
    return {
        count: state.counter,
        isWaiting : state.apiReducer.isWaiting,
        students : state.apiReducer.students,
        projects : state.apiReducer.projects
    }
}

export default connect(mapStateToProps)(StudentsList)
