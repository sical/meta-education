import request from 'superagent'

export default function getProjects(projectId, callback) {
  request
    .get('/api/user_actions/'+projectId)
    .end((err, res) => {
      if (err) throw err
      const data = JSON.parse(res.text)
      // console.log(data);
      callback(err, data)
    })
}
