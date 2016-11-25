import React from 'react'
import { connect } from 'react-redux'

import IconButton from 'material-ui/IconButton';
import Bookmark from 'material-ui/svg-icons/action/bookmark';
import VideoLibrary from 'material-ui/svg-icons/av/video-library';
import Image from 'material-ui/svg-icons/image/image';
import Share from 'material-ui/svg-icons/social/share';

import {green500, grey500, red500} from 'material-ui/styles/colors';

export default class Resource extends React.Component {
  constructor(props) {
    super(props)
    this.state = { currentResource : null}
  }

  handleIconOver(uri) {
    this.setState({ currentResource : uri})
  }

  handleIconOut() {
    this.setState({ currentResource : null})
  }



  render () {
    let res = this.props.resource

    let icon = ( type => {
      switch(type){
        case "image" : return <Image color={green500}/>
        case "video"  : return <VideoLibrary color={red500}/>
        default : return <Bookmark color={grey500}/>
      }
    })(res.type)

    return (
      <IconButton
       iconStyle={{margin : 0, padding : 0}}
       tooltip={res.type+ ' : '+ res.domain}
       onMouseOver={this.handleIconOver.bind(this,{...res})}
       onMouseOut={this.handleIconOut.bind(this)}
       onMouseOut={this.handleIconOut.bind(this)}
       onClick={this.props.handleIconClick.bind(this)}
       key={res.uri}
       >
         {icon}
      </IconButton>
    )
  }
}
