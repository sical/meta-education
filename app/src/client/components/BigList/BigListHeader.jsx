import React from 'react'
import { connect } from 'react-redux'

import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox'
import SortIcon from 'material-ui/svg-icons/action/swap-vert';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from 'material-ui/Table';

export default class BigListHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    const {
      style,
      handleSelectRow,
      sortByColumn,
      allSelected,
      ...other
    } = this.props

    let rowAlignStyle = {}

    let headerItems = this.props.headers.map(d => (
      <TableHeaderColumn
          style={ d.class ? {...style[d.class], ...rowAlignStyle} : {rowAlignStyle} }
          tooltip={`${d.tootltip}`}
          key={d.name}
          >
          {　
            d.sortable  ?
            <IconButton
              onMouseUp={sortByColumn.bind(this,d.sortable)}
             >
              <SortIcon
                color={'rgb(158, 158, 158)'}
              />
             </IconButton>
             : null
           }
           {d.name}
        　</TableHeaderColumn>
    ))

    return (
      <TableRow>
        <TableHeaderColumn style={{ width : '20px'}}>
          <Checkbox
            onCheck={handleSelectRow.bind(this, "all")}
            checked={allSelected}
            disabled={true}
          />
        </TableHeaderColumn>
        {headerItems}
       </TableRow>
    )
  }


}
