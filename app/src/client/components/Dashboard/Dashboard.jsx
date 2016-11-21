import React from 'react'
import { connect } from 'react-redux'

import {List, ListItem} from 'material-ui/List';
import Drawer from 'material-ui/Drawer';

import BigList from '../BigList/BigList.jsx'
import SingleView from './SingleView.jsx'

import store from '../../store'
import  { ActionTypes } from '../../actions'
import AsyncAPI from '../../AsyncAPI'

let style =  {
  main : {
    "display":"flex",
    "flexDirection":"row",
    "flexWrap":"wrap",
    "justifyContent":"flex-start",
    "alignItems":"stretch"
  },
  bigList : {
    maxWidth: "100%",
    order:1
  },
  graphs : {
    flexBasis:"40%",
    maxWidth: "40%",
    order:2,
    height:'100vh',
    top: 'none',
    width : '40%'
  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen : false
    }
  }

  render() {

    console.log(this.props.currentProject);
    let drawerOpen = this.props.currentProject ? true :false

    let containerStyle = drawerOpen ? style.graphs : {}

    return (
      <div
        className="main"
        style={style.main}
        >
        <div
          className="bigList"
          style={Object.assign(
              {},
              style.bigList,
              drawerOpen ? {flexBasis : "60%"}　:　{flexBasis : "100%"}
            )}
          >
          {
            this.props.selectedProjects.length ?
            <BigList
            />
            : null
          }
        </div>
        <Drawer
          open={drawerOpen}
          openSecondary={true}
          containerStyle={containerStyle}
          // width={100}
          >
          <SingleView {... this.props} />
        </Drawer>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    let loaded = state.api.actions.length ? true : false
    return {
      timestamps : state.api.timestamps,
      actions : state.api.actions,
      selectedProjects : state.api.selectedProjects,
      currentProject : state.viz.currentProject
    }
}

export default connect(mapStateToProps)(Dashboard)
