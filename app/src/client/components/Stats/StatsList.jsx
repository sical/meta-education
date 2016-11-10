import React from 'react'
import { connect } from 'react-redux'

import moment from 'moment'

import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';

import { ActionTypes } from '../../actions'
import AsyncAPI from '../../AsyncAPI'
import store from '../../store'

import RefreshButton from '../RefreshButton/RefreshButton.jsx'

class StatsList extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClickProject(projectId) {
    console.log("select :", projectId);
    if (! this.props.currentProject || this.props.currentProject != projectId ) {
      store.dispatch({ type : ActionTypes.SHOW_PROJECT, projectId : projectId})
      store.dispatch(AsyncAPI.getProject(projectId))
    }
    else store.dispatch({ type : ActionTypes.HIDE_PROJECT})
  }

  render() {
    let self = this

    let stats = Object.keys(this.props.stats).map( (id,i) => {
      let stat = self.props.stats[id]
      let isSelected = -1

      // {stat.clarity} / {stat.density} / {stat.mediumDegree} / {stat.resourcesUsedPercent}%
      return (
        <ListItem
          primaryText={`${stat.id}`}
          secondaryText={`${stat.clarity} actions. Edité ${ moment(stat.end).fromNow()}`}
          onClick={this.handleClickProject.bind(this, id)}
          key={i}
          className={ isSelected > -1 ? "selected" : null}
          rightIcon={<ContentSend />}
          />
      )
    })

    return (
      <List>
        {
          this.props.selectedProjects.length ?
            <RefreshButton />
            :
            null
        }
        {stats}
      </List>
    )
  }

}

const mapStateToProps = (state) => {
  return {
      stats : state.api.stats,
      selectedProjects : state.api.selectedProjects,
      currentProject : state.viz.currentProject
  }
}

export default connect(mapStateToProps)(StatsList)
