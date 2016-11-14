import React from 'react'
import { connect } from 'react-redux'

import {GridList, GridTile} from 'material-ui/GridList'
import Subheader from 'material-ui/Subheader';

import Bookmark from 'material-ui/svg-icons/action/bookmark';
import VideoLibrary from 'material-ui/svg-icons/av/video-library';
import Image from 'material-ui/svg-icons/image/image';
import Share from 'material-ui/svg-icons/social/share';


import { ActionTypes } from '../../actions'
import AsyncAPI from '../../AsyncAPI'
import store from '../../store'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  }
};


class ResourcesGrid extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    let tiles = this.props.actions[this.props.actions.length-1].nodes
        .map(e => e[1].uri)
        .filter(uri => uri != "" && uri)
        .map( (uri, i) => {

          let type = "other"
          let icon = <Bookmark />
          let content = ""

          if([ "png", "jpg", "JPG", "gif"].indexOf(uri.slice(-3)) > -1){
            type = "img"
            icon = <Image />
            content = (
              <img
              src={uri}
              style={ { maxWidth : "100%", maxHeight : "100%" } }
              />
            )
          } else if ( uri.includes("youtube") || uri.includes("dailymotion") ||  uri.includes("youtu.be")){
            type = "video"
            icon = <Bookmark />
          } else if (uri.slice(4) == "http") {
            type = "web"
            icon = <Share />
          }

          return (
            <GridTile
             key={i}
             title={`${uri}`}
             actionIcon={icon}
             >
              {content }
            </GridTile>
          )
        })

    return (
      <div style={styles.root}>
        <GridList
          cellHeight={120}
          // cellWidth={80}
          cols={3}
          // style={styles.gridList}
          >
          {tiles}
        </GridList>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
      actions : state.api.actions,
      currentProject : state.viz.currentProject
  }
}

export default connect(mapStateToProps)(ResourcesGrid)
