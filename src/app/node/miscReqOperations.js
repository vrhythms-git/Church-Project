const { Client, Pool } = require('pg');
const _ = require('underscore');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const dbConnections = require(`${__dirname}/dbConnection`);



function getCountryStates() {

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
    getCountryStates
}

