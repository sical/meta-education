import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

import { connect } from 'react-redux'

import SideNav from '../components/SideNav.jsx'
import TopBar from '../components/TopBar.jsx'

import Dashboard from '../components/Dashboard.jsx'

import store from '../store'
import AsyncAPI from '../AsyncAPI'

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      projects : []
    }
  }

  componentWillMount() {
    store.dispatch(AsyncAPI.getClassesList())
  }

  componentDidMount () {

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
          students={this.props.classes}
        />
        { this.props.currentClasse ?
          <Dashboard />
          :
          null
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
      classes : state.api.classes,
      currentClasse : state.viz.currentClasse
  }
}

export default connect(mapStateToProps)(Home)
