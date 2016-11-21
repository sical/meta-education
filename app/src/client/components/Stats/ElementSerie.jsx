import React from 'react'
import Avatar from 'material-ui/Avatar';

import {red300, green100, green500} from 'material-ui/styles/colors';

import TimeSeries from '../Chart/TimeSeries.jsx'

export default class ElementsSeries extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {

    let {
      series,
      maxHeight,
      height,
      width
    } = this.props

    let xScale =
      d3.time.scale()
        .domain([
          d3.min(series.map(d=>new Date(d.ts))),
          d3.max(series.map(d=>new Date(d.ts)))
        ])
        .range([width,0])

    let yScale =
      d3.scale.linear()
        .domain([0, d3.max(series.map(d=>d.count))])
        .range([0,height])

    let timeSeriesData = series.map(d => ( { x: new Date(d.ts), y : d.count } ))

    return (
      <TimeSeries
        data={timeSeriesData}
        width={width}
        height={height}
        maxHeight={maxHeight}
        xScale={xScale}
        yScale={yScale}
        />
    )

  }
}
