import React from 'react'
import { connect } from 'react-redux'


import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import SortIcon from 'material-ui/svg-icons/action/swap-vert';

import BigListItem from './BigListItem.jsx'
import BigListHeader from './BigListHeader.jsx'

import { max } from 'd3-array'
import { scaleTime } from 'd3-scale';

import mean from 'simple-statistics/src/mean'
import standardDeviation from 'simple-statistics/src/standard_deviation'
import zScore from 'simple-statistics/src/z_score'

import store from '../../store'
import  { ActionTypes } from '../../actions'
import AsyncAPI from '../../AsyncAPI'

const headers = [
    {
      name : "Nom",
      tootltip : "Nom de l'étudiant",
      class : "name",
      sortable : "name"
    },
    {
      name : "Réseau",
      tootltip : "Voir le réseau",
      class: 'indicator',
      sortable : null
    },
    {
      name : "Nombre d’actions",
      tootltip : "Nombre d'ajouts/suppressions",
      class: 'indicator',
      sortable : "actionsCount"
    },
    {
      name : "Nombre de noeuds",
      tootltip : "Nombre total de noeuds dans le graphe final",
      class: 'indicator',
      sortable : "density"
    },
    {
      name : "Clarté de la démarche",
      tootltip : "Ratio entre ajout et suppression d'éléments dans le graphe (en %)'",
      class: 'indicator',
      sortable : "clarity"
    },
    {
      name : "Liens par noeud",
      tootltip : "Rapport entre nombre de liens et nombre de noeuds",
      class: 'indicator',
      sortable : "degree"
    },
    {
      name : "Médias associés",
      tootltip : "Nombre de médias et ressources externes utilisées dans le graphe.",
      class: 'indicator',
      sortable : "resourcesCount"
    },
    {
      name : "Evolution",
      tootltip : "Nombre d'éléments dans le graphe depuis sa création",
      sortable : null
    }
  ]

function sortFunc(a, b, key) {
  if (typeof(a[key]) === 'number') {
    return a[key] - b[key];
  }

  const ax = [];
  const bx = [];

  a[key].replace(/(\d+)|(\D+)/g, (_, $1, $2) => { ax.push([$1 || Infinity, $2 || '']); });
  b[key].replace(/(\d+)|(\D+)/g, (_, $1, $2) => { bx.push([$1 || Infinity, $2 || '']); });

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
    if (nn) return nn;
  }

  return ax.length - bx.length;
}


class BigList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data : [],
      selected　: [],
      sortAsc : true,
      sortCol : null
    }
  }

  handleSelectRow(selectedRows) {
    if(selectedRows == "all") {
      this.setState({selected : this.props.selectedProjects.map(d => d.id)})
      // e.stopPropagation() // rpevent default select all
    } else {
      let selectedProjectIds = selectedRows.map(d => this.props.selectedProjects[d].id)
      this.setState({selected : selectedProjectIds})
    }
  }

  sortByColumn(sortCol) {
    const sortAsc = this.state.sortCol === sortCol ? !this.state.sortAsc : true;
    console.log(sortCol, "sortCol")

    const sortedData = this.state.data.sort((a, b) => sortFunc(a, b, sortCol));
    if (!this.state.sortAsc) { sortedData.reverse(); }

    this.setState({
      data : sortedData,
      sortCol,
      sortAsc
    });
  }

  componentWillReceiveProps(nextProps) {

    let stats = nextProps.selectedProjects
      .map( d => {

        let stat = nextProps.stats[d.id]
        if (!stat) return {}

        let density = stat.network.nodes.length,
          id = d.id,
          end = d.end,
          name = d.userName,
          resourcesCount = stat.resources.length,
          degree = Number(stat.mediumDegree.toFixed(1)),
          clarity = Number(stat.clarity.toFixed(1)),
          maxEls = max(stat.series.map(d => d.count)),
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

    // get zScores
    let zDensities = this.getZScores(stats.map(d => d.density))
    let zResourcesCounts = this.getZScores(stats.map(d => d.resourcesCount))
    let zDegrees = this.getZScores(stats.map(d => d.degree))
    let zClarities = this.getZScores(stats.map(d => d.clarity))
    let zActionsCounts = this.getZScores(stats.map(d => d.actionsCount))

    let statsFinal = stats.map( (stat,i) => {

      let zDensity = zDensities[i],
        zResourcesCount = zResourcesCounts[i],
        zDegree = zDegrees[i],
        zClarity = zClarities[i],
        zActionsCount = zActionsCounts[i]

      return {
        ...stat,
        zDensity,
        zResourcesCount,
        zDegree,
        zClarity,
        zActionsCount
      }

    })


    this.setState({ data : statsFinal })

    console.log(nextProps);
    if(nextProps.selectedProjects)
      this.setState({selected : nextProps.selectedProjects.map(d => d.id)})
  }

  selectProject(projectId) {
    console.log("select", projectId);

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

  handleClickTableHeader(value) {
      console.log(this,value);
  }

  render() {

    const style = {
      indicator : {
        width : '40px'
      },
      name : {
        width : '100px'
      },
    }

    let h = 40 // timeSeries max height

    // heightScale for timeseries
    let heightScale = scaleTime()
        .domain([ 0, max(this.state.data.map(d=>d.maxEls))])
        .range([0,h])


    let statsItems = this.state.data
      .filter(stat => this.state.selected.indexOf(stat.id) > -1)
      .map( (stat,i) => {

        if(Object.keys(stat).length === 5) return null

        // sort ASCENDING
        let series = (stat.series  || []).sort( (a,b) => {
          let vB = new Date(b.ts),
            vA = new Date(a.ts)
          return vA < vB ?  -1 : vA > vB ?  1 : 0
        })

        let height = series.length ?
          heightScale(max(series.map(d=>d.count)))
          : 0

        return (

          <BigListItem
            style={style}
            stat={stat}

            series={series}
            maxHeight={h}
            heightSeries={height}
            selectProject={this.selectProject.bind(this)}
            selected={true}
            key={stat.id}
            />
        )
      })

    // console.log(this.props.selectedProjects);
    let allSelected = this.props.selectedProjects.length === this.state.selected.length

    let sorting = headers.map(d => (
      <TableRowColumn
        style={ d.class ? {...style[d.class] } : null }
        key={d.name}
        >
        {　
          d.sortable  ?
          <IconButton
            onMouseUp={this.sortByColumn.bind(this,d.sortable)}
           >
            <SortIcon
              style={{ width: 16, height: 16 }}
              color={ this.state.sortCol === d.sortable ? 'black' : 'rgb(158, 158, 158)' }
            />
          </IconButton>
           : null
         }
     </TableRowColumn>
   ))

    return (
      <Table
        selectable={false}
        multiSelectable={true}
        onRowSelection={ this.handleSelectRow.bind(this)}
        >
        <TableHeader
          adjustForCheckbox={true}
          >
          <BigListHeader
            style={style}
            allSelected={false}//{allSelected}
            headers={headers}
            handleSelectRow={this.handleSelectRow.bind(this)}
          />
        </TableHeader>
        <TableBody
          deselectOnClickaway={false}
          >
          <TableRow style={{height:'20px'}}>
            {sorting}
          </TableRow>
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
