import React from 'react'
import { connect } from 'react-redux'

import { ListItem} from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';

import store from '../../store'
import  { ActionTypes } from '../../actions'

import moment from 'moment'

// set to French
moment.locale('fr')

export default class StudentsListSubItem extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClickProject (projectId, userId) {
    store.dispatch({
      type : ActionTypes.SELECT_PROJECTS,
      project : { id : projectId, userId : userId }
    })
  }

  render() {
    return (
      <ListItem
        primaryText={`${this.props.project.name}`}
        secondaryText={`${this.props.project.actionsCount} actions. Edité ${ moment(this.props.project.end).fromNow()}`}
        onClick={
          this.handleClickProject.bind(this, this.props.project.id, this.props.userId)
        }
        className={ this.props.isSelected ? "selected" : null}
        rightIcon={<ContentSend />}
        />
    )
  }

}
