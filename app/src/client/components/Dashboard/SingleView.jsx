import React from 'react'


import Network from '../Network/Network.jsx'
import TimeSlider from '../TimeSlider/TimeSlider.jsx'
import ResourcesGrid from '../ResourcesGrid/ResourcesGrid.jsx'

import Divider from 'material-ui/Divider';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import Face from 'material-ui/svg-icons/action/face';
import Clear from 'material-ui/svg-icons/content/clear';

import store from '../../store'
import  { ActionTypes } from '../../actions'

let style = {
  resources : { maxWidth : "100%" },
  network : {　height : "60%"　},
  timeSlider : {　height : "20%"}
}

export default class SingleView extends React.Component {
  constructor(props) {
    super(props)
  }

  handleExpandChange() {
    store.dispatch({ type : ActionTypes.HIDE_PROJECT})
  }

  render() {

    let project = this.props.selectedProjects.filter(p => p.id == this.props.currentProject)[0] || {}

    return (
      <div className="graphs" >
        <Card
          className="network"
          onExpandChange={this.handleExpandChange.bind(this)}
          >
          <CardHeader
            title={`${project.userName}`}
            avatar={<Face />}
            showExpandableButton={true}
            openIcon={<Clear />}
            closeIcon={<Clear />}
          />
        </Card>
        <Divider />
        <ResourcesGrid
          style={style.resources}
          actions={this.props.actions}
          />
        <Card
          className="network"
          style={style.network}
          initiallyExpanded={true}
          >
          <CardHeader
            title={`Réseau (navigation temporelle)`}
            subtitle={`${project.actionsCount} actions`}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
         {
           this.props.actions.length ?
            <Network
              actions={this.props.actions}
              />
            :
            "network"
          }
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
    )
  }
}
