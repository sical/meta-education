import React from 'react'
import { connect } from 'react-redux'

import { ListItem} from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';

import store from '../../store'
import  { ActionTypes } from '../../actions'

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

    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

    return (
      <ListItem
        primaryText={`${this.props.project.name}`}
        secondaryText={`${this.props.project.actionsCount} actions. Edité ${ timeSince(this.props.project.end)}`}
        onClick={
          this.handleClickProject.bind(this, this.props.project.id, this.props.userId)
        }
        className={ this.props.isSelected ? "selected" : null}
        rightIcon={<ContentSend />}
        />
    )
  }

}
