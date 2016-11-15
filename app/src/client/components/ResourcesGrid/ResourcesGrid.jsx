import React from 'react'
import { connect } from 'react-redux'

import {GridList, GridTile} from 'material-ui/GridList'
import Subheader from 'material-ui/Subheader';

import Bookmark from 'material-ui/svg-icons/action/bookmark';
import VideoLibrary from 'material-ui/svg-icons/av/video-library';
import Image from 'material-ui/svg-icons/image/image';
import Share from 'material-ui/svg-icons/social/share';

import Paper from 'material-ui/Paper';

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

    let uris = this.props.actions[this.props.actions.length-1].nodes
        .map(e => e[1].uri)
        .filter(uri => uri != "" && uri)


    let tiles = uris.map( (uri, i) => {
      console.log(uri);
        if ([ "png", "jpg", "JPG", "gif", "svg"].indexOf(uri.slice(-3)) > -1)
          return <Image key={i}/>
        else if ( uri.includes("youtube")
            || uri.includes("dailymotion")
            || uri.includes("youtu.be")
          )
          return <Bookmark key={i}/>
        else if (uri.slice(4) == "http")
          return <Share key={i}/>
        else
          return <Bookmark key={i}/>
      //
    })

    // let tiles = uris.filter( uri =>
    //
    //   ).map( uri =>
    //     <GridTile
    //      key={uri}
    //      title={`${uri}`}
    //      >
    //       <img
    //         src={uri}
    //         style={ { maxWidth : "100%", maxHeight : "100%" } }
    //         />
    //     </GridTile>
    //   )
    //
    // let videos = uris.filter( uri  =>
    //
    //   )
    //   .map( uri => <span></span>)
    //
    // let links = uris.filter( uri => )
    //   .map( uri => <span></span>)



    return (
      <div>
        {tiles}
      </div>

      // <div style={styles.root}>
      //   { tiles.length ?
      //       <GridList
      //         cellHeight={120}
      //         // cellWidth={80}
      //         cols={3}
      //         // style={styles.gridList}
      //         >
      //         {tiles}
      //       </GridList>
      //     :
      //     null
      //   }
      //   { videos }
      //   { links }

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
