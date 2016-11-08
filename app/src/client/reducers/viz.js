import { ActionTypes } from '../actions'

export const viz = (
  state = {
    currentClasse : null,
    currentTime: Date.now(),
    selectedProjects : []
  }
, action) => {
    // console.log(action);
    switch(action.type) {
      case ActionTypes.SELECT_CLASSE:
          return {
            ...state,
            currentClasse: action.currentClasse
          };
      case ActionTypes.SELECT_PROJECT:

        let existingIndex  = state.selectedProjects.indexOf(action.projectId)

        let selected = existingIndex > -1
          ? state.selectedProjects.filter( (d,i) => i != existingIndex)
          : [ ...state.selectedProjects, action.projectId]

        return {
          ...state,
          selectedProjects : selected
        }
      default:
          return state;
    }
  }
