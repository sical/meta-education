import React from 'react'
import Subject from 'material-ui/svg-icons/action/subject';

import {PieChart} from 'react-d3-components'
import {red500, greenA200} from 'material-ui/styles/colors';

export default class Pie extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let color = this.props.value > 8 ? red500 : greenA200

    let sort = null; // d3.ascending, d3.descending,

    return (
        <PieChart
          data={
            {
              values : [
                { y: this.props.value, x : "clear"},
                { y: 100-this.props.value, x : "unclear"}
              ]
            }
          }
          width={50}
          height={50}
          margin={{top: 0, bottom: 0, left: 0, right: 0}}
          sort={sort}
          hideLabels={true}
          />
    )
  }
}
