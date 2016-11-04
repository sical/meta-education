import React from 'react'
import cytoscape from 'cytoscape'

import {connect} from 'react-redux'
import NetworkDefaultStyle from './NetworkDefaultStyle'

const CYTOSCAPE_DIV_ID = 'network'

const style = {
  divNetwork : {
    height: '400px',
    width: '400px',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.5)',
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
      style: NetworkDefaultStyle,
      cy : null // cytoscape instance
    }
    // this.createNetwork = this.createNetwork.bind(this)
    // this.updateNetwork = this.updateNetwork.bind(this)

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.actions.length) {
      let currentAction = nextProps.actions[nextProps.actions.length-1]
      // console.log("next", currentAction);
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

  createNetwork() {
    console.log('* Cytoscape init...')

    const network = cytoscape(
      {
        container: document.getElementById(CYTOSCAPE_DIV_ID),
        elements: { nodes : this.state.nodes, edges : this.state.edges },
        style: this.props.style,
        layout: {
          name: this.state.layoutName
        }
      }
    )
    this.setState({ cy : network })
  }

  updateNetwork() {
    console.log('* rendering network...')
    if(this.state.cy) {
      console.log({ nodes : this.state.nodes, edges : this.state.edges });
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

  // shouldComponentUpdate(nextProps, nextState) {
    // if (nextProps.networkData.equals(this.props.networkData)) {
    //   console.log('Network unchanged, not updating cytoscapejs')
    //   return false
    // }
    // console.log('Network changed, updating cytoscapejs')
    // return true
  // }

  render() {

    this.updateNetwork()
    return (
      <div
        id={CYTOSCAPE_DIV_ID}
        style={style.divNetwork}
      >
      </div>
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
    // console.log(state)
    return {
      currentTime : state.viz.currentTime,
      actions : state.api.actions
    }
}

export default connect(mapStateToProps)(Network)
