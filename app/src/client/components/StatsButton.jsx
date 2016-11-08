import React from 'react'
import { connect } from 'react-redux'

import FlatButton from 'material-ui/FlatButton';

import { ActionTypes } from '../actions'

import store from '../store'
import AsyncAPI from '../AsyncAPI'

class StatsButton extends React.Component {
  constructor(props) {
    super(props)
  }

  getStats() {
    // store.dispatch({ type : ActionTypes.GET_STATS, projects : this.props.selectedProjects })
    store.dispatch(AsyncAPI.getStats(this.props.selectedProjects))
  }

  render() {
    let button  = this.props.selectedProjects.length ?
      <FlatButton
        label="Get Stats"
        onClick={this.getStats.bind(this)}
        />
      :
        null

    return button
  }
}

const mapStateToProps = (state) => {
  return {
      selectedProjects : state.viz.selectedProjects
  }
}

export default connect(mapStateToProps)(StatsButton)
