import React from 'react'
import * as d3 from 'd3';

import FlatButton from 'material-ui/FlatButton';
// import {ListItem} from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';
import {TableRow, TableRowColumn} from 'material-ui/Table';

import Pie from '../Stats/Pie.jsx'
import Density from '../Stats/Density.jsx'
import Resources from '../Stats/Resources.jsx'
import TimeSeries from '../Stats/TimeSeries.jsx'


import moment from 'moment'
moment.locale('fr')

export default class BigListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: null
    }
  }

  handleHover(statId) {
    this.setState({ hover : statId })
  }

  handleHoverOut() {
    this.setState({ hover : null })
  }

  render() {

    const { // unpack props
      id,
      userName,
      end,
      density,
      clarity,
      degree,
      resourcesUsedPercent,
      volumen,
      series,
      heightSeries,
      elementsCount,
      maxHeight,
      resources,
      ...other
    } = this.props

    // make timeChart
    let w = 100,
        h = this.props.heightSeries || 0

    let xScale =
      series.length ?
      d3.time.scale()
        .domain([
          d3.min(series.map(d=>new Date(d.ts))),
          d3.max(series.map(d=>new Date(d.ts)))
        ])
        .range([w,0])
      : null

    let yScale =
      series.length ?
      d3.scale.linear()
        .domain([0, d3.max(series.map(d=>d.count))])
        .range([0,h])
      : null

    let timeSeriesData = xScale && yScale && series.length ?
      series.map(d => ( { x: new Date(d.ts), y : d.count } ))
      :
      null

    let timeSeries = timeSeriesData ?
      <TimeSeries
        data={timeSeriesData}
        width={w}
        height={h}
        maxHeight={maxHeight}
        xScale={xScale}
        yScale={yScale}
        />
      : null


    return (
       <TableRow {...other}>
        {other.children[0] /* checkbox passed down from Table-Body*/}
         <TableRowColumn>
           {userName}
         </TableRowColumn>

         { density ?
            <TableRowColumn>
              <Density
               count={elementsCount}
               density={density}
               />
            </TableRowColumn>
            :
            null
          }

         <TableRowColumn>
          { timeSeries }
         </TableRowColumn>

         <TableRowColumn>
           { resources ?
             <Resources resources={resources} />
             :
             null
           }
         </TableRowColumn>




        {/*
          <TableRowColumn>
            {`${ moment(end).fromNow()}`}
          </TableRowColumn>
        */}


      </TableRow>
    )
  }
}

//{`Ressources : ${Math.floor(stat.resourcesUsedPercent)}% / Densité : ${stat.density} / degré : ${Math.round(stat.mediumDegree*100)} `}
// secondaryText={hover} //{`${Math.floor(stat.clarity)} actions. Edité ${ moment(stat.end).fromNow()}`}
// // className={ isSelected > -1 ? "selected" : null}
