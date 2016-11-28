import React from 'react'
import Avatar from 'material-ui/Avatar';

import {red300, green100, green500} from 'material-ui/styles/colors';

import { min, max } from 'd3-array'
import { scaleTime, scaleLinear } from 'd3-scale';

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
      scaleTime()
        .domain([
          min(series.map(d=>new Date(d.ts))),
          max(series.map(d=>new Date(d.ts)))
        ])
        .range([width,0])

    let yScale =
      scaleLinear()
        .domain([0, max(series.map(d=>d.count))])
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
