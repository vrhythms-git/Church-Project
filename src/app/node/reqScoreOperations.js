const { Client, Pool } = require('pg');
const _ = require('underscore');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const { json } = require('express');
const dbConnections = require(`${__dirname}/dbConnection`);

async function persistParticipantScore(userScoreData, userId) {
    console.log('Judge ' + userId + ' ' + userScoreData.action + ' ' + userScoreData.scoreData.length + ' participants score.');

    let client = dbConnections.getConnection();
    try {
        await client.connect();
        await client.query('begin;');
        //Populating user t_participant_event_score;
        console.log('Action is : ' + userScoreData.action + ' userScoreData.scoreData.length : ' + userScoreData.scoreData.length)
        if (userScoreData.action == 'save') {
            const instScrQry = `INSERT INTO t_participant_event_score
                                (participant_event_reg_cat_id, event_cat_staff_map_id, score, created_by, is_deleted, created_date )
                            VALUES($1, $2, $3, $4, $5, $6) returning participant_event_score_id; `;

            const updateScrQry = `update t_participant_event_score set score=$1, updated_by=$2, updated_date=$3
                                  where participant_event_score_id=$4`;

            //for(let participantScore of userScoreData.scoreData){
            for (let i = 0; i < userScoreData.scoreData.length; i++) {

                let paricipant = userScoreData.scoreData[i];
                console.log('Processing: ' + JSON.stringify(paricipant))
                console.log('scoreRefId: ' + paricipant.scoreRefId)
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
                    let result = await client.query(instScrQry, instScrQryValue)
                    console.log('New score has been inserted in t_participant_event_score! by : ' + userId + ' for event score id : ' + result.rows[0].participant_event_score_id)
                } else {
                    console.log('scoreRefId is ' + paricipant.scoreRefId + ' so insterting the record.')
                    let updateScrQryValue = [
                        paricipant.score,
                        userId,
                        new Date().toUTCString(),
                        paricipant.scoreRefId
                    ];
                    await client.query(updateScrQry, updateScrQryValue, (err, res) => {
                        if (err) {
                            console.log('Error occured while updating score for scoreRefId :' + paricipant.scoreRefId + ' as :' + err)
                            return (errorHandling.handleDBError('connectionError'));
                        } else {
                            console.log(paricipant.scoreRefId + ' participant_event_score_id updated! by :' + userId);
                        }
                    });

                }

            }

            await client.query(`commit;`);

            return {
                data: {
                    status: 'success'
                }
            }
        }

    } catch (error) {
        await client.connect();
        await client.query(`rollback;`);
        console.error(`eventReqOperations.js::getParticipant() : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    } finally {
        // console.log('Rollback called!')
        client.end();
    }

}

module.exports = {
    persistParticipantScore
}