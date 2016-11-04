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
    console.log(nextProps);
    if (nextProps.timestamps.length) {
      let min =  d3.min(nextProps.timestamps),
        max = d3.max(nextProps.timestamps)
      this.setState({ min : min , max: max, defaultValue : min, value: min })
      // set default value to first time stamp
      store.dispatch({ type: ActionTypes.SET_TIME_VALUE, time : d3.max(nextProps.timestamps) })

    }
  }

  handleSliderChange(e, value) {
    this.setState({ value: value })
    store.dispatch({ type: ActionTypes.SET_TIME_VALUE, time : value })
  }

  render() {
    return(
      // <div>
      //   <FlatButton label="Prev" />
      //   <FlatButton label="Next" />
      // </div>
      <Slider
        ref='slider'
        {...this.state}
        onChange={ this.handleSliderChange.bind(this) }
      />
    )
  }

}

const mapStateToProps = (state) => {

    return {
      timestamps : state.api.timestamps
    }
}

export default connect(mapStateToProps)(TimeSlider)
