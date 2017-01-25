import React from 'react'
import cytoscape from 'cytoscape'

import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import ZoomIn from 'material-ui/svg-icons/action/zoom-in';
import ZoomOut from 'material-ui/svg-icons/action/zoom-out';


import {connect} from 'react-redux'
import NetworkDefaultStyle from './NetworkDefaultStyle'

const CYTOSCAPE_DIV_ID = 'network'

const style = {
  divNetwork : {
    height: '400px',
    width: '100%',
    // position: 'absolute',
    // backgroundColor: 'rgba(0,0,0,.5)',
    // top: '0px',
    // left: '0',
    zIndex : 3000
  }
}

class Network extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      nodes : this.props.elements.nodes,
      edges : this.props.elements.edges,
      layoutName : 'preset',
      style: NetworkDefaultStyle(),
      cy : null // cytoscape instance
    }
    // this.createNetwork = this.createNetwork.bind(this)
    // this.updateNetwork = this.updateNetwork.bind(this)

  }

  setStateNetworkData(props) {
    // console.log("update network data...")
    if (props.actions.length) {
      let index = props.currentTimeIndex
      let currentAction = props.actions[index]

      this.setState({ nodes : [], edges : []})

      let nodes = currentAction.nodes.map(n => {
          return {
            group : 'nodes',
            position : n[1].position,
            data : Object.assign( n[1], { id : n[0] })
          }
        }),
        edges = currentAction.edges.map(n => {
          return {
            group : 'edges',
            data : Object.assign( n[2], {
              id : n[2]._id,
              source : n[2].from,
              target : n[2].to
            })
          }
        })

        this.setState({
          nodes : nodes,
          edges : edges
        })

      }
  }

  componentWillReceiveProps(nextProps) {
      this.setStateNetworkData(nextProps)
  }

  createNetwork() {
    console.log('* Cytoscape init...')

    this.setStateNetworkData(this.props) // update data

    const network = cytoscape(
      {
        container: document.getElementById(CYTOSCAPE_DIV_ID),
        elements: { nodes : this.state.nodes, edges : this.state.edges },
        style: this.state.style,
        layout: {
          name: this.state.layoutName
        }
      }
    )
    this.setState({ cy : network })
  }

  updateNetwork() {
    if(this.state.cy) {
      // console.log('* rendering network...')
      this.state.cy.json({ elements : { nodes : [], edges : [] } })
      // console.log({ nodes : this.state.nodes, edges : this.state.edges });
      this.state.cy.json({ elements : { nodes : this.state.nodes, edges : this.state.edges } });
      // console.log(this.state.cy.nodes().length, this.state.cy.edges().length);
      this.state.cy.layout( { name : 'preset' } )
      this.state.cy.fit()
      // this.state.cy.zoom({ level : this.state.cy.zoom()-5 })
    }
  }

  componentDidMount() {
    this.createNetwork()
  }

  componentWillUnmount(){
   this.state.cy.destroy();
  }

  zoomIn() {
    let zoom = this.state.cy.zoom()
    this.state.cy.zoom(zoom+.3)
  }

  zoomOut() {
    let zoom = this.state.cy.zoom()
    this.state.cy.zoom(zoom-.3)
  }

  // TODO : compare nodes and edges to check if update is required
  // shouldComponentUpdate(nextProps, nextState) {
    // if (nextProps.networkData.equals(this.props.networkData)) {
    //   console.log('Network unchanged, not updating cytoscapejs')
    //   return false
    // }
    // console.log('Network changed, updating cytoscapejs')
    // return true
  // }

  render() {
    this.updateNetwork() // show network

    return (
      <span>
        <div
          id={CYTOSCAPE_DIV_ID}
          style={style.divNetwork}
          >
        </div>
        <p>
        <IconButton
          tooltip="Zoom in"
          onClick={this.zoomIn.bind(this)}
          >
          <ZoomIn />
        </IconButton>
        <IconButton
          tooltip="Zoom out"
          onClick={this.zoomOut.bind(this)}
          >
          <ZoomOut />
        </IconButton>
          <FlatButton
          label={`${this.state.nodes.length} noeuds, ${this.state.edges.length} liens`}
          disabled={true}
          />
        </p>
      </span>
    )
  }
}

Network.propTypes = {
  topogramId : React.PropTypes.string,
  elements : React.PropTypes.object,
  style : React.PropTypes.object,
  layoutName : React.PropTypes.string
}

Network.defaultProps = {
  elements : { nodes : [], edges : [] },
  style : NetworkDefaultStyle(),
  layoutName : 'preset'
}

const mapStateToProps = (state) => {
    return {
      currentTimeIndex : state.api.currentTimeIndex,
      actions : state.api.actions
    }
}

export default connect(mapStateToProps)(Network)
