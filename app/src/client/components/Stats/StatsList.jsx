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

  componentWillMount() {
    store.dispatch(AsyncAPI.getStats(this.props.selectedProjects.map(d => d.id)))
  }


  render() {
    let self = this
    console.log(this.props.stats);
    let stats = Object.keys(this.props.stats).map( (id,i) => {
      let stat = self.props.stats[id]
      let isSelected = -1

      return (
        <ListItem
          primaryText={`Ressources : ${Math.floor(stat.resourcesUsedPercent)}% / Densité : ${stat.density} / degré : ${Math.round(stat.mediumDegree*100)} `}
          secondaryText={`${Math.floor(stat.clarity)} actions. Edité ${ moment(stat.end).fromNow()}`}
          // onClick={this.handleClickProject.bind(this, id)}
          key={i}
          className={ isSelected > -1 ? "selected" : null}
          rightIcon={<ContentSend />}
          />
      )
    })

    return (
      <List>
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
