const { Client, Pool } = require('pg');
const _ = require('underscore');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const { json } = require('express');
const { getMaxListeners } = require('node:process');
const dbConnections = require(`${__dirname}/dbConnection`);

async function persistParticipantScore(userScoreData, userId) {
    console.log('Judge ' + userId + ' saving user record ');

    let client = dbConnections.getConnection();
    try {
        await client.connect();
        await client.query('begin;');
        //Populating user t_participant_event_score;    
        if (userScoreData.action == 'save') {

            const instScrQry = `INSERT INTO t_participant_event_score
                                (participant_event_reg_cat_id, event_cat_staff_map_id, score, created_by, is_deleted, created_date )
                            VALUES($1, $2, $3, $4, $4, $5, $6, $7);`;

            for(let participantScore of userScoreData.scoreData){
                
                // if(participantScore.
                
            }
           
            let instScrQryValue = [
                    // partEveRegCatId

                                ];

            let result = await client.query(insertScore);     

        }
        return {
            data: {
                status: 'success',
                paticipants: result.rows[0] == undefined ? [] : result.rows[0].participants
            }
        }

    } catch (error) {
        console.error(`eventReqOperations.js::getParticipant() : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    } finally {
        client.end();
    }

}

module.exports = {
    persistParticipantScore
}