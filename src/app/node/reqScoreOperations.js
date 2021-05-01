const { Client, Pool } = require('pg');
const _ = require('underscore');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const { json } = require('express');
const dbConnections = require(`${__dirname}/dbConnection`);


var connCloseFlag = false;
async function persistParticipantScore(userScoreData, userId) {

    let client; 
    
    try {
        client = dbConnections.getConnection();
        await client.connect();
        console.log('Judge to ' + userId + ' ' + userScoreData.action + ' ' + userScoreData.scoreData.length + ' participants score.');

        await client.query('begin;');
        //Populating user t_participant_event_score;
        console.log('Action is : ' + userScoreData.action + ' no. of participant\'s score to update : ' + userScoreData.scoreData.length)
       
       // Score upload save button logic.
        if (userScoreData.action === 'save') {
            const instScrQry = `INSERT INTO t_participant_event_score
                                (participant_event_reg_cat_id, event_cat_staff_map_id, score, created_by, is_deleted, created_date )
                            VALUES($1, $2, $3, $4, $5, $6) returning participant_event_score_id; `;

            const updateScrQry = `update t_participant_event_score set score=$1, updated_by=$2, updated_date=$3
                                  where participant_event_score_id=$4`;

            for (let i = 0; i < userScoreData.scoreData.length; i++) {

                let paricipant = userScoreData.scoreData[i];
                if (paricipant.scoreRefId == null) {
                    console.log('scoreRefId is null so insterting the record.')
                    let instScrQryValue = [
                        paricipant.partEveRegCatId,
                        paricipant.catStaffMapId,
                        paricipant.score,
                        userId,
                        false,
                        new Date().toUTCString()
                    ];
                    await client.query(instScrQry, instScrQryValue)
                } else {
                    console.log('scoreRefId is ' + paricipant.scoreRefId + ' so updating the record.')
                    let updateScrQryValue = [
                        paricipant.score,
                        userId,
                        new Date().toUTCString(),
                        paricipant.scoreRefId
                    ];
                    await client.query(updateScrQry, updateScrQryValue) 
                }
            }
            await client.query(`commit;`);
            connCloseFlag = true;
        }

     //score upload submit button logic   
        if (userScoreData.action === 'submit') {
                 
            let updateSubmittedStatus = `update t_event_cat_staff_map set is_score_submitted = true
                                          where event_id = ${userScoreData.eventId} and user_id= ${userId};`;

             await client.query(updateSubmittedStatus);
            console.log(`Updated is_score_submitted for event id: ${userScoreData.eventId}`)
            userScoreData.action = 'save';
            console.log('Calling same function(persistParticipantScore) to save all \'Submit\' action data.');
            persistParticipantScore(userScoreData, userId)
            client.query(`commit;`);
        }

        // when event co-ordinator approves the score, Approve button logic. 
        if (userScoreData.action === 'approve'){

        }

        return {
            data: {
                status: 'success'
            }
        }

    } catch (error) {
        //client.end();
        await client.query('rollback;');
        connCloseFlag = true;
        dbConnections.endConnection(client);
        console.error(`reqScoreOperations.js::persistParticipantScore() : ${error}`);
        return (errorHandling.handleDBError('connectionError'));

    } finally {
        if (connCloseFlag) {
            dbConnections.endConnection(client);
            connCloseFlag = false;
        }
    }

}

module.exports = {
    persistParticipantScore
}