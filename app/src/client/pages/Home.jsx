import React from "react";
import RaisedButton from 'material-ui/RaisedButton';

import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import SideNav from '../components/SideNav.jsx'
import TopBar from '../components/TopBar/TopBar.jsx'

import Dashboard from '../components/Dashboard.jsx'

import { ActionTypes } from '../actions'
import store from '../store'
import AsyncAPI from '../AsyncAPI'


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      projects : [],
      defaultClassLoaded: false
    }
  }

  componentWillMount() {
    store.dispatch(AsyncAPI.getClassesList())
  }

  componentWillReceiveProps(nextProps) {

    if(nextProps.currentClasse && !this.state.defaultClassLoaded) {
      this.selectClasse(nextProps.currentClasse)
      this.setState({ defaultClassLoaded : true})
    }

    if(nextProps.selectedProjects.length)
      store.dispatch(AsyncAPI.getStats(nextProps.selectedProjects.map(d => d.id)))
  }

  selectClasse(classeId) {
    store.dispatch(push('#'+classeId))
    store.dispatch({ type : ActionTypes.SELECT_CLASSE, currentClasse : classeId })
    store.dispatch(AsyncAPI.getProjectsList(classeId))
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
          currentClasse={this.props.currentClasse}
          selectClasse={this.selectClasse}
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

  let  currentClasse = state.routing.locationBeforeTransitions.hash.replace('#','')

  return {
      classes : state.api.classes,
      currentClasse : state.api.currentClasse || currentClasse,
      selectedProjects : state.api.selectedProjects
  }
}

export default connect(mapStateToProps)(Home)
