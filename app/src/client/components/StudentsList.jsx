import React from 'react'
import { connect } from 'react-redux'

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionFace from 'material-ui/svg-icons/action/face';
import ContentSend from 'material-ui/svg-icons/content/send';

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

  handleClick (id) {
    // store.dispatch({ type: 'INCREMENT' })
    store.dispatch(AsyncAPI.getProjectsList(id))
  }

  render() {
    console.log(this.props);
    let students = this.props.students.map( (id, i) =>
      <ListItem
          primaryText={"Brendan Lim  " }
          key="i"
          leftAvatar={
            <Avatar
            icon={<ActionFace />}
             />
          }
          rightIcon={<ContentSend />}
          onClick={this.handleClick.bind(this, id)}
        />
    )
    // 
    // let projects = this.props.projects.map( (p, i) =>
    //
    // )

    return (
      <List>
        {students}
      </List>
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
