import React from 'react'
import { connect } from 'react-redux'

import {List} from 'material-ui/List';

import store from '../../store'
import  { ActionTypes } from '../../actions'
import AsyncAPI from '../../AsyncAPI'

import StudentsListItem from './StudentsListItem.jsx'
import StudentsListSubItem from './StudentsListSubItem.jsx'

class StudentsList extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    let self = this
    let students = this.props.projects.map( (student,i) => {

      let projects = student.projects.map( project => (
        <StudentsListSubItem
          key={i}
          project={project}
          userId={student.id}
          />
      ))

      return (
        <StudentsListItem
          key={i}
          student={student}
          nested={projects}
          selectedProjects={this.props.selectedProjects}
          />
      )
    })

    return (
      <div>
        <List>
          { students}
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
