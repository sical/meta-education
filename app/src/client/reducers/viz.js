import { ActionTypes } from '../actions'

export const viz = (
  state = {
    currentTime: Date.now(),
    currentProject : null
  }
, action) => {
    // console.log(action);
    switch(action.type) {
      case ActionTypes.SHOW_PROJECT:
          return {
            ...state,
            currentProject: action.projectId
          };
      case ActionTypes.HIDE_PROJECT:
          return {
            ...state,
            currentProject: null
          };
      default:
          return state;
    }
  }
