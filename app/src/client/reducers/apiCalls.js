import { ActionTypes } from '../actions'

export const apiReducer = (state = {
      projects : [],
      students: [] ,
      isWaiting: false
    },
    action) => {
      switch (action.type) {
        case ActionTypes.GET_STUDENTS_LIST:
            return { ...state, isWaiting: true };
        case ActionTypes.GET_STUDENTS_LIST_SUCCESS:
            return { ...state, isWaiting: false, students: action.data.students, success : true };
        case ActionTypes.GET_STUDENTS_LIST_ERROR:
            return { ...state, isWaiting: false, success : false  };
        case ActionTypes.GET_PROJECTS_LIST_SUCCESS:
          return { ...state, isWaiting: false, projects: action.data.projects, success : true  };
        case ActionTypes.GET_PROJECTS_LIST_ERROR:
            return { ...state, isWaiting: false, success : false  };
        default:
            return state;
    }
};
