import React from 'react'

import {connect} from 'react-redux'
import {timeFormat} from 'd3-time-format';

import store from '../../store'
import {ActionTypes} from '../../actions'

import Network from './Network.jsx'
import TimeSlider from './TimeSlider.jsx'
import FlatButton from 'material-ui/FlatButton';

class NetworkContainer extends React.Component {

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

  dispatchIndex(value) {
    store.dispatch({
      type: ActionTypes.SET_TIME_VALUE,
      timeIndex : value
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timestamps.length) {
      let min = 0,
        max = nextProps.timestamps.length-1

      console.log(nextProps.currentTimeIndex);

      // set default value to final timestamp
      this.setState({
        min : min ,
        max: max,
        value : nextProps.currentTimeIndex,
        defaultValue : min,
        value: max
      })
    }
  }

  // actions
  handleSliderChange(e, value) {
    console.log("change");
    this.dispatchIndex(value);
  }

  prev() {
    let prevTimeIndex  = this.props.currentTimeIndex >  0 ? this.props.currentTimeIndex -1 : this.props.currentTimeIndex
    console.log("prev", prevTimeIndex);
    this.dispatchIndex(prevTimeIndex)
  }

  next() {
    let nextTimeIndex  = this.props.currentTimeIndex < this.props.timestamps.length -1 ? this.props.currentTimeIndex + 1 : this.props.currentTimeIndex
    console.log("next", nextTimeIndex);
    this.dispatchIndex(nextTimeIndex)
  }

  play() {
    console.log("play");
    var self = this;
    if (!this.state.playerId) {
      let playerId = setInterval(function() {
          if(self.props.currentTimeIndex < self.props.timestamps.length -1) self.next()
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

    let playStop = this.state.playerId ?
      <FlatButton
        label="Stop"
        onClick={this.stop.bind(this)}
        />
      :
      <FlatButton
        label="Play"
        onClick={this.play.bind(this)}
        disabled={this.props.currentTimeIndex == this.props.timestamps.length -1}
        />

    const format = timeFormat("%a %d %B, %H:%M")

    let currentTime = new Date(this.props.timestamps[this.props.currentTimeIndex]) || new Date,
      timeFormatted = format(currentTime)

    return (
      <div>
        <div>
           <FlatButton
             label="Prev"
             onClick={this.prev.bind(this)}
             disabled={this.props.currentTimeIndex == 0}
             />
           { playStop }
           <FlatButton
             label="Next"
             onClick={this.next.bind(this)}
             disabled={this.props.currentTimeIndex == this.props.timestamps.length -1}
             />
           <span>{timeFormatted}</span>
         </div>
         <TimeSlider
           min={this.state.min}
           max={this.state.max}
           value={this.props.currentTimeIndex}
           defaultValue={this.state.defaultValue}
          />

          <Network />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
      timestamps : state.api.timestamps,
      currentTimeIndex : state.api.currentTimeIndex
  }
}

export default connect(mapStateToProps)(NetworkContainer)
