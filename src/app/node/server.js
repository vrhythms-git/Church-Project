const processRequest = require(`${__dirname}/reqOperations`);
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
  console.log("signUp called with : " + JSON.stringify(req.body));

  //console.log(`Header info : ${JSON.stringify(req.header('user-agent'))}`)
  try {
    processRequest.getuserRecords(req.body)
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
  console.log("signUp called with : " + JSON.stringify(req.query.fbuid));
  try {
    processRequest.processGetUserMetaDataRequest(req.query.fbuid)
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
    console.error('Error in signUp as : ' + error)
  }
});


// firebaseAdminUtils.varifyUserToken(req.header('Authorization')).then(idToken => {});












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
