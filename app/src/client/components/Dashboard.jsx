import React from 'react'
import { connect } from 'react-redux'

import {Grid, Row, Col} from 'react-flexbox-grid';

import StudentsList from '../components/StudentsList.jsx'

import Network from './Network/Network.jsx'
import TimeSlider from './TimeSlider/TimeSlider.jsx'

import ResourcesGrid from './ResourcesGrid/ResourcesGrid.jsx'

import StatsList from './Stats/StatsList.jsx'

import {List, ListItem} from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <StudentsList />
          </Col>
          <Col xs>
            <StatsList />
          </Col>
            {
              this.props.currentProject && this.props.actions.length ?
                <div>
                  <ResourcesGrid
                    actions={this.props.actions}
                  />
                  <Network
                    actions={this.props.actions}
                    />
                  <TimeSlider
                    timestamps={this.props.timestamps}
                  />
                </div>
              : null
            }
          <Col xs />
        </Row>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
    let loaded = state.api.actions.length ? true : false
    return {
      projectIsLoaded : loaded,
      timestamps : state.api.timestamps,
      actions : state.api.actions,
      currentProject : state.viz.currentProject
    }
}

export default connect(mapStateToProps)(Dashboard)
