// Import node module
import express from 'express';
const router = express.Router();

const mongojs = require('mongojs')
const config = require('../../../config/config')

// get authorized users
const users = require('../../../data/users')

const dbName = config.db.dbName
const db = mongojs(dbName, ['actions', 'statements'])

// just to check
db.on('connect', function () {
    console.log('Mongo connected to db : '+dbName)
})

router.get("/", (req,res) => res.send({"message" : "hello API!"}))

// GET a single action
router.get('/actions/:id', (req, res) => {
  db.actions.findOne({ _id :  mongojs.ObjectId(req.params.id)   }, (err, doc) => {
    if(err) throw error
    if (doc === null) res.send({})
    else res.send(doc);
  })
});

// GET a list of all students for classes
router.get('/classes', (req, res) => {
  let students = {}

  users.users.forEach(d=>{
    if(!students[d.classeId]) students[d.classeId] = []
    students[d.classeId].push(d)
  })

  let classes = Object.keys(students).map(d => ({
    classeId : d,
    name : students[d][0].classe,
    professeur : students[d][0].professeur,
    students  : students[d]
  }))

  res.send(classes)

});

// db.actions.distinct("statement.actor.name", {}, (err, docs) => {
//     if(err) throw err
//     if (docs == null) res.send({})
//     res.send({
//       students : docs
//     })
//   })

// GET all actions in a project
router.get('/project/:project_id/', (req, res) => {
  db.actions.find({ project_id :  req.params.project_id  }, (err, docs) => {
    if(err) throw error
    if (docs == null) res.send({})
    else res.send(docs);
  })
});

// GET a list of all users in the DB (directly from statements)
router.get('/users', (req, res) => {

  db.statements.mapReduce(
    function() {
       emit({ id : this.actor.account }, 1)
    },
    function(key, values) {
      let sum = 0 ;
      for(var i in values) sum += values[i];
      return sum;
    },
    {
      out : { inline : 1}
    },
    (err, docs) => {
      if(err) throw err
      if (docs == null) res.send({})
      res.send({
        users : docs.map( d => {
          let id = d._id.id ? d._id.id.name : null
          return {
            "id" : id,
            "count" : d.value
          }
        }).sort((a,b) => b.count - a.count)
      })
    })
});

// GET a list of all users (directly from statements)
router.get('/projects/:classe_id', (req, res) => {

  let students = []
  users.users.forEach(d => {
    if(d.classeId == req.params.classe_id) students.push(d)
  })

  // console.log(students);
  // db.actions.distinct("project_id", { "statement.actor.name" : { $in : students } }, (err, docs) => {
  //   if(err) throw err
  //   if (docs == null) res.send({})
  //   else res.send(docs);
  // })

  db.actions.aggregate(
    {
      $match :
      {
        "statement.actor.account.name" : { $in : students.map(d => d.id)}
       }
    },
    {
      $sort : {
        "ts" : 1
      }
    },
    {
      $group :
      {
        "_id" : "$project_id",
        "actionsCount" : { $sum : 1 },
        end : { $max : "$ts"},
        start : { $min : "$ts"},
        users : { $addToSet : "$statement.actor.account.name" },
        names : { $addToSet : "$project_name" }
      }
    }
    ,(err, docs) => {
      if(err) throw err
      if (docs == null) res.send({})

      // parse projects
      let projectsByUser = {}
      docs.forEach( d => {
        let user = d.users[0]
        if(!projectsByUser[user]) projectsByUser[user] = []

        projectsByUser[user].push({
          id : d._id,
          duration : new Date(d.end) - new Date(d.start),
          actionsCount : d.actionsCount,
          start : d.start,
          end : d.end,
          name : d.names[d.names.length-1] // get last name 
        })
      })

      res.send(students.map(d => (
        {
          id : d.id,
          name : d.name,
          projects : projectsByUser[d.id].sort( (a,b) => new Date(b.end) - new Date(a.end)) // sort latest
        }
      )))
    }
  )

  // db.actions.mapReduce(
  //   function() {
  //      emit({ userId : this.statement.actor.account.name, projectId : this.project_id }, 1)
  //   },
  //   function(key, values) {
  //     let sum = 0 ;
  //     for(var i in values) sum += values[i];
  //     return sum;
  //   },
  //   {
  //     out : { inline : 1},
  //     query: { "statement.actor.account.name" : { $in : students}},
  //   },
  //   (err, docs) => {
  //     if(err) throw err
  //     if (docs == null) res.send({})
  //     let projectsByUser = {}
  //     docs.forEach( d => {
  //       console.log(d);
  //       if (!projectsByUser[d._id.userId]) projectsByUser[d._id.userId] = []
  //       projectsByUser[d._id.userId].push({
  //         projectId : d._id.projectId,
  //         actionsCount : d.value
  //       })
  //     })
  //
  //     res.send({
  //       classeId : req.params.classeId,
  //       projects : projectsByUser
  //     })
  //   })
});

// GET a　list of all projects
// router.get('/projects', (req, res) => {
//
//   db.statements.mapReduce(
//     function() {
//        emit({ name : this.actor.name, id : this.project_id }, 1)
//     },
//     function(key, values) {
//       let sum = 0 ;
//       for(var i in values) sum += values[i];
//       return sum;
//     },
//     {
//       out : { inline : 1}
//     },
//     (err, docs) => {
//       if(err) throw err
//       if (docs == null) res.send({})
//       let projects = {}
//       docs.forEach(d =>
//         projects[d._id.name] ?
//           projects[d._id.name].push({ projectId : d._id.id , count : d.value})
//           :
//           projects[d._id.name] = [{ projectId : d._id.id , count : d.value}]
//         )
//       res.send({
//         projects : Object.keys(projects).map(p => ({ user : p, projects: projects[p] }))
//       })
//     })
// });
//
// // GET a　list of projects for a specific user
// router.get(['/projects/:user_id/'], (req, res) => {
//   let userId = req.params.user_id || ""
//
//   db.actions.mapReduce(
//     function() {
//        emit(this.project_id, 1)
//     },
//     function(key, values) {
//       let sum=0;
//       for(var i in values) sum += values[i];
//       return sum;
//     },
//     {
//       out : { inline : 1},
//       query: { "statement.actor.name" : userId},
//     },
//     (err, docs) => {
//       if(err) throw err
//       if (docs == null) res.send({})
//       res.send({
//         user : userId,
//         projects : docs
//       })
//     })
// });

// Exporting an object as the default import for this module
export default router;
