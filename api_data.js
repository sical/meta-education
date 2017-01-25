define({ "api": [
  {
    "type": "get",
    "url": "/action/:id",
    "title": "A Single Action",
    "name": "GetAction",
    "group": "Actions",
    "description": "<p>Returns a single action as stored in the DB</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "_id",
            "optional": false,
            "field": "_id",
            "description": "<p>Unique ID in Mongo DB.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "project_name",
            "description": "<p>Name of the project this action belongs to.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ts",
            "description": "<p>Timestamp of the action.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "edges",
            "description": "<p>Array of all edges in the network.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of action.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "element_type",
            "description": "<p>Type of the element used in this action.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Unique ID in Tincan API.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "nodes",
            "description": "<p>Array of all nodes in the network.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "statement",
            "description": "<p>Original statement from TinCan/²XAPI</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n  \"_id\": \"5821edeec0a24b255d6ff8cd\",\n  \"project_name\": \"Untitled Renkan\",\n  \"ts\": \"2016-10-12T14:15:06.615Z\",\n  \"edges\": [...],\n  \"element_type\": \"Node\",\n  \"statement\": {...},\n  \"nodes\": [...],\n  \"project_id\": \"2e6b93f5-70c9-4db3-b759-f27e0132720b\",\n  \"type\": \"create\",\n  \"id\": \"8cfaa9d8-31a2-4320-ba44-20945bea3d10\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/api.routes.js",
    "groupTitle": "Actions"
  },
  {
    "type": "get",
    "url": "/actions/:project_id/",
    "title": "All actions in a project",
    "group": "Actions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Project unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "Actions",
            "description": "<p>A list of all actions in a specific project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\": \"5821edeec0a24b255d6ff8cd\",\n    \"project_name\": \"Untitled Renkan\",\n    \"ts\": \"2016-10-12T14:15:06.615Z\",\n    \"edges\": [...],\n    \"element_type\": \"Node\",\n    \"statement\": {...},\n    \"nodes\": [...],\n    \"project_id\": \"2e6b93f5-70c9-4db3-b759-f27e0132720b\",\n    \"type\": \"create\",\n    \"id\": \"8cfaa9d8-31a2-4320-ba44-20945bea3d10\"\n  },\n  ...\n  {\n    \"_id\": \"5821edeec0a24b255d6ff8ce\",\n    \"project_name\": \"Untitled Renkan\",\n    \"ts\": \"2016-10-12T14:15:06.615Z\",\n    \"edges\": [...],\n    \"element_type\": \"Node\",\n    \"statement\": {...},\n    \"nodes\": [...],\n    \"project_id\": \"2e6b93f5-70c9-4db3-b759-f27e0132720b\",\n    \"type\": \"create\",\n    \"id\": \"daf11f77-2ce0-4414-aa9a-886ad0e14f1f\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/api.routes.js",
    "groupTitle": "Actions",
    "name": "GetActionsProject_id"
  },
  {
    "type": "get",
    "url": "/stats?projects=:project_id",
    "title": "Stats for a project",
    "group": "Stats",
    "description": "<p>Returns a set of stats and indicators for all projects passed as arguments. All these values are calculated on each call.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "project_id",
            "description": "<p>Project unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "An",
            "description": "<p>object containing all stats for a specific project</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "volumen",
            "description": "<p>Number of actions of each type</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "clarity",
            "description": "<p>Clarity indicator</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "density",
            "description": "<p>Density indicator</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "network",
            "description": "<p>Nodes and edges of the final network</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "series",
            "description": "<p>Time series containing timestamps and number of actions</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "mediumDegree",
            "description": "<p>Average degree in the graph</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "resources",
            "description": "<p>list of URLs of external resources used in the map</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "resourcesUsedPercent",
            "description": "<p>Percent of nodes and edges containing resources</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n{\n  \"2e6b93f5-70c9-4db3-b759-f27e0132720b\": {\n    \"volumen\": {\n      \"create\": 1,\n      \"update\": 2\n    },\n    \"clarity\": 0,\n    \"density\": 1,\n    \"network\": {\n      \"edges\": [...],\n      \"nodes\": [...]\n    },\n    \"series\": [\n      {\n        \"ts\": \"2016-10-12T14:15:06.615Z\",\n        \"count\": 1\n      },\n      ...\n      {\n        \"ts\": \"2016-10-12T14:15:15.219Z\",\n        \"count\": 1\n      }\n    ],\n    \"mediumDegree\": 0,\n    \"resources\": [\n      \"https://www.youtube.com/watch?v=QIkSCA99Uvo\"\n    ],\n    \"resourcesUsedPercent\": 100\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/api.routes.js",
    "groupTitle": "Stats",
    "name": "GetStatsProjectsProject_id"
  },
  {
    "type": "get",
    "url": "/classes",
    "title": "A List  of Classes",
    "group": "Students",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "classes",
            "description": "<p>A list of all students for the classes</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "classes.classeId",
            "description": "<p>Unique ID for the class</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "classes.name",
            "description": "<p>Unique Name for the class</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "classes.professeur",
            "description": "<p>Unique ID of the professor</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "classes.students",
            "description": "<p>List of the students</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "classes.students.name",
            "description": "<p>Name of the student</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "classes.students.id",
            "description": "<p>Unique ID of the student</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\"message\":\"hello API!\"}\n[\n  {\n    \"classeId\": \"Renoir\",\n    \"name\": \"Renoir\",\n    \"professeur\": \"W5P5Y\",\n    \"students\": [\n      {\n        \"name\": \"Élève Renoir07\",\n        \"id\": \"98702d96-0b90-4643-9f8e-8127f946de8d\"\n      },\n     ...\n      {\n        \"name\": \"Élève Renoir08\",\n        \"id\": \"1172c7f8-133f-4914-8a94-57692e42979c\"\n      }\n    ]\n  }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/api.routes.js",
    "groupTitle": "Students",
    "name": "GetClasses"
  },
  {
    "type": "get",
    "url": "/projects/:classe_id/",
    "title": "All projects for a specific class",
    "group": "Students",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "class_id",
            "description": "<p>The unique ID for a classe</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "students",
            "description": "<p>A list of all students with their projects</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.id",
            "description": "<p>Unique ID for the student</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.name",
            "description": "<p>Name of the Student</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "students.projects",
            "description": "<p>List of his projects</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.projects.id",
            "description": "<p>Unique ID of the project</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "students.projects.duration",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "students.projects.actionsCount",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.projects.start",
            "description": "<p>Timestamp of the first action in the project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.projects.end",
            "description": "<p>Timestamp of the last action in the project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.projects.userId",
            "description": "<p>Unique ID of the student</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.projects.userName",
            "description": "<p>Name of the student</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "students.projects.name",
            "description": "<p>Name of the project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "   HTTP/1.1 200 OK\n[\n  {\n    \"id\": \"641f2452-8237-4d48-9b58-e3d1bb648f7b\",\n    \"name\": \"Élève Renoir11\",\n    \"projects\": [\n      {\n        \"id\": \"826d31ad-8485-48bc-8f9f-c973f1b78a3d\",\n        \"duration\": 48620,\n        \"actionsCount\": 14,\n        \"start\": \"2016-11-23T10:13:46.086Z\",\n        \"end\": \"2016-11-23T10:14:34.706Z\",\n        \"userId\": \"641f2452-8237-4d48-9b58-e3d1bb648f7b\",\n        \"userName\": \"Élève Renoir11\",\n        \"name\": \"Untitled Renkan\"\n      },\n      ...\n      {\n        \"id\": \"b9090aac-40fc-4e16-a862-789db9f9bfe4\",\n        \"duration\": 425152766,\n        \"actionsCount\": 331,\n        \"start\": \"2016-11-18T12:21:44.277Z\",\n        \"end\": \"2016-11-23T10:27:37.043Z\",\n        \"userId\": \"641f2452-8237-4d48-9b58-e3d1bb648f7b\",\n        \"userName\": \"Élève Renoir11\",\n        \"name\": \"Untitled Renkan\"\n      }\n    ]\n  },\n  ...\n  {\n    \"id\": \"1172c7f8-133f-4914-8a94-57692e42979c\",\n    \"name\": \"Élève Renoir08\",\n    \"projects\": [\n      {\n        \"id\": \"44b8fcee-6fd5-4ccc-9f37-b9e7cc4ee83c\",\n        \"duration\": 762626,\n        \"actionsCount\": 93,\n        \"start\": \"2016-11-16T10:12:38.408Z\",\n        \"end\": \"2016-11-16T10:25:21.034Z\",\n        \"userId\": \"1172c7f8-133f-4914-8a94-57692e42979c\",\n        \"userName\": \"Élève Renoir08\",\n        \"name\": \"Untitled Renkan\"\n      }\n    ]\n  }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/api.routes.js",
    "groupTitle": "Students",
    "name": "GetProjectsClasse_id"
  }
] });
