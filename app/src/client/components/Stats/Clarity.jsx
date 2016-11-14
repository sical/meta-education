import React from 'react'
import Subject from 'material-ui/svg-icons/action/subject';

import {red500, greenA200} from 'material-ui/styles/colors';

export default class Clarity extends React.Component {
  constructor(props) {
    super(props)
  }

  handleMouseHover() {
    this.props.handleHover("clarity")
  }

  render() {
    let color = this.props.value > 8 ? red500 : greenA200

    return (
        <Subject
          style={this.props.style}
          color={color}
          onMouseOver={this.handleMouseHover.bind(this)}
          onMouseOut={this.props.handleHoverOut}
        />
    )

  }
}
