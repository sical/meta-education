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

      let projects = student.projects.map( (project,j) => (
        <StudentsListSubItem
          key={i+'_'+j}
          project={project}
          userId={student.id}
          isSelected={self.props.selectedProjects.map(d => d.id).indexOf(project.id) > -1 ? true : false}
          />
      ))

      return (
        <StudentsListItem
          key={i}
          student={student}
          nested={projects}
          handleSelectProject={this.props.handleSelectProject}
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
      currentClasse : state.api.currentClasse,
      stats : state.api.stats,
      currentProject : state.viz.currentProject
  }
}

export default connect(mapStateToProps)(StudentsList)
