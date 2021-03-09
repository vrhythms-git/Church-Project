const { Client } = require('pg');
const errorHandling = require('./ErrorHandling/commonDBError');
const dbConnections = require(`${__dirname}/dbConnection`);

async function processSignInRequest(userInfo) {

    return new Promise((resolve, reject) => {

        let newUserInsStmt = `INSERT INTO public.t_user(
        first_name, last_name, middle_name, email_id, mobile_no, firebase_id)
       VALUES (
              '${userInfo.data.firstName}', 
              '${userInfo.data.lastName}',
              '${userInfo.data.middleName}',
              '${userInfo.data.email}',
              '${userInfo.data.mobileNo}',
              '${userInfo.data.fbId}'
       );`
        let client = dbConnections.getConnection();
        try {
            client.connect();
            client.query(newUserInsStmt, (err, res) => {
                if (err) {
                    console.error(`reqOperations.js::processSignInRequest() --> error while fetching results : ${err}`)
                    reject(errorHandling.handleDBError('queryExecutionError'));
                    return;
                }

                client.end()
                if (res)
                    resolve({
                        data: {
                            status: 'success'
                        }
                    })
            });
        } catch (error) {
            console.error(`reqOperations.js::processSignInRequest() --> error executing query as : ${error}`);
            reject(errorHandling.handleDBError('connectionError'));
        }
    });
}

module.exports = {
    processSignInRequest,
    getuserRecords
}

async function getuserRecords(userInfo) {

    return new Promise((resolve, reject) => {
        let getuserRecords = `Select distinct first_name,middle_name,last_name,dob,email_id from v_user;`
        let client = dbConnections.getConnection();     
      
        try {
            client.connect();
            client.query(getuserRecords, (err, res) => {
                if (err){
                  console.error(`reqOperations.js::processSignInRequest() --> error while fetching results : ${err}`)
                  reject(errorHandling.handleDBError('queryExecutionError')); 
                  return;
                }
                client.end()
                if (res)
                    resolve(res.rows)
                    currStateData = JSON.parse(JSON.stringify(res.rows));
            });
        } catch (error) {
            console.error(`reqOperations.js::processSignInRequest() --> error executing query as : ${error}`);
            reject(errorHandling.handleDBError('connectionError')); 
        }
    });
}

