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

    let valMean = mean(values)
    if(isNaN(valMean)) return values.map(d => 0)

    let standardDev = standardDeviation(values),
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

    let stats = this.props.selectedProjects.map( d => {

      let stat = this.props.stats[d.id]
      if (!stat) return {}

      let density = stat.network.nodes.length + stat.network.edges.length,
        id = d.id,
        end = d.end,
        name = d.userName,
        resourcesCount = stat.resources.length,
        degree = Number(stat.mediumDegree.toFixed(1)),
        clarity = Number(stat.clarity.toFixed(1)),
        maxEls = d3.max(stat.series.map(d => d.count)),
        actionsCount = d.actionsCount

      return {
        ...stat,
        id,
        end,
        name,
        actionsCount,
        density,
        resourcesCount,
        degree,
        maxEls,
        clarity
      }

    })

    // heightScale for timeseries
    let heightScale = d3.time.scale()
        .domain([ 0, d3.max(stats.map(d=>d.maxEls))])
        .range([0,h])

    // get zScores
    let zDensity = this.getZScores(stats.map(d => d.density))
    let zResourcesCount = this.getZScores(stats.map(d => d.resourcesCount))
    let zDegree = this.getZScores(stats.map(d => d.degree))
    let zClarity = this.getZScores(stats.map(d => d.clarity))
    let zActions = this.getZScores(stats.map(d => d.actionsCount))


    let statsItems = stats.map( (stat,i) => {

      if(Object.keys(stat).length === 0) return null

      // sort ASCENDING
      let series = (stat.series  || []).sort( (a,b) => {
        let vB = new Date(b.ts),
          vA = new Date(a.ts)
        return vA < vB ?  -1 : vA > vB ?  1 : 0
      })

      let height = series.length ?
        heightScale(d3.max(series.map(d=>d.count)))
        : 0

      return (


        <BigListItem
          style={style}
          userName={stat.name}

          resourcesCount={stat.resourcesCount}
          zResourcesCount={zResourcesCount[i]}

          density={stat.density}
          zDensity= {zDensity[i]}

          actionsCount={stat.actionsCount}
          zActionsCount={zActions[i]}

          degree={stat.degree}
          zDegree={zDegree[i]}

          clarity={stat.clarity}
          zClarity={zClarity[i]}

          series={series}
          maxHeight={h}
          heightSeries={height}
          end={stat.end}

          key={stat.id}
          id={stat.id}
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
              Actions
            　</TableHeaderColumn>
            <TableHeaderColumn style={style.indicator}>
              Noeuds/Liens
              </TableHeaderColumn>
            <TableHeaderColumn style={style.indicator}>
              Clarté
              </TableHeaderColumn>
            <TableHeaderColumn style={style.indicator}>
              Degré
              </TableHeaderColumn>
            <TableHeaderColumn style={style.indicator}>
              Ressources
              </TableHeaderColumn>
            <TableHeaderColumn>
                Evolution du nombre d'éléments
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
          {statsItems}
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
