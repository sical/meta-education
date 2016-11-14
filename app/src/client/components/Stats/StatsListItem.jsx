import React from 'react'

import moment from 'moment'
import * as d3 from 'd3';

import FlatButton from 'material-ui/FlatButton';
import {ListItem} from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';

import Clarity from './Clarity.jsx'
import Density from './Density.jsx'
import Degree from './Degree.jsx'

export default class StatsListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: null
    }
  }

  handleHover(statId) {
    console.log(this);
    console.log("hover", statId);
    this.setState({ hover : statId })
  }

  handleHoverOut() {
    this.setState({ hover : null })
  }

  render() {

    let clarity = Math.floor(this.props.stat.clarity),
      density = this.props.stat.density,
      degree = Math.round(this.props.stat.mediumDegree*100)

    let hover = ""
    switch (this.state.hover) {
      case "clarity" :
        hover = "clarity : " + clarity;
        break;
      case "density" :
        hover = "density : " + density;
        break;
      case "degree" :
        hover = "degree : " + degree;
        break;
      default :
        hover = "  ";
    }

    let style = {marginRight : "1.3em"}
    return (
        <ListItem
          primaryText={
            (
             <span>
               <Density
                  value={density}
                  style={style}
                  handleHover={this.handleHover.bind(this)}
                  handleHoverOut={this.handleHoverOut.bind(this)}
                />
                <Clarity
                  style={style}
                  value={clarity}
                  handleHover={this.handleHover.bind(this)}
                  handleHoverOut={this.handleHoverOut.bind(this)}
                  />
                <Degree
                  style={style}
                  value={degree}
                  handleHover={this.handleHover.bind(this)}
                  handleHoverOut={this.handleHoverOut.bind(this)}
                  />
             </span>
           )
          } //{`Ressources : ${Math.floor(stat.resourcesUsedPercent)}% / Densité : ${stat.density} / degré : ${Math.round(stat.mediumDegree*100)} `}
          secondaryText={hover} //{`${Math.floor(stat.clarity)} actions. Edité ${ moment(stat.end).fromNow()}`}
          onClick={this.props.handleClickStudentYo.bind(this,this.props.projectId)}
          // className={ isSelected > -1 ? "selected" : null}
          />
      )
  }
}
