import React from 'react'
import Avatar from 'material-ui/Avatar';

import {blue100, blue400, blue800} from 'material-ui/styles/colors';

export default class Indicator extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    let colors = [null, blue100, blue400, blue800]
    let color = colors[this.props.z]
    return (
      <Avatar
        backgroundColor={color}
        size={30}
        style={{ fontSize:'.9em'}}
        >
        {this.props.count}
      </Avatar>
    )

  }
}
