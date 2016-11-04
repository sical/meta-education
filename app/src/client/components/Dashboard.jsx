import React from 'react'
import {Grid, Row, Col} from 'react-flexbox-grid';

import StudentsList from './StudentsList.jsx'
import Network from './Network/Network.jsx'
import TimeSlider from './TimeSlider/TimeSlider.jsx'

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <StudentsList students={this.props.students}/>
          </Col>
          <Col xs>
            <TimeSlider />
            <Network />
          </Col>
          <Col xs />
        </Row>
      </Grid>
    )
  }
}
