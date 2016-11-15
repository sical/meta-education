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
  let names = {}
  users.users.forEach(d => {
    if(d.classeId == req.params.classe_id) {
      names[d.id] = d.name
      students.push(d)
    }

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
          userId : user,
          userName: names[user],
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

/*
"2e6b93f5-70c9-4db3-b759-f27e0132720b"
"568d40b0-b09b-48d5-aff0-330a23a4fc34"
"5ca6a147-1b4c-4b43-850f-642736286fd6"
"7e29d925-a9e4-411e-b797-82011aad52a8"
"f6d5a965-0257-49b4-95cc-840e1c11c43f"
"599c93c6-c14a-4560-a85a-d980756193c6"
*/

router.get('/stats', (req, res) => {

  let projects = req.query.projects instanceof Array ? req.query.projects : [req.query.projects]
  if(!projects) res.send({
    status : "error",
    message : "No projects defined."
  })

  db.actions.aggregate(
    {
      $match :
      {
        "project_id" : { $in : projects}
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
        series : {
          $push : {
            type : "$type",
            element : "$element_type",
            ts : "$ts",
            edgesCount : { "$size" : "$edges"},
            nodesCount : { "$size" : "$nodes"}
          }
        },
        finalNodes : { $last : "$nodes"},
        finalEdges : { $last : "$edges"},
        end : { $max : "$ts"},
        start : { $min : "$ts"},
        }
    }
    ,
    {
      $project : {
        id : "$id",
        actionsCount : "$actionsCount",
        series : "$series",
        finalNetwork : {
          edges : "$finalEdges",
          nodes : "$finalNodes"
        },
        end : "$end",
        start : "$start"
      }
    }
    ,(err, docs) => {
      if(err) throw err
      if (docs == null) res.send({})

      // calculate some stats

      let stats = {}
      docs.forEach( project => {

        let volumen = {}
        project.series.forEach( action =>{
          let sum = volumen[action.type] || 0
          volumen[action.type] = sum + 1;
        })

        console.log(volumen);

        let clarity = (volumen.delete*100)/volumen.create || 0

        let density = project.finalNetwork.nodes.length

        let resources = project.finalNetwork.nodes
          .map(d => d[1]["uri"])
          .filter( uri => uri != "" )

        let resourcesUsedPercent = (resources.length*100)/density

        let degrees = {}
        project.finalNetwork.edges
          .forEach(d => {
            let source = d[0],
              target = d[1]
            degrees[source] = degrees[source] == undefined ? 0 : degrees[source]+1
            degrees[target] = degrees[target] == undefined ? 0 : degrees[target]+1
          })

        let sumDegrees = Object.keys(degrees)
          .map(d => degrees[d])
          .reduce((a, b)=> a + b,0)

        let mediumDegree = sumDegrees / density

        let network = project.finalNetwork

        let projectStats = {
          volumen,
          clarity,
          density,
          network,
          mediumDegree,
          resources,
          resourcesUsedPercent
        }
        stats[project._id] = projectStats
      })

      res.send(stats)
    })

})
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
