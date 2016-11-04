import React from 'react'
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ActionFace from 'material-ui/svg-icons/action/face';
import ContentSend from 'material-ui/svg-icons/content/send';

export default class StudentsList extends React.Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    students : []
  }

  render() {
    let students = this.props.students.map( (d, i) => <ListItem
        primaryText="Brendan Lim"
        key="i"
        leftAvatar={
          <Avatar
          icon={<ActionFace />}
           />
        }
        rightIcon={<ContentSend />}
      />)
    return (
      <List>
        {students}
      </List>
    )
  }
}
