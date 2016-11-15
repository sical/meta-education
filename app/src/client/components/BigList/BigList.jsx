import React from 'react'
import { connect } from 'react-redux'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from 'material-ui/Table';

import BigListItem from './BigListItem.jsx'

import * as d3 from 'd3';

class BigList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    let stats = this.props.selectedProjects.map( project => {
      let stat = this.props.stats[project.id] || {}

      return (
        <BigListItem
          userName={project.userName}
          end={project.end}
          density={stat.density}
          clarity={Math.floor(stat.clarity)}
          degree={Math.round(stat.mediumDegree*100)}
          key={project.id}
          id={project.id}
          // handleClickStudentYo={this.props.handleClickStudentYo.bind(this)}
          />
      )
    })

    return (
      <Table
        selectable={true}
        multiSelectable={true}
        >
        <TableHeader>
          <TableRow>
             <TableHeaderColumn>Nom</TableHeaderColumn>
             <TableHeaderColumn>Dernier changement</TableHeaderColumn>
             <TableHeaderColumn>Densité</TableHeaderColumn>
             <TableHeaderColumn>Clarté</TableHeaderColumn>
             <TableHeaderColumn>Degré</TableHeaderColumn>
           </TableRow>
        </TableHeader>
        <TableBody>
          {stats}
        </TableBody>
      </Table>
    )
  }

}

const mapStateToProps = (state) => {
  return {
      stats : state.api.stats,
      selectedProjects : state.api.selectedProjects,
  }
}

export default connect(mapStateToProps)(BigList)
