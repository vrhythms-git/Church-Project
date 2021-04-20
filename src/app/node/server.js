const processRequest = require(`${__dirname}/reqOperations`);
const processUserRequest = require(`${__dirname}/userReqOperations`)
const processMiscRequest = require(`${__dirname}/miscReqOperations`)
const processEventRequest = require(`./eventReqOperations`)
const dbConnections = require(`${__dirname}/dbConnection`);
express = require('express')
const cors = require('cors')
var app = express();
var compression = require('compression')
const path = require('path');

let port = 8081;

app.listen(process.env.PORT || port, () => {
  console.log(`Express server started at port number : ${port}`)
});

app.use(compression())

var corsOptions = {
  "origin": '*',
  "Access-Control-Allow-Origin": '*',
}

// app.use(express.static(__dirname + '/dist/insurancekarma/'));

app.use(express.json());
app.use('*', cors())


// app.get('/', function (req, res) {

//     res.sendFile(path.join(__dirname + "/dist/insurancekarma/index.html"));
// });

app.post('/api/signUp', function (req, res) {
  console.log("signUp called with : " + JSON.stringify(req.body));

  //console.log(`Header info : ${JSON.stringify(req.header('user-agent'))}`)
  try {
    processRequest.processSignInRequest(req.body)
      .then((data) => {
        console.log(`Returning with resonse : ${data}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in signUp as : ' + error)
  }
});

app.get('/api/getuserRecords', function (req, res) {
  console.log("getuserRecords called with : " + req.query.type + ' loggedInUser : ' + req.query.loggedInUser);

  //console.log(`Header info : ${JSON.stringify(req.header('user-agent'))}`)
  try {
    processRequest.getuserRecords(req.query.type, req.query.loggedInUser)
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in signUp as : ' + error)
  }
});

app.get('/api/getRoleMetadata', function (req, res) {
  console.log("Role Metadata with : " + JSON.stringify(req.body));

  //console.log(`Header info : ${JSON.stringify(req.header('user-agent'))}`)
  try {
    processRequest.getRoleMetadata()
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in Role Metadata as : ' + error)
  }
});

app.get('/api/getUserMetaData', function (req, res) {
  console.log("signUp called with : " + JSON.stringify(req.query.uid));
  try {
    processRequest.processGetUserMetaDataRequest(req.query.uid)
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in signUp as : ' + error)
  }
});

app.get('/api/getEventCategory', function (req, res) {
  console.log("getEventCategory called with : " + JSON.stringify(req.query.fbuid));
  try {
    processRequest.getEventCategory()
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getEventCategory as : ' + error)
  }
});


app.get('/api/getEventData', function (req, res) {
  console.log("getEventData called with : " + JSON.stringify(req.query.fbuid));
  try {
    processRequest.getEventData()
      .then((data) => {
        console.log(`Returning with response : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with response : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.log(`Error in getEventData as : ` + error)
  }
});

app.get('/api/getParishData', function (req, res) {
  console.log("getParishData called with : " + JSON.stringify(req.query.fbuid));
  try {
    processRequest.getParishData()
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getParishData as : ' + error)
  }
});



app.post('/api/insertEvents', function (req, res) {
  console.log("insertevents called with : " + JSON.stringify(req.body));
  try {
    processEventRequest.insertEvents(req.body.data)
      .then((data) => {
        console.log(`Returning with resonse : ${data}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in insertevents as : ' + error)
  }
});



app.post('/api/updateUserRoles', function (req, res) {
  console.log("updateUserRoles called with : " + JSON.stringify(req.body));
  try {
    processRequest.processUpdateUserRoles(req.body.data)
      .then((data) => {
        console.log(`Returning with resonse : ${data}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in updateUserRoles as : ' + error)
  }
});

app.get('/api/getParishData', function (req, res) {
  console.log("getParishData called with : " + JSON.stringify(req.query.fbuid));
  try {
    processRequest.getParishData()
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getParishData as : ' + error)
  }
});


//Endpoint to delete users
app.post('/api/deleteUsers', function (req, res) {
  console.log("deleteUsers called with : " + JSON.stringify(req.body));
  try {
    processRequest.deleteUsers(req.body.data)
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getParishData as : ' + error)
  }
});

//Endpoint to set user is_approved status 
app.post('/api/setUserApprovalState', function (req, res) {
  console.log("setUserApprovalState called with : " + JSON.stringify(req.body));
  try {
    processUserRequest.setUserApprovalState(req.body.data)
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in setUserApprovalState as : ' + error)
  }
});

//Endpoint to set user is_approved status 
app.get('/api/getCountryStates', function (req, res) {
  console.log("getCountryStates called with : ");
  try {
    processMiscRequest.getCountryStates()
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getCountryStates as : ' + error)
  }
});

// firebaseAdminUtils.varifyUserToken(req.header('Authorization')).then(idToken => {});


app.post('/api/updateEvent', function (req, res) {
  console.log("updateEvent called with : " + JSON.stringify(req.body));
  try {
    processEventRequest.updateEvent(req.body.data)
      .then((data) => {
        console.log(`Returning with resonse : ${data}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in updateEvent as : ' + error)
  }
});


app.post('/api/getProctorData', function (req, res) {
  console.log("getProctorData called with : " + JSON.stringify(req.query.fbuid));
  try {
    processEventRequest.getProctorData(req.body.data)
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getProctorData as : ' + error)
  }
});

app.post('/api/getVenues', function (req, res) {
  console.log("getVenues called with : " + JSON.stringify(req.body.data));
  try {
    processEventRequest.getVenues(req.body.data)
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getVenues as : ' + error)
  }
});

app.get('/api/getRegionAndParish', function (req, res) {
  console.log("getRegionAndParish called with : " + JSON.stringify(req.query.fbuid));
  try {
    processEventRequest.getRegionAndParish()
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getRegionAndParish as : ' + error)
  }
});

app.get('/api/getEventType', function (req, res) {
  console.log("getEventType called with : " + JSON.stringify(req.query.fbuid));
  try {
    processEventRequest.getEventType()
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getEventType as : ' + error)
  }
});


app.get('/api/getMembers', function (req, res) {
  console.log("getMembers called with : " + JSON.stringify(req.query.fbuid));
  try {
    processMiscRequest.getMembers(req.query.fbuid)
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getMembers as : ' + error)
  }
});



app.get('/api/getEventQuestionnaireData', function (req, res) {
  console.log("getEventQuestionnaireData called with : ");
  try {
    processEventRequest.getEventQuestionnaireData()
      .then((data) => {
        console.log(`Returning with response : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with response : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.log(`Error in getEventQuestionnaireData as : ` + error)
  }
});


app.get('/api/getEventForRegistration', function (req, res) {
  console.log("getEventForRegistration called with : " + JSON.stringify(req.query.fbuid));
  try {
    processEventRequest.getEventForRegistration()
      .then((data) => {
        console.log(`Returning with response : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with response : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.log(`Error in getEventForRegistration as : ` + error)
  }
});


app.get('/api/getUserApprovalStatus', function (req, res) {
  console.log("getUserApprovalStatus called with : " + JSON.stringify(req.query.fbuid));
  try {
    processMiscRequest.getUserApprovalStatus(req.query.fbuid)
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in getMembers as : ' + error)
  }
});

app.post('/api/updateBasicProfile', function (req, res) {
  console.log("updateBasicProfile called...");
  try {
    processUserRequest.updateUnApprovedUser(req.body.data)
      .then((data) => {
        console.log(`Returning with resonse : ${JSON.stringify(data)}`)
        res.send(data);
        res.end();
      }).catch((error) => {
        console.log(`Returning with resonse : ${error}`)
        res.send(error);
        res.end();
      })
  } catch (error) {
    console.error('Error in updateBasicProfile as : ' + error)
  }
});

// let client = dbConnections.getConnection();
// try {
//   client.connect();
//   client.query('SELECT * FROM test;', (err, res) => {
//     if (err) throw console.log(err);
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//     client.end()
//   });
// } catch (error) {
//   console.error('error executing query as : ' + error);
// }
