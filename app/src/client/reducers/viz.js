import { ActionTypes } from '../actions'

export const vizReducer = (
  state = { currentTime: Date.now().getTime() }
, action) => {
    console.log(action);
    switch(action.type) {
      case ActionTypes.SET_TIME_VALUE:
        return { ...state, currentTime : time };
      default:
          return state;
    }
  }
