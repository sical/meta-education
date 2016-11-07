import React from 'react'
import { connect } from 'react-redux'

import Network from './Network/Network.jsx'
import TimeSlider from './TimeSlider/TimeSlider.jsx'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.projectIsLoaded)
      console.log("project loaded", this.props.projectIsLoaded)
    return (
      <div>
      {
        this.props.projectIsLoaded ?
          <div>
            <Network
              actions={this.props.actions}
              />
            <TimeSlider
            timestamps={this.props.timestamps}
            />
          </div>
        : null
      }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    let loaded = state.api.actions.length ? true : false
    return {
      projectIsLoaded : loaded,
      timestamps : state.api.timestamps,
      actions : state.api.actions
    }
}

export default connect(mapStateToProps)(Dashboard)
