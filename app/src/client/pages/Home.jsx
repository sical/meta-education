import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import { connect, PromiseState } from 'react-refetch'

import SideNav from '../components/SideNav.jsx'
import TopBar from '../components/TopBar.jsx'
import Dashboard from '../components/Dashboard.jsx'

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      projects : []
    }
  }

  componentDidMount () {
  }

  toggleSideNav = () => {
   const toggled = this.refs.sideNav.state.open ? false : true
   this.refs.sideNav.setState({ open : toggled })
  }

  render() {

    // const { userProjects, studentsList } = this.props
    //
    // // check if projects are fetched
    // let projects = userProjects.fulfilled ? userProjects.value.projects : []
    // let students = studentsList.fulfilled ? studentsList.value.students : []
    let projects = [],
      students = ["1"]

    return (
      <div>
        <TopBar onHomeButtonClick={this.toggleSideNav} />
        <SideNav
          ref="sideNav"
          projects={projects}
        />
        <Dashboard
          projects={projects}
          students={students}
        />
      </div>
    )
  }
}
