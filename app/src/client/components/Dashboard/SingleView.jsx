import React from 'react'

import Network from '../Network/Network.jsx'
import TimeSlider from '../TimeSlider/TimeSlider.jsx'
import ResourcesGrid from '../ResourcesGrid/ResourcesGrid.jsx'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

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

    return (
      <div className="graphs" >
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
    )
  }
}
