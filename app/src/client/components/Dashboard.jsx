import React from 'react'
import Network from './Network/Network.jsx'
import TimeSlider from './TimeSlider/TimeSlider.jsx'

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <TimeSlider />
        <Network />
      </div>
    )
  }
}
