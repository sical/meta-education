import React from 'react'
import Avatar from 'material-ui/Avatar';

import {red300, green100, green500} from 'material-ui/styles/colors';

export default class Resources extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    console.log(this.props.resources);
    let colors = [null, green100, green500, red300]
    let color = colors[this.props.density]
    return (
      <Avatar
        backgroundColor={color}
        size={Math.floor(this.props.resources)}
        >
        {this.props.count}
      </Avatar>
    )

  }
}
