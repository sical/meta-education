import React from 'react'


import Network from '../Network/Network.jsx'
import TimeSlider from '../TimeSlider/TimeSlider.jsx'
import ResourcesGrid from '../ResourcesGrid/ResourcesGrid.jsx'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Face from 'material-ui/svg-icons/action/face';


let style = {
  resources : { maxWidth : "100%" },
  network : {　height : "60%"　},
  timeSlider : {　height : "20%"}
}

export default class SingleView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    let project = this.props.selectedProjects.filter(p => p.id == this.props.currentProject)[0] || {}

    return (
      <div className="graphs" >
        <Card className="network">
          <CardHeader
            title={`${project.userName}`}
            avatar={<Face />}
          />
        </Card>
        <Divider />
        <ResourcesGrid
          style={style.resources}
          actions={this.props.actions}
          />
        <Card className="network" style={style.network}>
          <CardHeader
            title={`Network`}
            subtitle={`${project.actionsCount} actions -- ${project.userName}`}
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
    )
  }
}
