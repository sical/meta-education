import React from 'react'
import Slider from 'material-ui/Slider';
import {connect} from 'react-redux'
import * as d3 from 'd3';

import store from '../../store'
import {ActionTypes} from '../../actions'

class TimeSlider extends React.Component {
  constructor(props) {
    super(props)
    let now =  new Date().getTime()
    this.state = {
      value: now,
      min : now,
      max : now+10000,
      defaultValue: now
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timestamps.length) {
      let min =  d3.min(nextProps.timestamps),
        max = d3.max(nextProps.timestamps)
      this.setState({ min : min , max: max, defaultValue : min, value: min })
    }
  }

  handleSliderChange(e, value) {
    this.setState({ value: value })
    store.dispatch({ type: ActionTypes.SET_TIME_VALUE, time : value })
  }



  render() {
    return(
      <Slider
        ref='slider'
        {...this.state}
        onChange={ this.handleSliderChange.bind(this) }
      />
    )
  }

}

const mapStateToProps = (state) => {
    let timestamps = []
    if (state.apiReducer.actions && state.apiReducer.actions.length) {
      // convert dates to ms
      timestamps = state.apiReducer.actions.map(d=> new Date(d.ts).getTime())
    }
    return {
      timestamps : timestamps
    }
}

export default connect(mapStateToProps)(TimeSlider)
