import React from 'react'
import { connect } from 'react-redux'

import {Grid, Row, Col} from 'react-flexbox-grid';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import StudentsList from '../components/Students/StudentsList.jsx'

import Network from './Network/Network.jsx'
import TimeSlider from './TimeSlider/TimeSlider.jsx'

import ResourcesGrid from './ResourcesGrid/ResourcesGrid.jsx'

import StatsList from './Stats/StatsList.jsx'

import {List, ListItem} from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col>
            <StudentsList />
          </Col>
          {
            this.props.selectedProjects.length ?
            <Col>
              <StatsList />
            </Col>
            : null
          }
            {
              this.props.currentProject && this.props.actions.length ?
                <Col>
                  <Card>
                    <CardHeader
                      title="Ressources"
                      subtitle="Liens, vidéos et éléments multimédia de la carte"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                      <ResourcesGrid
                        actions={this.props.actions}
                      />
                    </CardText>
                  </Card>
                  <Card>
                    <CardHeader
                      title="Carte conceptuelle"
                      subtitle="Consulter et rejouer la création de la carte"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                      <Network
                        actions={this.props.actions}
                        />
                      <TimeSlider
                        timestamps={this.props.timestamps}
                      />
                    </CardText>
                  </Card>
                </Col>
              : null
            }
        </Row>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
    let loaded = state.api.actions.length ? true : false
    return {
      projectIsLoaded : loaded,
      timestamps : state.api.timestamps,
      actions : state.api.actions,
      currentProject : state.viz.currentProject,
      selectedProjects : state.api.selectedProjects
    }
}

export default connect(mapStateToProps)(Dashboard)
