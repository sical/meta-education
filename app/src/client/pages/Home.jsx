import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import {Grid, Row, Col} from 'react-flexbox-grid';

import { connect } from 'react-redux'

import StudentsList from '../components/StudentsList.jsx'
import SideNav from '../components/SideNav.jsx'
import TopBar from '../components/TopBar.jsx'
import Dashboard from '../components/Dashboard.jsx'

import store from '../store'
import AsyncAPI from '../AsyncAPI'

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      projects : []
    }
  }

  componentWillMount() {
    store.dispatch(AsyncAPI.getStudentsList())
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
          students={this.props.students}
        />
        { this.props.currentClasse ?
          <Grid>
            <Row>
              <Col>
                <StudentsList
                  students={this.props.students}
                  currentClasse={this.props.currentClasse}
                  />
              </Col>
              <Col xs>
                <Dashboard />
              </Col>
              <Col xs />
            </Row>
          </Grid>
          :
          <div></div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
      students : state.api.students,
      currentClasse : state.viz.currentClasse
  }
}

export default connect(mapStateToProps)(Home)
