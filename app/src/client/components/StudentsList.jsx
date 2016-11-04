import React from 'react'
import { connect } from 'react-redux'

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionFace from 'material-ui/svg-icons/action/face';
import ContentSend from 'material-ui/svg-icons/content/send';

import store from '../store'

class StudentsList extends React.Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    students : []
  }

  handleClick (id) {
    store.dispatch({ type: 'INCREMENT' })
  }

  render() {
    console.log();
    let students = this.props.students.map( (id, i) => <ListItem
        primaryText={"Brendan Lim  " +this.props.count }
        key="i"
        leftAvatar={
          <Avatar
          icon={<ActionFace />}
           />
        }
        rightIcon={<ContentSend />}
        onClick={this.handleClick.bind(this, id)}
      />)
    return (
      <List>
        {students}
      </List>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        count: state.counter
    }
}

export default connect(mapStateToProps)(StudentsList)
