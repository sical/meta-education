import React from 'react'
import { connect } from 'react-redux'

import {Card, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import ResourceIcon from './ResourceIcon.jsx'

class ResourcesGrid extends React.Component {
  constructor(props) {
    super(props)
  }

  getCurrentMedia() {
    let media = this.state.currentResource
    // console.log(media);
    switch(media.type) {
      case "image":
        let img = <img style={ {maxWidth : "30%", width:"100px"} } src={media.uri} />
        return (
          <span>
            <a href={media.uri}>{media.uri}</a>
            {img}
          </span>
        )
      default:
        return <a href={media.uri}>{media.uri}</a>
    }
  }

  handleIconClick() {
    console.log(this.props.resource.uri);
    window.open(this.props.resource.uri, '_blank');
  }

  render() {

    // ghost link to help parse URIs
    let link = document.createElement("a");

    let uris = this.props.actions.length ?
      this.props.actions[this.props.actions.length-1].nodes
        .map(e => e[1].uri)
        .filter(uri => uri != "" && uri)
      :
      []

    let parsed = uris.map( uri　=> {

      link.href = uri; // setup ghost link for URL parsing

      // check link type
      let type = (l => {
          if ([ "png", "jpg", "JPG", "gif", "svg"].indexOf(l.pathname.slice(-3)) > -1)
            return "image"
          else if ( l.hostname.includes("youtube")
              || l.hostname.includes("dailymotion")
              || l.hostname.includes("youtu.be")
            )
            return "video"
          else
            return "link"
      })(link)

      return {
        type,
        uri,
        domain : link.hostname
      }
    })

    let domainStats = parsed.reduce((dict, d ) => {
      dict[d.domain] = dict[d.domain] === undefined ?
        [d] :
        [...dict[d.domain], d]
      return dict
      }, {})

    let domainsListItems = Object.keys(domainStats).map(domain => {
      let icons = domainStats[domain].map( res =>
        <ResourceIcon
          handleIconClick={this.handleIconClick}
          key={res.uri}
          resource={res}
          />
      )
      return (
        <span key={`item--${domain}`}>
          {domain} ({domainStats[domain].length}) {icons}
          <br />
        </span>
      )
    }
    )

    return (

      <Card
        className="resources"
        style={this.props.style}
        expanded={true}
        >
        <CardHeader
          title="Ressources"
          subtitle="Liens, vidéos et objets externes utilisés"
          actAsExpander={true}
          showExpandableButton={true}

        />
        <CardText expandable={true}>
        {
          domainsListItems.length ?
            (
              <div>
                {domainsListItems}
              </div>
            )
          :
          null
        }
        </CardText>
        <CardMedia>
        {
          this.props.currentResource ?
            this.getCurrentMedia()
          :
            null
        }
        </CardMedia>
      </Card>


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
