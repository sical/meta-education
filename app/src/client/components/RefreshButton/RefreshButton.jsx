import React from 'react'
import { connect } from 'react-redux'

import {ListItem} from 'material-ui/List';

import store from '../../store'
import { ActionTypes } from '../../actions'
import AsyncAPI from '../../AsyncAPI'

class StatsButton extends React.Component {
  constructor(props) {
    super(props)
  }

  getStats() {
    // store.dispatch({ type : ActionTypes.GET_STATS, projects : this.props.selectedProjects })
    store.dispatch(AsyncAPI.getStats(this.props.selectedProjects.map(d => d.id)))
  }

  render() {

    let disabled  = this.props.selectedProjects.length ? false : true

    return <ListItem
        primaryText="Elèves"
        secondaryText="Click to reload data"
        disabled={disabled}
        onClick={this.getStats.bind(this)}
      />
  }
}

const mapStateToProps = (state) => {
  return {
      selectedProjects : state.api.selectedProjects
  }
}

export default connect(mapStateToProps)(StatsButton)
