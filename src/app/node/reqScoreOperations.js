const { Client, Pool } = require('pg');
const _ = require('underscore');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const { json } = require('express');
const dbConnections = require(`${__dirname}/dbConnection`);

async function persistParticipantScore(userScoreData, userId) {
   
    let client = dbConnections.getConnection();
    client.connect();
    try {
        console.log('Judge to ' + userId + ' ' + userScoreData.action + ' ' + userScoreData.scoreData.length + ' participants score.');

         client.query('begin;');
        //Populating user t_participant_event_score;
        console.log('Action is : ' + userScoreData.action + ' no. of participant\'s score to update : ' + userScoreData.scoreData.length)
        if (userScoreData.action == 'save') {
            const instScrQry = `INSERT INTO t_participant_event_score
                                (participant_event_reg_cat_id, event_cat_staff_map_id, score, created_by, is_deleted, created_date )
                            VALUES($1, $2, $3, $4, $5, $6) returning participant_event_score_id; `;

            const updateScrQry = `update t_participant_event_score set score=$1, updated_by=$2, updated_date=$3
                                  where participant_event_score_id=$4`;

            //for(let participantScore of userScoreData.scoreData){
            for (let i = 0; i < userScoreData.scoreData.length; i++) {

                let paricipant = userScoreData.scoreData[i];
                // console.log('Processing: ' + JSON.stringify(paricipant))
                // console.log('scoreRefId: ' + paricipant.scoreRefId)
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
                     await client.query(instScrQry, instScrQryValue)//, (err, res) => {
                    //     if (err) {
                    //         console.log('reqScoreOperations.js::persistParticipantScore() error -->  ' + err)
                    //         return (errorHandling.handleDBError('connectionError'));
                    //     }
                    // })
                    //console.log('New score has been inserted in t_participant_event_score! by : ' + userId + ' for event score id : ' + result.rows[0].participant_event_score_id)
                } else {
                    console.log('scoreRefId is ' + paricipant.scoreRefId + ' so updating the record.')
                    let updateScrQryValue = [
                        paricipant.score,
                        userId,
                        new Date().toUTCString(),
                        paricipant.scoreRefId
                    ];
                    await client.query(updateScrQry, updateScrQryValue)//, (err, res) => {
                    //     if (err) {
                    //         console.log('Error occured while updating score for scoreRefId :' + paricipant.scoreRefId + ' as :' + err)
                    //         return (errorHandling.handleDBError('connectionError'));
                    //     } else {
                    //         // console.log(paricipant.scoreRefId + ' participant_event_score_id updated! by :' + userId);
                    //     }
                    // });

                }

            }

             client.query(`commit;`);
         //   client.end();
          
        }

        if (userScoreData.action == 'complete') {

            let paricipant = userScoreData.scoreData[0];
            let updateSubmittedStatus = `update t_event_cat_staff_map set is_score_submitted = true
                                         where event_cat_staff_map_id = ${paricipant.catStaffMapId};`;
            //await client.connect();
       // let isErr = false;

        // try{
             let result = await client.query(updateSubmittedStatus);
                      console.log(`Updated is_score_submitted for event_cat_staff_map_id: ${paricipant.catStaffMapId}`)
                     userScoreData.action = 'save';
                     console.log('Calling same function(persistParticipantScore) to save all complete action data.');
                     persistParticipantScore(userScoreData, userId)

                     client.query(`commit;`);
                    

        // }catch(error){
        //     client.close();
        //     return (errorHandling.handleDBError('connectionError'));
        // }
          // (err, res) => {
            //     if (err) {
            //         console.log(`Error while is_score_submitted flag as: ${err}`);
            //         isErr = true;
            //         //throw new Error(err);//
            //         return (errorHandling.handleDBError('connectionError'));
            //     } else {
            //         console.log(`Updated is_score_submitted for event_cat_staff_map_id: ${paricipant.catStaffMapId} and event_category_map_id: ${paricipant.categoryId}`)
            //         userScoreData.action = 'save';
            //         persistParticipantScore(userScoreData, userId)
            //         console.log('Calling same function(persistParticipantScore) to save all complete action data.');
            //     }

            // });
            //console.log('isEr is :' + result)
            //if(isErr==true)
           // return  
        }

        return {
            data: {
                status: 'success'
            }
        }

    } catch (error) {
        //   await client.connect();
      //   await client.query(`rollback;`);
        //client.end();
        console.error(`reqScoreOperations.js::persistParticipantScore() : ${error}`);
        return (errorHandling.handleDBError('connectionError'));

    } finally {
        //client.end();
      }

}

module.exports = {
    persistParticipantScore
}