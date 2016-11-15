import React from 'react'
import {connect} from 'react-redux'
import * as d3 from 'd3';

import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';

import store from '../../store'
import {ActionTypes} from '../../actions'

export default class TimeSlider extends React.Component {
  constructor(props) {
    super(props)

    let max = props.timestamps.length -1
    this.state = {
      value: max,
      min : 0,
      max : max,
      defaultValue: max,
      playerId : null // store the intervalId
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timestamps.length) {
      let min = 0,
        max = nextProps.timestamps.length-1

      // set default value to final timestamp
      this.setState({
        min : min ,
        max: max,
        defaultValue : min,
        value: max
      })

      store.dispatch({
        type: ActionTypes.SET_TIME_VALUE,
        timeIndex : max //,
        // time : d3.max(nextProps.timestamps)
      })

    }
  }

  dispatchIndex(value) {
    this.setState({ value: value })
    store.dispatch({
      type: ActionTypes.SET_TIME_VALUE,
      timeIndex : value
    })
  }

  // actions
  handleSliderChange(e, value) {
    this.dispatchIndex(value);
  }

  prev() {
    let prevTimeIndex  = this.state.value >  0 ? this.state.value -1 : this.state.value
    console.log("prev", prevTimeIndex);
    this.dispatchIndex(prevTimeIndex)
  }

  next() {
    let nextTimeIndex  = this.state.value < this.props.timestamps.length -1 ? this.state.value + 1 : this.state.value
    console.log("next", nextTimeIndex);
    this.dispatchIndex(nextTimeIndex)
  }

  play() {
    console.log("play");
    var self = this;
    if (!this.state.playerId) {
      let playerId = setInterval(function() {
          if(self.state.value < self.props.timestamps.length -1) self.next()
          else　self.stop
        }, 200)
      self.setState({ playerId : playerId })
    }
  }

  stop() {
    console.log("stop");
    clearInterval(this.state.playerId)
    this.setState({ playerId : null })
  }

  render() {
    console.log(this.state);

    let playStop = this.state.playerId ?
      <FlatButton
        label="Stop"
        onClick={this.stop.bind(this)}
        />
      :
      <FlatButton
        label="Play"
        onClick={this.play.bind(this)}
        />

    let currentTime = this.props.timestamps[this.state.value] || Date.now(), //,
      timeFormatted = d3.timeFormat("%a %d %B, %H:%M")(currentTime)

    return(
      <div>
        <div>
          <FlatButton
            label="Prev"
            onClick={this.prev.bind(this)}
            />
          { playStop }
          <FlatButton
            label="Next"
            onClick={this.next.bind(this)}
            />
          <span>{timeFormatted}</span>
        </div>
        <Slider
          ref='slider'
          // {...this.state}
          min={this.state.min}
          max={this.state.max}
          value={this.state.value}
          defaultValue={this.state.defaultValue}
          step={1}
          onChange={ this.handleSliderChange.bind(this) }
        />
      </div>
    )
  }
}
