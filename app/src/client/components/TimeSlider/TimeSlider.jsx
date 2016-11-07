import React from 'react'
import Slider from 'material-ui/Slider';
import {connect} from 'react-redux'
import * as d3 from 'd3';

import store from '../../store'
import {ActionTypes} from '../../actions'

class TimeSlider extends React.Component {
  constructor(props) {
    super(props)
    // let now =  new Date().getTime()
    this.state = {
      value: 0,
      min : 0,
      max : 100,
      defaultValue: 100
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timestamps.length) {
      // let min =  d3.min(nextProps.timestamps),
      //   max = d3.max(nextProps.timestamps)
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

  handleSliderChange(e, value) {
    this.setState({ value: value })
    store.dispatch({
      type: ActionTypes.SET_TIME_VALUE,
      timeIndex : value
    })
  }

  render() {
    console.log(this.state);

    return(
      // <div>
      //   <FlatButton label="Prev" />
      //   <FlatButton label="Next" />
      // </div>
      <Slider
        ref='slider'
        {...this.state}
        step={1}
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
