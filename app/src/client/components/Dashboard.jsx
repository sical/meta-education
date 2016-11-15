import React from 'react'
import { connect } from 'react-redux'

import {Grid, Row, Col} from 'react-flexbox-grid';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import Network from './Network/Network.jsx'
import TimeSlider from './TimeSlider/TimeSlider.jsx'

import ResourcesGrid from './ResourcesGrid/ResourcesGrid.jsx'

import BigList from './BigList/BigList.jsx'

import {List, ListItem} from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';

import store from '../store'
import  { ActionTypes } from '../actions'
import AsyncAPI from '../AsyncAPI'

let style =  {
  main : {
    "display":"flex",
    "flexDirection":"row",
    "flexWrap":"wrap",
    "justifyContent":"flex-start",
    "alignItems":"stretch"
  },
  bigList : {
    // width: '50%',
    flexBasis:"50%",
    order:1
  },
  graphs : {
    flexBasis:"50%",
    order:2
  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let graphs = this.props.actions.length ?
        (
          <div>
            <ResourcesGrid
                actions={this.props.actions}
              />
            <Network
              actions={this.props.actions}
              />
            <TimeSlider
              timestamps={this.props.timestamps}
            />
          </div>
        )
      :
      null

    return (
      <div
        className="main"
        style={style.main}
        >
        <div
          className="bigList"
          style={style.bigList}
          >
          {
            this.props.selectedProjects.length ?
            <BigList />
            : null
          }
        </div>
        <div
          className="graphs"
          style={style.graphs}
          >
          {graphs}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    let loaded = state.api.actions.length ? true : false
    return {
      timestamps : state.api.timestamps,
      actions : state.api.actions,
      selectedProjects : state.api.selectedProjects
    }
}

export default connect(mapStateToProps)(Dashboard)
