import React from 'react'
import { connect } from 'react-redux'

import Checkbox from 'material-ui/Checkbox'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from 'material-ui/Table';
import SortIcon from 'material-ui/svg-icons/action/swap-vert';



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


    const headers = [
      {
        name : "Nom",
        tootltip : "Nom de l'étudiant",
        sortable : "name"
      },
      {
        name : "Actions",
        tootltip : "Nombre d'ajouts/suppressions",
        sortable : "actionsCount"
      },
      {
        name : "Eléments",
        tootltip : "Nombre total de noeuds et de liens dans le graphe final",
        sortable : "elementsCount"
      },
      {
        name : "Clarté",
        tootltip : "Ratio entre ajout et suppression de nodes",
        sortable : "clarity"
      },
      {
        name : "Degré",
        tootltip : "Rapport entre nombre de liens et nombre de noeuds",
        sortable : "degree"
      },
      {
        name : "Médias",
        tootltip : "Nombre de médias et ressources externes utilisées dans le graphe.",
        sortable : "resourcesCount"
      },
      {
        name : "Evolution",
        tootltip : "Nombre d'éléments dans le graphe depuis sa création",
        sortable : null
      },
      {
        name : "Réseau",
        tootltip : "Voir le réseau",
        sortable : "reseau"
      }
    ]

    let headerItems = headers.map(d => (

      <TableHeaderColumn
          style={
            d.sortable === "name" ?
              style.name :
              d.sortable === null ? null : style.indicator
          }
          tooltip={d.tooltip}
          key={d.name}
          >
          {d.name}
        　</TableHeaderColumn>
    ))

    return (
      <TableRow>
        <TableHeaderColumn>
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
