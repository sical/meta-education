import { stylesheet } from 'cytoscape'
import { colors } from '../../helpers/colors.js'

const NetworkDefaultStyle = () =>
  stylesheet()
    .selector('node')
      .style({
        'font-size': 6,//graphState.fontSize,
        'text-valign': 'center',
        'text-halign': 'right',
        'color': 'gray',
        'text-max-width': 60,
        'text-wrap': 'wrap',
        'min-zoomed-font-size': 0.4,
        'border-color': '#D84315',
        'background-color' : 'steelblue',
        // 'text-opacity' : 0, // hide label by default
        'label'(e) {
          // console.log(e.data('title'));
          return e.data('title') ? e.data('title').trunc(20) : ''
        }
      })
    // node with degree zero
    .selector('node[[degree = 0]]')
      .style({
          'background-color': '#656565'
          // 'display' :"none"
      })
    .selector('node[group="ghosts"]')
    .style({
      'background-opacity': .5,
      'border-width': '3',
      'border-color': 'gray',
      'border-opacity': .6
        // 'display' :"none"
    })
    .selector('edge')
      .style({
        'background-color' : '#000',
        'target-arrow-shape': 'none', // default is undirected graph
        'width'(e) {
          return e.data('weight') ? e.data('weight') : .5
        },
        'line-color' : '#AAAAAA',
        'opacity': .7,
        'font-size':8,
        'text-opacity' : 0, // hide label by default
        'label'(e) {
          return e.data('group') ? e.data('group') : ''
        }
      })

// truncate String to make it shorter
String.prototype.trunc = String.prototype.trunc ||
  function (n) {
    return (this.length > n) ? this.substr(0,n-1)+'...' : this
  }

export default NetworkDefaultStyle
