import React from 'react'
import IconButton from 'material-ui/IconButton'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import NavigationClose from 'material-ui/svg-icons/navigation/close';
// import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'

import UserMenu from './UserMenu.jsx'
import Version from '../Version/Version.jsx'


const styles = {
  topBar : {
    backgroundColor : 'rgba(0,0,0,.2)'
  },
  buttonToggleSideNav : {
    marginRight: '200px'
  }
}

export default class TopBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    let iconToggleSideNav = <IconButton
      onClick={this.props.onHomeButtonClick}
      >
      <NavigationMenu/>
    </IconButton>

    return (
      <AppBar
        title="MetaEducation"
        iconElementLeft={iconToggleSideNav}
        iconElementRight={<Version />}
        />
    )
  }
}
