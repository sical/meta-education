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

// DB functions
router.get('/actions/:id', (req, res) => {
  db.actions.findOne({ _id :  mongojs.ObjectId(req.params.id)   }, (err, doc) => {
    if(err) throw error
    if (doc === null) res.send({})
    else res.send(doc);
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

// GET a　list of projects for a specific user
router.get('/user_actions/:user_id/', (req, res) => {
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
      query: { "statement.actor.name" : req.params.user_id},
    },
    (err, docs) => {
      if(err) throw err
      if (docs == null) res.send({})
      res.send({
        user : req.params.user_id,
        projects : docs
      })
    })
});

// Exporting an object as the default import for this module
export default router;
