const { Client, Pool } = require('pg');
const _ = require('underscore');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const dbConnections = require(`${__dirname}/dbConnection`);

function setUserApprovalState(userData) {


    if(userData.data.status == true){
        let randomMemId = (Math.random() * (9999999 - 1000000) + 1000000).toFixed(0);
    }

    let  = `UPDATE t_user SET is_approved = ${userData.data.status} where user_id = ${userData.data.userId} ;`
    let client = dbConnections.getConnection();

    try {
        client.connect();
        client.query(getEventCategory, (err, res) => {
            if (err) {
                console.error(`userReqOperations.js::setUserApprovalState() --> error while fetching results : ${err}`)
                return (errorHandling.handleDBError('queryExecutionError'));
            }

            if (res) {
                for (let row of res.rows) {

                }

                client.end()
                return {
                    data: {
                        status: 'success'
                    }
                }
            }
        });
    } catch (error) {
        console.error(`userReqOperations.js::setUserApprovalState() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    }
}

module.exports = {
    setUserApprovalState
}