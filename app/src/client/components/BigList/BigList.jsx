import React from 'react'
import { connect } from 'react-redux'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from 'material-ui/Table';

import BigListItem from './BigListItem.jsx'

import * as d3 from 'd3';
import { mean, standardDeviation, zScore } from 'simple-statistics'

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
    } else if (this.props.currentProject == projectId) {
      store.dispatch({ type : ActionTypes.HIDE_PROJECT})
    }
  }

  getZScores(values) {
    console.log(values);
    let valMean = mean(values),
      standardDev = standardDeviation(values),
      zScores = values.map(d => zScore(d, valMean, standardDev))

    return zScores.map( z => {
        if (-1 <= z && z <= 1) return 1
        else if ((-2 <= z && z < -1) || (1< z && z <= 2)) return 2
        else if (z < -2 || z > 2) return 3
      })
  }

  render() {

    const style = {
      indicator : {
        width : '50px'
      },
      name : {
        width : '150px'
      },
    }

    let h = 40 // timeSeries max height

    // number of nodes+ length
    let elementsCount = this.props.selectedProjects.map( d => {
      return this.props.stats[d.id] ? this.props.stats[d.id].network.nodes.length
      + this.props.stats[d.id].network.edges.length : 0
    })
    let elementsCountGroups = this.getZScores(elementsCount)

    // resources
    let resourcesCount = this.props.selectedProjects.map( d => {
      return this.props.stats[d.id] ? this.props.stats[d.id].resources.length : 0
    })

    let resourcesCountScale = d3.scale.linear()
        .domain([ 0,d3.max(resourcesCount)])
        .range([0,30])

    let zResourcesCount = this.getZScores(resourcesCount)

    // number of elements
    let maxEls = this.props.selectedProjects.map( d => {
      let stat = this.props.stats[d.id]
      return stat ? d3.max(stat.series.map(d => d.count)) : 0
    })

    let heightScale = d3.time.scale()
        .domain([ 0, d3.max(maxEls)])
        .range([0,h])

    // degree
    let degrees = this.props.selectedProjects.map( d => {
      let stat = this.props.stats[d.id]
      return stat ? stat.mediumDegree.toFixed(1) : 0
    })

    let zDegrees = this.getZScores(degrees)

    // clarity
    let clarities = this.props.selectedProjects.map( d => {
      let stat = this.props.stats[d.id]
      return stat ? stat.clarity.toFixed(1) : 0
    })

    let zClarities = this.getZScores(clarities)

    // actions
    let actionsCounts = this.props.selectedProjects.map( d => d.actionsCount)
    let zActions = this.getZScores(actionsCounts)

    let stats = this.props.selectedProjects.map( (project,i) => {
      let stat = this.props.stats[project.id] || {}

      // sort ASCENDING
      let series = (stat.series  || []).sort( (a,b) => {
        let vB = new Date(b.ts),
          vA = new Date(a.ts)
        return vA < vB ?  -1 : vA > vB ?  1 : 0
      })

      let height = series.length ?
        heightScale(d3.max(series.map(d=>d.count)))
        : 0

      let resSize = stat.resources ?
        resourcesCountScale(stat.resources.length)
        : 0

      return (


        <BigListItem
          userName={project.userName}

          resources={resSize}
          zResourcesCount={zResourcesCount[i]}
          resourcesCount={resourcesCount[i]}

          end={project.end}

          density={elementsCountGroups[i]}
          elementsCount= {elementsCount[i]}

          style={style}
          zActionsCount={zActions[i]}
          actionsCount={actionsCounts[i]}

          degree={degrees[i]}
          zDegree={zDegrees[i]}

          clarity={clarities[i]}
          zClarity={zClarities[i]}

          series={series}
          maxHeight={h}
          heightSeries={height}

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
             <TableHeaderColumn style={style.name}>
              Nom
             </TableHeaderColumn>
             <TableHeaderColumn style={style.indicator}>
              Nombre d'actions'
            </TableHeaderColumn>
             <TableHeaderColumn style={style.indicator}>
              Nombre de Noeuds+Liens
              </TableHeaderColumn>
             <TableHeaderColumn style={style.indicator}>
              Clarté
              </TableHeaderColumn>
             <TableHeaderColumn style={style.indicator}>
              Ressources
              </TableHeaderColumn>
             <TableHeaderColumn style={style.indicator}>
              Degré
              </TableHeaderColumn>
             <TableHeaderColumn>
              Evolution du nombre d'éléments'
              </TableHeaderColumn>

             {/*
               <TableHeaderColumn>Densité</TableHeaderColumn>
               <TableHeaderColumn>Dernier changement</TableHeaderColumn>
             */}
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
