import React from 'react'
import Subject from 'material-ui/svg-icons/action/subject';

import {line} from 'd3-shape'

var Chart = React.createClass({
   render: function() {
     return (
       <svg
         style={{ borderLeft : '1px solid #CCC', borderBottom : '1px solid #CCC' }}　
         width={this.props.width}
         height={this.props.height}>
        <g  transform={`translate(0,${this.props.xTranslate})`}>
          {this.props.children}
        </g>
       </svg>
     );
   }
 });

 var Line = React.createClass({
   getDefaultProps: function() {
     return {
       path: '',
       color: 'blue',
       width: 2
     }
   },

   render: function() {
     return (
       <path
        d={this.props.path}
        stroke={this.props.color}
        strokeWidth={this.props.width}
        fill="none" />
     );
   }
 });

 var DataSeries = React.createClass({
   getDefaultProps: function() {
     return {
       title: '',
       data: [],
       interpolate: 'linear'
     }
   },

   render: function() {
     var self = this,
         props = this.props,
         yScale = props.yScale,
         xScale = props.xScale;

     var path = line()
         .x(function(d) { return xScale(d.x); })
         .y(function(d) { return yScale(d.y); })
        //  .interpolate(this.props.interpolate);

     return (
       <Line path={path(this.props.data)} color={this.props.color} />
     )
   }
 });

export default class TimeSeries extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    let size = { width: this.props.width, height: this.props.height }

    let xTranslate = this.props.maxHeight - this.props.height

    return (
      <Chart
        width={this.props.width}
        height={this.props.maxHeight}
        xTranslate={xTranslate}
        >
        <DataSeries
          data={this.props.data}
          size={size}
          xScale={this.props.xScale}
          yScale={this.props.yScale}
          ref="series1"
          color="cornflowerblue" />
      </Chart>
    )
  }
}
