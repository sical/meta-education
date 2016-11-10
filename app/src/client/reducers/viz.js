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

        // if the project is already selected
        let existingIndex  = state.selectedProjects
          .map(d => d.id)
          .indexOf(action.project.id)

        // filter out unwanted
        let selected = state.selectedProjects
          .filter( (d,i) => i != existingIndex )　// already existing project
          .filter( (d,i) => d.userId != action.project.userId )　// by the same user

        // add new project
        if (existingIndex == -1) selected.push(action.project)

        return {
          ...state,
          selectedProjects : selected
        }
      default:
          return state;
    }
  }
