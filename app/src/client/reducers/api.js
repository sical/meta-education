import { ActionTypes } from '../actions'
import AsyncAPI from '../AsyncAPI'

export const api = (state = {
      projects : [],
      classes: [],
      currentClasse : null,
      actions : [],
      timestamps : [],
      stats : {},
      selectedProjects : [],
      isWaiting: false
    },
    action) => {
      // console.log(action);
      switch (action.type) {
        case ActionTypes.GET_CLASSES_LIST:
            return { ...state,
              isWaiting: true
            };
        case ActionTypes.GET_CLASSES_LIST_SUCCESS:
            return { ...state,
              isWaiting: false,
              classes: action.data,
              success : true
            };
        case ActionTypes.GET_CLASSES_LIST_ERROR:
            return {
              ...state,
              isWaiting: false,
              success : false
            };
        case ActionTypes.SELECT_CLASSE:
            return {
              ...state,
              currentClasse: action.currentClasse
            };
        case ActionTypes.GET_PROJECTS_LIST_SUCCESS:

          // get default to project with max actions
          let selectedProjects = action.data
            .map( d => {
              let counts = d.projects.map( e => e.actionsCount)
              let max = Math.max.apply(Math, counts)
              var i = counts.indexOf(max)
              return d.projects[i]
            })

          return { ...state,
            isWaiting: false,
            projects: action.data,
            success : true,
            selectedProjects
          };
        case ActionTypes.SELECT_PROJECTS:

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
