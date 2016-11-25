import React from 'react'
import * as d3 from 'd3';

import FlatButton from 'material-ui/FlatButton';
import ContentSend from 'material-ui/svg-icons/content/send';
import {TableRow, TableRowColumn} from 'material-ui/Table';

import ElementSerie from '../Stats/ElementSerie.jsx'
import Indicator from '../Stats/Indicator.jsx'
import Resources from '../Stats/Resources.jsx'


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
      resourcesUsedPercent,
      volumen,
      series,
      heightSeries,
      elementsCount,
      maxHeight,
      resources,
      actionsCount,
      zActionsCount,
      resourcesCount,
      zResourcesCount,
      degree,
      zDegree,
      clarity,
      zClarity,
      style,
      ...other
    } = this.props

    // make timeChart
    let timeSeries = series.length ?
      <ElementSerie
        series={series}
        width={100}
        height={heightSeries}
        maxHeight={maxHeight}
        />
      : null


    return (
       <TableRow {...other}>
        {other.children[0] /* checkbox passed down from Table-Body*/}
         <TableRowColumn style={style.name}>
           {userName}
         </TableRowColumn>

         <TableRowColumn style={style.indicator}>
         { actionsCount ?
           <Indicator
           count={actionsCount}
           density={zActionsCount}
           />
           :
           null
         }
         </TableRowColumn>

         <TableRowColumn style={style.indicator}>
           { density ?
                <Indicator
                 count={elementsCount}
                 density={density}
                 />
              :
              null
            }
          </TableRowColumn>

          <TableRowColumn style={style.indicator}>
            { clarity ?
              <Indicator
               count={clarity}
               density={zClarity}
               />
              :
              null
            }
          </TableRowColumn>

         <TableRowColumn style={style.indicator}>
           { degree ?
             <Indicator
              count={degree}
              density={zDegree}
              />
             :
             null
           }
         </TableRowColumn>

         <TableRowColumn style={style.indicator}>
           { resources ?
             <Indicator
              count={resourcesCount}
              density={zResourcesCount}
              />
             :
             null
           }
         </TableRowColumn>

         <TableRowColumn>
          { timeSeries }
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
