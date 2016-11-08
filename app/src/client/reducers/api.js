import { ActionTypes } from '../actions'
import AsyncAPI from '../AsyncAPI'

export const api = (state = {
      projects : [],
      students: [],
      actions : [],
      timestamps : [],
      isWaiting: false
    },
    action) => {
      // console.log(action);
      switch (action.type) {
        case ActionTypes.GET_STUDENTS_LIST:
            return { ...state,
              isWaiting: true
            };
        case ActionTypes.GET_STUDENTS_LIST_SUCCESS:
            return { ...state,
              isWaiting: false,
              students: action.data,
              success : true
            };
        case ActionTypes.GET_STUDENTS_LIST_ERROR:
            return {
              ...state,
              isWaiting: false,
              success : false
            };
        case ActionTypes.GET_PROJECTS_LIST_SUCCESS:
          return { ...state,
            isWaiting: false,
            projects: action.data,
            success : true
          };
        case ActionTypes.GET_PROJECTS_LIST_ERROR:
            return {
              ...state,
              isWaiting: false,
              success : false
            };
        case ActionTypes.GET_PROJECT_ACTIONS_SUCCESS:
          // convert dates to ms
          let timestamps = action.data.map(d=> new Date(d.ts).getTime())
          return { ...state,
            isWaiting: false,
            actions: action.data,
            timestamps : timestamps,
            success : true,
            currentTimeIndex : timestamps.length-1
          };
        case ActionTypes.SET_TIME_VALUE:
          return { ...state,
            currentTimeIndex : action.timeIndex
          };
        case ActionTypes.GET_PROJECT_ACTIONS_ERROR:
          return { ...state, isWaiting: false, success : false  };
        case ActionTypes.GET_STATS:
          AsyncAPI.getStats(action.projects)
          return {
            ...state,
            isWaiting: true
          };
        case ActionTypes.GET_STATS_SUCCESS:
          return {
            ...state,
            stats : action.data,
            isWaiting: false,
            success : true
          };
        case ActionTypes.GET_STATS_ERROR:
            return {
              ...state,
              isWaiting: false,
              success : false
            };

        default:
            return state;
    }
};
