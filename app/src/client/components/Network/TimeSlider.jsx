import React from 'react'

import Slider from 'material-ui/Slider';

import store from '../../store'
import {ActionTypes} from '../../actions'

export default class TimeSlider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value : this.props.value
    }
  }

  handleSliderChange(e, value) {
    this.setState({ value: value })
    store.dispatch({
      type: ActionTypes.SET_TIME_VALUE,
      timeIndex : value
    })
  }

  render() {
    return(
        <Slider
          ref='slider'
          // {...this.state}
          min={this.props.min}
          max={this.props.max}
          value={this.props.value}
          defaultValue={this.props.defaultValue}
          step={1}
          onChange={ this.handleSliderChange.bind(this) }
        />
    )
  }
}
