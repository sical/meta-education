import React from 'react'
import { connect } from 'react-redux'

import Checkbox from 'material-ui/Checkbox'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class BigListHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    const {
      style,
      handleSelectRow,
      allSelected,
      ...other
    } = this.props

    let rowAlignStyle = {
      whiteSpace: 'normal',
      lineHeight: '1em',
      textAlign : 'center'
    }

    let headerItems = this.props.headers.map(d => (
      <TableHeaderColumn
          style={ d.class ? {...style[d.class], ...rowAlignStyle} : {rowAlignStyle} }
          tooltip={`${d.tootltip}`}
          key={d.name}
          >
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
