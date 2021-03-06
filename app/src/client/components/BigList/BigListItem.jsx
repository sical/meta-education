import React from 'react'

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import Visibility from 'material-ui/svg-icons/action/visibility';
import {TableRow, TableRowColumn} from 'material-ui/Table';

import ElementSerie from '../Stats/ElementSerie.jsx'
import Indicator from '../Stats/Indicator.jsx'
import Resources from '../Stats/Resources.jsx'

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
      series,
      style,
      heightSeries,
      elementsCount,
      maxHeight,
      selectProject,
      isSelected,
      stat,
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
       <TableRow
        {...other}
        selected={isSelected}
       >
        {other.children[0] /* checkbox passed down from Table-Body*/}
         <TableRowColumn
          style={style.name}
          >
           {stat.name}
         </TableRowColumn>

         <TableRowColumn
          style={style.indicator}
         >
           <IconButton
             onClick={e => {
               selectProject(stat.id)
               e.stopPropagation()
             }}
           >
             <Visibility />
           </IconButton>
         </TableRowColumn>

         <TableRowColumn style={style.indicator}>
           <Indicator
           count={stat.actionsCount}
           z={stat.zActionsCount}
           />
         </TableRowColumn>

         <TableRowColumn style={style.indicator}>
            <Indicator
             count={stat.density}
             z={stat.zDensity}
             />
          </TableRowColumn>

         <TableRowColumn style={style.indicator}>
           <Indicator
            count={stat.degree}
            z={stat.zDegree}
            />
         </TableRowColumn>

         <TableRowColumn style={style.indicator}>
           <Indicator
            count={stat.resourcesCount}
            z={stat.zResourcesCount}
            />
         </TableRowColumn>

         <TableRowColumn style={style.indicator}>
           <Indicator
            count={`${Math.round(stat.clarity)}%`}
            z={stat.zClarity}
            />
         </TableRowColumn>
         
         <TableRowColumn>
          { timeSeries }
         </TableRowColumn>

      </TableRow>
    )
  }
}
