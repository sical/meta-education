import React from 'react'
import { connect } from 'react-redux'

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
    maxWidth: "60%",
    flexBasis:"60%",
    order:1
  },
  graphs : {
    flexBasis:"40%",
    maxWidth: "40%",
    order:2,
    height:'100vh'
  },
  resources : {
    // backgroundColor : "red",
    // height : "20%",
    maxWidth : "100%"
  },
  network : {
    // backgroundColor : "steelblue",
    height : "60%"
  },
  timeSlider : {
    // backgroundColor : "green",
    height : "20%"
  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

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
          <ResourcesGrid
            style={style.resources}
            actions={this.props.actions}
            />
          <Card className="network" style={style.network}>
            <CardHeader
              title="Network"
              subtitle="Subtitle"
              // actAsExpander={true}
              // showExpandableButton={true}
            />
            <CardText>
           {
             this.props.actions.length ?
              <Network
                actions={this.props.actions}
                />
              :
              "network"
            }
            </CardText>
          </Card>
          <Card className="timeSlider" style={style.timeSlider}>
            <CardText>
           {
             this.props.actions.length ?
             <TimeSlider
               timestamps={this.props.timestamps}
             />
              :
              "time slider"
            }
            </CardText>
          </Card>
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
