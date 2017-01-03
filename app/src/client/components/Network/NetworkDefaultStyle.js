import { stylesheet } from 'cytoscape'
import { colors } from '../../helpers/colors.js'

const NetworkDefaultStyle = () =>
  stylesheet()
    .selector('node')
      .style({
        'font-size': 16,
        'text-valign': 'center',
        'text-halign': 'right',
        'color': 'gray',
        'text-max-width': 120,
        'text-wrap': 'wrap',
        'min-zoomed-font-size': 0.4,
        'border-color': '#D84315',
        'background-color' : 'steelblue',
        'label'(e) {
          let html = e.data('title')
          // strip HTML entities from text
          let tmp = document.createElement("div");
          tmp.innerHTML = html;

          return tmp.textContent || tmp.innerText || "";
        }
      })
    // node with degree zero
    .selector('node[[degree = 0]]')
      .style({
          'background-color': '#656565'
          // 'display' :"none"
      })
    .selector('edge')
      .style({
        'background-color' : '#000',
        'target-arrow-shape': 'none', // default is undirected graph
        'width'(e) {
          return 5
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
