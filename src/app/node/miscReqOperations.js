const { Client, Pool } = require('pg');
const _ = require('underscore');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result, reject } = require('underscore');
const { response } = require('express');

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

async function getMembers(fireBaseId){

    return new Promise((resolve, reject) => {
        try {
            let client = dbConnections.getConnection();
            client.connect();

            let noOfFamilyMembers = `select count(family_member_id) member_count from t_person_relationship tpr
            where family_head_id = 
                (select user_id from t_user tu 
                        where firebase_id = '${fireBaseId}')`;

            client.query(noOfFamilyMembers, (err, res) => {
                if (err) {
                    console.error(`miscReqOperations.js::getMembers() --> error while fetching results : ${err}`)
                    reject(errorHandling.handleDBError('queryExecutionError'));
                }

              //  console.log('Res:--->' + JSON.stringify(res))
               // let respJSON = { status: 'success'};
                if (res) {
                 //   respJSON.memberCount  =  res.rows[0].member_count;
                  
                      if(res.rows[0].member_count > 0){
                           
                        let fetchAllMembersData = `select 
                        jsonb_agg(
                          jsonb_build_object(
                            'userId', res.user_id, 'title', res.title, 
                            'firstName', res.first_name, 'lastName', 
                            res.last_name,  'role', res.role_name 
                          )
                        ) member_list
                      from 
                        (
                          select 
                            distinct user_id, 
                            title, 
                            first_name, 
                            last_name,
                            role_name 
                          from 
                            v_user 
                          where 
                            user_id in(
                              select 
                                family_member_id 
                              from 
                                t_person_relationship tpr 
                              where 
                                family_head_id = (
                                  select 
                                    user_id 
                                  from 
                                    t_user 
                                  where 
                                    firebase_id = '${fireBaseId}'
                                ) and is_deleted = false
                            ) 
                            or firebase_id = '${fireBaseId}'
                        ) res;`

                    client.query(fetchAllMembersData,(err, result) => {

                        if (err) {
                            console.error(`miscReqOperations.js::getMembers() --> error while fetching fetchAllMembersData results : ${err}`)
                            reject(errorHandling.handleDBError('queryExecutionError'));
                        }
        
                        client.end();

                        resolve({
                            data: {
                                status: 'success',
                                memberCount:  res.rows[0].member_count,
                                members: result.rows[0].member_list
                            }
                        })

                      });
            }else{
                    //client.end();

                let getUserIdByFirebase = `select user_id from t_user tu where firebase_id = '${fireBaseId}';`
                client.query(getUserIdByFirebase,(err, result) => {

                    if (err) {
                        console.error(`miscReqOperations.js::getMembers() --> error while fetching fetchAllMembersData results : ${err}`)
                        reject(errorHandling.handleDBError('queryExecutionError'));
                    }
    
                    client.end();

                    resolve({
                        data: {
                            status: 'success',
                            userId: result.rows[0].user_id,
                            memberCount:  res.rows[0].member_count,
                        }
                    })

                  });

                }
            }
            });

        } catch (error) {
            console.error(`miscReqOperations.js::getMembers() --> error executing query as : ${error}`);
            reject(errorHandling.handleDBError('connectionError'));
        }
    });

}


module.exports = {
    getCountryStates,
    getMembers
}

