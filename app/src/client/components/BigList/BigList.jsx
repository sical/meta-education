import React from 'react'
import { connect } from 'react-redux'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from 'material-ui/Table';

import BigListItem from './BigListItem.jsx'

import * as d3 from 'd3';

import store from '../../store'
import  { ActionTypes } from '../../actions'
import AsyncAPI from '../../AsyncAPI'

class BigList extends React.Component {
  constructor(props) {
    super(props)
  }

  selectRow(selectedRows) {

    let projectId = selectedRows.length ? this.props.selectedProjects[selectedRows[0]].id : null
    // console.log("select", projectId);

    if (projectId
      &&　! this.props.currentProject
      || this.props.currentProject != projectId
    ){
      store.dispatch({ type : ActionTypes.SHOW_PROJECT, projectId : projectId})
      store.dispatch(AsyncAPI.getProject(projectId))
    }
  }

  render() {

    let maxEls = this.props.selectedProjects.map( d => {
      let stat = this.props.stats[d.id]
      return stat ? d3.max(stat.series.map(d => d.count)) : 0
    })

    let maxTs = this.props.selectedProjects.map( d => {
      let stat = this.props.stats[d.id]
      return stat ? d3.max(stat.series.map(d => new Date(d.ts))) : 0
    })

    let minTs = this.props.selectedProjects.map( d => {
      let stat = this.props.stats[d.id]
      return stat ? d3.min(stat.series.map(d => new Date(d.ts))) : 0
    })

    let maxSeries = {
      count : d3.max(maxEls),
      maxTs : d3.max(maxTs),
      minTs : d3.max(minTs)
    }
    console.log(maxSeries);

    let stats = this.props.selectedProjects.map( project => {
      let stat = this.props.stats[project.id] || {}
      // console.log(stat);
      return (
        <BigListItem
          userName={project.userName}
          resourcesUsedPercent={stat.resourcesUsedPercent}
          end={project.end}
          density={stat.density}
          clarity={Math.floor(stat.clarity)}
          degree={Math.round(stat.mediumDegree*100)}
          series={stat.series || []}
          maxSeries={maxSeries}
          key={project.id}
          id={project.id}
          />
      )
    })

    return (
      <Table
        selectable={true}
        // multiSelectable={true}
        onRowSelection={this.selectRow.bind(this)}
        >
        <TableHeader>
          <TableRow>
             <TableHeaderColumn>Nom</TableHeaderColumn>
             <TableHeaderColumn>Nombre de Noeuds/Liens</TableHeaderColumn>
             <TableHeaderColumn>Noeuds avec ressources</TableHeaderColumn>
             {/* <TableHeaderColumn>Densité</TableHeaderColumn>
             <TableHeaderColumn>Degré</TableHeaderColumn> */}
           </TableRow>
        </TableHeader>
        <TableBody
          deselectOnClickaway={false}
          >
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
