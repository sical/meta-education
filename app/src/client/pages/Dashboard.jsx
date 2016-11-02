import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

import getProjects from "../api"
import SideNav from '../components/SideNav.jsx'
import TopBar from '../components/TopBar.jsx'

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      projects : []
    }
  }

  componentDidMount () {
    // GET Projects for this user
     getProjects(this.props.userId, function(err, results) {
        this.setState({ projects: results.projects});
     }.bind(this));
  }

  toggleSideNav = () => {
   const toggled = this.refs.sideNav.state.open ? false : true
   this.refs.sideNav.setState({ open : toggled })
  }

  render() {
    return (
      <div>
        <TopBar onHomeButtonClick={this.toggleSideNav} />
        <SideNav
          ref="sideNav"
          projects={this.state.projects}
        />
      </div>
    )
  }
}
