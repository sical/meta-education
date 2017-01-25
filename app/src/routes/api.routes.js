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

router.get("/", (req,res) => res.send({
  "message" : "hello API!"
}))

/**
 * @api {get} /classes A List  of Classes
 * @apiGroup Students
 *
 * @apiSuccess {Array} classes A list of all students for the classes
 * @apiSuccess {String} classes.classeId Unique ID for the class
 * @apiSuccess {String} classes.name Unique Name for the class
 * @apiSuccess {String} classes.professeur Unique ID of the professor
 * @apiSuccess {Array} classes.students List of the students
 * @apiSuccess {String} classes.students.name Name of the student
 * @apiSuccess {String} classes.students.id Unique ID of the student
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {"message":"hello API!"}
 * [
 *   {
 *     "classeId": "Renoir",
 *     "name": "Renoir",
 *     "professeur": "W5P5Y",
 *     "students": [
 *       {
 *         "name": "Élève Renoir07",
 *         "id": "98702d96-0b90-4643-9f8e-8127f946de8d"
 *       },
 *      ...
 *       {
 *         "name": "Élève Renoir08",
 *         "id": "1172c7f8-133f-4914-8a94-57692e42979c"
 *       }
 *     ]
 *   }
 * ]
 */
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
    students  : students[d].map( student => ({ name : student.name, id : student.id }))
  }))

  res.send(classes)
});

/**
 * @api {get} /projects/:classe_id/ All projects for a specific class
 * @apiGroup Students
 *
 * @apiParam {String} class_id The unique ID for a classe
 *
 * @apiSuccess {Array} students A list of all students with their projects
 * @apiSuccess {String} students.id Unique ID for the student
 * @apiSuccess {String} students.name Name of the Student
 * @apiSuccess {Array} students.projects List of his projects
 * @apiSuccess {String} students.projects.id Unique ID of the project
 * @apiSuccess {Number} students.projects List of his projects
 * @apiSuccess {Number} students.projects.duration　
 * @apiSuccess {Number} students.projects.actionsCount
 * @apiSuccess {String} students.projects.start Timestamp of the first action in the project
 * @apiSuccess {String} students.projects.end Timestamp of the last action in the project
 * @apiSuccess {String} students.projects.userId Unique ID of the student
 * @apiSuccess {String} students.projects.userName Name of the student
 * @apiSuccess {String} students.projects.name Name of the project
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 * [
 *   {
 *     "id": "641f2452-8237-4d48-9b58-e3d1bb648f7b",
 *     "name": "Élève Renoir11",
 *     "projects": [
 *       {
 *         "id": "826d31ad-8485-48bc-8f9f-c973f1b78a3d",
 *         "duration": 48620,
 *         "actionsCount": 14,
 *         "start": "2016-11-23T10:13:46.086Z",
 *         "end": "2016-11-23T10:14:34.706Z",
 *         "userId": "641f2452-8237-4d48-9b58-e3d1bb648f7b",
 *         "userName": "Élève Renoir11",
 *         "name": "Untitled Renkan"
 *       },
 *       ...
 *       {
 *         "id": "b9090aac-40fc-4e16-a862-789db9f9bfe4",
 *         "duration": 425152766,
 *         "actionsCount": 331,
 *         "start": "2016-11-18T12:21:44.277Z",
 *         "end": "2016-11-23T10:27:37.043Z",
 *         "userId": "641f2452-8237-4d48-9b58-e3d1bb648f7b",
 *         "userName": "Élève Renoir11",
 *         "name": "Untitled Renkan"
 *       }
 *     ]
 *   },
 *   ...
 *   {
 *     "id": "1172c7f8-133f-4914-8a94-57692e42979c",
 *     "name": "Élève Renoir08",
 *     "projects": [
 *       {
 *         "id": "44b8fcee-6fd5-4ccc-9f37-b9e7cc4ee83c",
 *         "duration": 762626,
 *         "actionsCount": 93,
 *         "start": "2016-11-16T10:12:38.408Z",
 *         "end": "2016-11-16T10:25:21.034Z",
 *         "userId": "1172c7f8-133f-4914-8a94-57692e42979c",
 *         "userName": "Élève Renoir08",
 *         "name": "Untitled Renkan"
 *       }
 *     ]
 *   }
 * ]
 */
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
          projects : projectsByUser[d.id] //.sort( (a,b) => new Date(b.end) - new Date(a.end)) // sort latest
        }
      )).filter( d => d.projects))
    }
  )
});



/**
 * @api {get} /action/:id A Single Action
 * @apiName GetAction
 * @apiGroup Actions
 * @apiDescription Returns a single action as stored in the DB
 * @apiParam {_id} _id Unique ID in Mongo DB.

 * @apiSuccess {String} project_name Name of the project this action belongs to.
 * @apiSuccess {String} ts Timestamp of the action.
 * @apiSuccess {Array} edges Array of all edges in the network.
 * @apiSuccess {String} type Type of action.
 * @apiSuccess {String} element_type Type of the element used in this action.
 * @apiSuccess {String} id Unique ID in Tincan API.
 * @apiSuccess {Array} nodes Array of all nodes in the network.
 * @apiSuccess {Object} statement Original statement from TinCan/²XAPI
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "_id": "5821edeec0a24b255d6ff8cd",
 *   "project_name": "Untitled Renkan",
 *   "ts": "2016-10-12T14:15:06.615Z",
 *   "edges": [...],
 *   "element_type": "Node",
 *   "statement": {...},
 *   "nodes": [...],
 *   "project_id": "2e6b93f5-70c9-4db3-b759-f27e0132720b",
 *   "type": "create",
 *   "id": "8cfaa9d8-31a2-4320-ba44-20945bea3d10"
 * }
 */
router.get('/action/:id', (req, res) => {
  db.actions.findOne({ _id :  mongojs.ObjectId(req.params.id)   }, (err, doc) => {
    if(err) throw error
    if (doc === null) res.send({})
    else res.send(doc);
  })
});

/**
 * @api {get} /actions/:project_id/ All actions in a project
 * @apiGroup Actions
 *
 * @apiParam {String} id Project unique ID.
 *
 * @apiSuccess {Array} Actions A list of all actions in a specific project
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    [
 *      {
 *        "_id": "5821edeec0a24b255d6ff8cd",
 *        "project_name": "Untitled Renkan",
 *        "ts": "2016-10-12T14:15:06.615Z",
 *        "edges": [...],
 *        "element_type": "Node",
 *        "statement": {...},
 *        "nodes": [...],
 *        "project_id": "2e6b93f5-70c9-4db3-b759-f27e0132720b",
 *        "type": "create",
 *        "id": "8cfaa9d8-31a2-4320-ba44-20945bea3d10"
 *      },
 *      ...
 *      {
 *        "_id": "5821edeec0a24b255d6ff8ce",
 *        "project_name": "Untitled Renkan",
 *        "ts": "2016-10-12T14:15:06.615Z",
 *        "edges": [...],
 *        "element_type": "Node",
 *        "statement": {...},
 *        "nodes": [...],
 *        "project_id": "2e6b93f5-70c9-4db3-b759-f27e0132720b",
 *        "type": "create",
 *        "id": "daf11f77-2ce0-4414-aa9a-886ad0e14f1f"
 *      }
 *    ]
 */
router.get('/actions/:project_id/', (req, res) => {
  db.actions.find({ project_id :  req.params.project_id  }, (err, docs) => {
    if(err) throw error
    if (docs == null) res.send({})
    else res.send(docs);
  })
});

/**
 * @api {get} /stats?projects=:project_id Stats for a project
 * @apiGroup Stats
 * @apiDescription Returns a set of stats and indicators for all projects passed as arguments. All these values are calculated on each call.
 *
 * @apiParam {String} project_id Project unique ID.

 * @apiSuccess {Object} An object containing all stats for a specific project
 * @apiSuccess {Object} volumen Number of actions of each type
 * @apiSuccess {Number} clarity Clarity indicator
 * @apiSuccess {Number} density Density indicator
 * @apiSuccess {Object} network Nodes and edges of the final network
 * @apiSuccess {Array} series Time series containing timestamps and number of actions
 * @apiSuccess {Number} mediumDegree Average degree in the graph
 * @apiSuccess {Array} resources list of URLs of external resources used in the map
 * @apiSuccess {Object} resourcesUsedPercent Percent of nodes and edges containing resources
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "2e6b93f5-70c9-4db3-b759-f27e0132720b": {
 *     "volumen": {
 *       "create": 1,
 *       "update": 2
 *     },
 *     "clarity": 0,
 *     "density": 1,
 *     "network": {
 *       "edges": [...],
 *       "nodes": [...]
 *     },
 *     "series": [
 *       {
 *         "ts": "2016-10-12T14:15:06.615Z",
 *         "count": 1
 *       },
 *       ...
 *       {
 *         "ts": "2016-10-12T14:15:15.219Z",
 *         "count": 1
 *       }
 *     ],
 *     "mediumDegree": 0,
 *     "resources": [
 *       "https://www.youtube.com/watch?v=QIkSCA99Uvo"
 *     ],
 *     "resourcesUsedPercent": 100
 *   }
 * }
 */
router.get('/stats', (req, res) => {

  let projects = req.query.projects instanceof Array ? req.query.projects : [req.query.projects]
  if(!projects) res.send({
    status : "error",
    message : "No projects defined."
  })

  db.actions.aggregate([
    {
      $match :
      {
        "project_id" : { $in : projects}
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
    ]
    ,
	   { allowDiskUse: true }
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

        let series = project.series.map( d => (
          {
            ts :  d.ts,// new Date(d.ts).getTime(),
            count: d.edgesCount + d.nodesCount
          }
        ))

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
          series,
          mediumDegree,
          resources,
          resourcesUsedPercent
        }
        stats[project._id] = projectStats
      })
      res.send(stats)
    })

})

export default router;
