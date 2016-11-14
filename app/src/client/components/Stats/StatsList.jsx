import React from 'react'
import { connect } from 'react-redux'

import moment from 'moment'

import {List} from 'material-ui/List';

import StatsListItem from './StatsListItem.jsx'

import * as d3 from 'd3';

class StatsList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let stats = Object.keys(this.props.stats).map( (id,i) => {
      return (
        <StatsListItem
          stat={this.props.stats[id]}
          projectId={id}
          handleClickStudentYo={this.props.handleClickStudentYo.bind(this)}
          key={i}
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
      stats : state.api.stats
  }
}

export default connect(mapStateToProps)(StatsList)
