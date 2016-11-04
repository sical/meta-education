import store from './store'
import { ActionTypes } from './actions'

export default class AsyncAPI {

    static getStudentsList = () => {
      console.log("api call students");
      var url = "/api/students/"
      //`http://data.com/${userId}`
      store.dispatch({ type : ActionTypes.GET_STUDENTS_LIST })
      return dispatch => fetch(url) // Redux Thunk handles these
        .then(res => res.json())
        .then(
          data => store.dispatch({ type: 'GET_STUDENTS_LIST_SUCCESS', data }),
          err => store.dispatch({ type: 'GET_STUDENTS_LIST_ERROR', err })
        );
    }

    static getProjectsList = (id) => {
      console.log("api call students : "+id);
      var url = `/api/projects/${id}`
      return dispatch => fetch(url) // Redux Thunk handles these
        .then(res => res.json())
        .then(
          data => store.dispatch({ type: 'GET_PROJECTS_LIST_SUCCESS', data }),
          err => store.dispatch({ type: 'GET_PROJECTS_LIST_ERROR', err })
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
