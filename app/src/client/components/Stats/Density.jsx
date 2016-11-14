import React from 'react'
import Toll from 'material-ui/svg-icons/action/toll';

import {red500, greenA200} from 'material-ui/styles/colors';

export default class Density extends React.Component {
  constructor(props) {
    super(props)
  }

  handleMouseHover() {
    this.props.handleHover("density")
  }

  render() {
    let color = this.props.value > 8 ? red500 : greenA200

    return (
        <Toll
          style={this.props.style}
          color={color}
          onMouseOver={this.handleMouseHover.bind(this)}
          onMouseOut={this.props.handleHoverOut}
        />
    )

  }
}
