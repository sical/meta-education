import { ActionTypes } from '../actions'

export const viz = (
  state = {
    currentClasse : null,
    currentTime: Date.now(),
    currentProject : null
  }
, action) => {
    // console.log(action);
    switch(action.type) {
      case ActionTypes.SELECT_CLASSE:
          return {
            ...state,
            currentClasse: action.currentClasse
          };
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
