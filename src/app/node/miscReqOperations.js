const { Client, Pool } = require('pg');
const _ = require('underscore');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result, reject } = require('underscore');

const dbConnections = require(`${__dirname}/dbConnection`);



function getCountryStates() {

    return new Promise((resolve, reject) => {
        try {
            let client = dbConnections.getConnection();
            client.connect();

            let getContriesStates = `SELECT Json_agg(a.con_state) as op_json 
             FROM   (SELECT Json_build_object('countryName', country_name, 'states', Json_agg
                       (
                              state_name))
                       AS con_state
                FROM   t_state_country_codes tscc
                GROUP  BY tscc.country_name) a; `;

            client.query(getContriesStates, (err, res) => {
                if (err) {
                    console.error(`miscReqOperations.js::getCountryStates() --> error while fetching results : ${err}`)
                    reject(errorHandling.handleDBError('queryExecutionError'));
                }

                if (res) {
                    let conStatejson = res.rows[0].op_json
                    console.log(conStatejson)

                    client.end();

                    resolve({
                        data: {
                            status: 'success',
                            countryState: conStatejson
                        }
                    })

                }
            });

        } catch (error) {
            console.error(`miscReqOperations.js::getCountryStates() --> error executing query as : ${error}`);
            reject(errorHandling.handleDBError('connectionError'));
        }
    });
}

module.exports = {
    getCountryStates
}

