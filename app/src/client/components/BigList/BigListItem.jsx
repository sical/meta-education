import React from 'react'
import * as d3 from 'd3';

import FlatButton from 'material-ui/FlatButton';
// import {ListItem} from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';
import {TableRow, TableRowColumn} from 'material-ui/Table';

import Pie from '../Stats/Pie.jsx'
// import Clarity from '../Stats/Clarity.jsx'
// import Density from '../Stats/Density.jsx'
// import Degree from '../Stats/Degree.jsx'

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
      ...other
    } = this.props

    let graphs = [
      density,
      clarity,
      degree,
      resourcesUsedPercent
    ].map( (d,i)=> d ?
        <TableRowColumn key={i}>
          <Pie value={d} />
        </TableRowColumn>
      : null
    )

    return (
       <TableRow {...other}>
        {other.children[0] /* checkbox passed down from Table-Body*/}
         <TableRowColumn>
           {userName}
         </TableRowColumn>

         { graphs }

        {/* <TableRowColumn>
          {`${ moment(end).fromNow()}`}
        </TableRowColumn>
        <TableRowColumn>
          {`${ moment(end).fromNow()}`}
        </TableRowColumn> */}
      </TableRow>
    )
  }
}

//{`Ressources : ${Math.floor(stat.resourcesUsedPercent)}% / Densité : ${stat.density} / degré : ${Math.round(stat.mediumDegree*100)} `}
// secondaryText={hover} //{`${Math.floor(stat.clarity)} actions. Edité ${ moment(stat.end).fromNow()}`}
// // className={ isSelected > -1 ? "selected" : null}
