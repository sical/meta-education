import { ActionTypes } from '../actions'

export const viz = (
  state = {
    currentClasse : null,
    currentTime: Date.now()
  }
, action) => {
    // console.log(action);
    switch(action.type) {
      case ActionTypes.SELECT_CLASSE:
          return {
            ...state,
            currentClasse: action.currentClasse
          };
      default:
          return state;
    }
  }
