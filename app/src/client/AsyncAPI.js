import store from './store'
import { ActionTypes } from './actions'
import querystring  from 'querystring'

export default class AsyncAPI {

    static getStudentsList = () => {
      console.log("api call students");
      var url = "/api/classes"
      //`http://data.com/${userId}`
      store.dispatch({ type : ActionTypes.GET_STUDENTS_LIST })
      return dispatch => fetch(url) // Redux Thunk handles these
        .then(res => res.json())
        .then(
          data => store.dispatch({ type: 'GET_STUDENTS_LIST_SUCCESS', data }),
          err => store.dispatch({ type: 'GET_STUDENTS_LIST_ERROR', err })
        );
    }

    static getProjectsList = (classeId) => {
      // console.log("api call students : "+userId);
      var url = `/api/projects/${classeId}`
      return dispatch => fetch(url) // Redux Thunk handles these
        .then(res => res.json())
        .then(
          data => store.dispatch({ type: 'GET_PROJECTS_LIST_SUCCESS', data }),
          err => store.dispatch({ type: 'GET_PROJECTS_LIST_ERROR', err })
        );
    }

    static getProject = (_id) => {
      console.log("api call students : "+_id);
      var url = `/api/project/${_id}`
      return dispatch => fetch(url) // Redux Thunk handles these
        .then(res => res.json())
        .then(
          data => store.dispatch({ type: ActionTypes.GET_PROJECT_ACTIONS_SUCCESS, data }),
          err => store.dispatch({ type: ActionTypes.GET_PROJECT_ACTIONS_ERROR, err })
        );
    }

    static getStats = (projects) => {
      console.log("api call stats : "+projects.length + " projects");

      if(!projects.length) {
        store.dispatch({ type: ActionTypes.GET_STATS_ERROR })
      }

      let q = querystring.stringify({ projects : projects})
      var url = `/api/stats?${q}`

      return dispatch => fetch(url) // Redux Thunk handles these
        .then(res => res.json())
        .then(
          data => store.dispatch({ type: ActionTypes.GET_STATS_SUCCESS, data }),
          err => store.dispatch({ type: ActionTypes.GET_STATS_ERROR, err })
        );
    }
}

// export default function getProjects(projectId, callback) {
//   request
//     .get('/api/user_actions/'+projectId)
//     .end((err, res) => {
//       if (err) throw err
//       const data = JSON.parse(res.text)
//       // console.log(data);
//       callback(err, data)
//     })
// }
