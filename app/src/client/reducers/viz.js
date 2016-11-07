import { ActionTypes } from '../actions'

export const viz = (
  state = { currentTime: Date.now() }
, action) => {
    // console.log(action);
    switch(action.type) {
      case ActionTypes.SET_TIME_VALUE:
        return { ...state,
          currentTimeIndex : action.timeIndex
          // currentTime : Math.floor(action.time)
        };
      default:
          return state;
    }
  }
