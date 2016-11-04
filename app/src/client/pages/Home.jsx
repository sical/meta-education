import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import { connect, PromiseState } from 'react-refetch'
import {Grid, Row, Col} from 'react-flexbox-grid';


import StudentsList from '../components/StudentsList.jsx'
import SideNav from '../components/SideNav.jsx'
import TopBar from '../components/TopBar.jsx'
import Dashboard from '../components/Dashboard.jsx'

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      projects : []
    }
  }

  componentDidMount () {
  }

  toggleSideNav = () => {
   const toggled = this.refs.sideNav.state.open ? false : true
   this.refs.sideNav.setState({ open : toggled })
  }

  render() {


    return (
      <div>
        <TopBar onHomeButtonClick={this.toggleSideNav} />
        <SideNav
          ref="sideNav"
        />
        <Grid>
          <Row>
            <Col>
              <StudentsList students={this.props.students}/>
            </Col>
            <Col xs>
              <Dashboard />
            </Col>
            <Col xs />
          </Row>
        </Grid>
      </div>
    )
  }
}
