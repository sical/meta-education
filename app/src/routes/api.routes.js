// Import node module
import express from 'express';
const router = express.Router();

const mongojs = require('mongojs')
const config = require('../../../config/config')

const dbName = config.db.dbName
const db = mongojs(dbName, ['actions', 'statements'])

// just to check
db.on('connect', function () {
    console.log('Mongo connected to db : '+dbName)
})

router.get("/", (req,res) => res.send({"message" : "hello API!"}))
// DB functions
router.get('/actions/:id', (req, res) => {
  db.actions.findOne({ _id :  mongojs.ObjectId(req.params.id)   }, (err, doc) => {
    if(err) throw error
    if (doc === null) res.send({})
    else res.send(doc);
  })
});

// GET a list of all users (students)
router.get('/students', (req, res) => {
  db.actions.distinct("statement.actor.name", {}, (err, docs) => {
      if(err) throw err
      if (docs == null) res.send({})
      res.send({
        students : docs
      })
    })
});

// GET all actions in a project
router.get('/project/:project_id/', (req, res) => {
  db.actions.find({ project_id :  req.params.project_id  }, (err, docs) => {
    if(err) throw error
    if (docs == null) res.send({})
    else res.send(docs);
  })
});

// GET a　list of all projects
router.get(['/projects'], (req, res) => {

  db.actions.mapReduce(
    function() {
       emit({ name : this.statement.actor.name, id : this.project_id }, 1)
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


      let projects = {}
      docs.forEach(d =>
        projects[d._id.name] ?
          projects[d._id.name].push({ projectId : d._id.id , count : d.value})
          :
          projects[d._id.name] = [{ projectId : d._id.id , count : d.value}]
        )
      res.send({
        projects : Object.keys(projects).map(p => ({ user : p, projects: projects[p] }))
      })
    })
});

// GET a　list of projects for a specific user
router.get(['/projects/:user_id/'], (req, res) => {
  let userId = req.params.user_id || ""

  db.actions.mapReduce(
    function() {
       emit(this.project_id, 1)
    },
    function(key, values) {
      let sum=0;
      for(var i in values) sum += values[i];
      return sum;
    },
    {
      out : { inline : 1},
      query: { "statement.actor.name" : userId},
    },
    (err, docs) => {
      if(err) throw err
      if (docs == null) res.send({})
      res.send({
        user : userId,
        projects : docs
      })
    })
});

// Exporting an object as the default import for this module
export default router;
