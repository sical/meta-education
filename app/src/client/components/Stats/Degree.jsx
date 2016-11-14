import React from 'react'
import GroupWork from 'material-ui/svg-icons/action/group-work';

import {red500, greenA200} from 'material-ui/styles/colors';

export default class Degree extends React.Component {
  constructor(props) {
    super(props)
  }

  handleMouseHover() {
    this.props.handleHover("degree")
  }

  render() {
    let color = this.props.value > 8 ? red500 : greenA200

    return (
        <GroupWork
          style={this.props.style}
          color={color}
          onMouseOver={this.handleMouseHover.bind(this)}
          onMouseOut={this.props.handleHoverOut}
        />
    )

  }
}
