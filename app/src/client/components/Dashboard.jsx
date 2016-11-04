import React from 'react'
import {Grid, Row, Col} from 'react-flexbox-grid';

import StudentsList from './StudentsList.jsx'

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
          <Col xs />
          <Col xs />
        </Row>
      </Grid>
    )
  }
}
