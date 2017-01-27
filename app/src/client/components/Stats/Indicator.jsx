import React from 'react'
import Avatar from 'material-ui/Avatar';

import {grey300, orange600, red100, red600, green600} from 'material-ui/styles/colors';

export default class Indicator extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    let colors = [null, green600, orange600, red600]
    let color = this.props.count === 0 ? grey300 : colors[this.props.z]
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
