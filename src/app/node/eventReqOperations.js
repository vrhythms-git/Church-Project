const { Client, Pool } = require('pg');
const _ = require('underscore');
const firebase = require('firebase');
const firebaseConfig = require('./firebase/firebaseAdminUtils');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const { json } = require('express');
const dbConnections = require(`${__dirname}/dbConnection`);




async function updateEvent(eventsData) {


    let client = dbConnections.getConnection();
    // console.log("User Data" + JSON.stringify(eventsData));
    await client.connect();
    try {
        await client.query("BEGIN");
        try {
            //   let eventId = 0;
            //  console.log("1");
            /********************** t_event*******************************************************************************************/
            const updateEvent = `UPDATE t_event
            SET "name"=$1, event_type=$2, description=$3, start_date=$4, end_date=$5,
                 registration_start_date=$6, registration_end_date=$7, updated_by=$8, updated_date=$9, org_id=$10
            WHERE event_id = $11;`
            const updateEventValues = [
                eventsData.name,
                eventsData.eventType,
                eventsData.description,
                eventsData.startDate,
                eventsData.endDate,
                eventsData.registrationStartDate,
                eventsData.registrationEndDate,
                eventsData.updatedBy,
                new Date().toUTCString(),
                eventsData.orgId,
                eventsData.eventId
            ];
            await client.query(updateEvent, updateEventValues);
            /********************** t_event_venue************************************************************************************/
            let existingVenue = [];
            let newlyAddedVenue = [];
            for (let venue of eventsData.venues) {
                if (venue.eventVenueID) {
                    if (existingVenue.indexOf(venue.eventVenueID) < 0)
                        existingVenue.push(venue.eventVenueID)
                } else {
                    newlyAddedVenue.push(venue.eventVenueID)
                }
            }

            //Delete existing venus which are not included in currunt request(i.e deleted)
            if (existingVenue.length > 0) {
                let existingVenueString = existingVenue.join(',');
                console.log('Deleting venus from t_event_venue table excet :' + existingVenueString);
                let deleteVenueQuery = `UPDATE t_event_venue SET is_deleted = true where event_venue_id not in (${existingVenueString});`
                await client.query(deleteVenueQuery);
            }
            //Insert new venus 
            if (newlyAddedVenue.length > 0) {
                for (let venue of eventsData.venues) {
                    let insertNewVenus = `INSERT INTO t_event_venue (event_id, venue_id, proctor_id, is_deleted)
                                                VALUES($1, $2, $3, $4);`;
                    let insertNewVenusValues = [
                        eventsData.eventId,
                        venue.venueId,
                        venue.proctorId,
                        false
                    ];
                    await client.query(insertNewVenus, insertNewVenusValues);
                }
            }

            /********************** t_event_category_map************************************************************************************/
            // let existingEventCatMap = [];
            // let newlyAddedEventCatMap = [];
            // for (let eveCatMap of eventsData.categories) {
            //     if (venue.eventVenueID) {
            //         if (existingVenue.indexOf(venue.eventVenueID) < 0)
            //             existingVenue.push(venue.eventVenueID)
            //     } else {
            //         newlyAddedVenue.push(venue.eventVenueID)
            //     }
            // }

            for (let eveCatMap of eventsData.categories) {

                // to update t_event_category_map table mapping.
                let updateEveCatMapping = `UPDATE t_event_category_map
                                            SET event_id=$1, event_category_id=$2, venue_id=$3
                                            WHERE event_cat_map_id = $4`;

                let updateEveCatMappingValues = [
                    eventsData.eventId,
                    eveCatMap.eventCategoryID,
                    eveCatMap.venueId,
                    eveCatMap.eventCatMapId
                ];
                await client.query(updateEveCatMapping, updateEveCatMappingValues);

                //To update t_event_cat_staff_map table mapping
                let updateEveCatStaffMapping = `UPDATE t_event_cat_staff_map
                                               SET event_id=$1, event_category_id=$2, user_id=$3, role_type=$4,
                                               is_deleted=$5, updated_by=$6, updated_date=$7
                                               WHERE event_cat_staff_map_id=$8;`

                // Judge 1 row                             
                let updateEveCatStaffMappingValues = [eventsData.eventId, eveCatMap.eventCategoryID,
                eveCatMap.judge1, 'Judge', false, eventsData.updatedBy,
                new Date().toUTCString(), eveCatMap.eventCatStaffMapId1]

                await client.query(updateEveCatStaffMapping, updateEveCatStaffMappingValues);

                // Judge 2 row
                updateEveCatStaffMappingValues = [eventsData.eventId, eveCatMap.eventCategoryID,
                eveCatMap.judge2, 'Judge', false, eventsData.updatedBy,
                new Date().toUTCString(), eveCatMap.eventCatStaffMapId2]

                await client.query(updateEveCatStaffMapping, updateEveCatStaffMappingValues);

                // Judge 3 row
                updateEveCatStaffMappingValues = [eventsData.eventId, eveCatMap.eventCategoryID,
                eveCatMap.judge3, 'Judge', false, eventsData.updatedBy,
                new Date().toUTCString(), eveCatMap.eventCatStaffMapId3]

                await client.query(updateEveCatStaffMapping, updateEveCatStaffMappingValues);


            }

            /********************** t_event_questionnaire ************************************************************************************/

            let existingQue = [];
            let newlyAddedQue = [];
            for (let question of eventsData.questionnaire) {
                if (question.questionId) {
                    if (existingQue.indexOf(question.questionId) < 0)
                        existingVenue.push(question.questionId)
                } else {
                    newlyAddedQue.push(question.questionId)
                }
            }


            //Delete existing questions 
            if (existingQue.length > 0) {
                let existingQueIdenueString = existingQue.join(',');
                console.log('Deleting venus from t_event_questionnaire table excet :' + existingQueIdenueString);
                let deleteQueQuery = `UPDATE t_event_questionnaire SET 
                                         is_deleted = true, updated_by = ${eventsData.updatedBy},
                                         updated_date='${new Date().toUTCString()}' 
                                         where question_id not in (${existingQueIdenueString});`
                await client.query(deleteQueQuery);
            }
            //Insert new questions 
            if (newlyAddedQue.length > 0) {
                for (let question of eventsData.questionnaire) {
                    let insertNewQue = `INSERT INTO t_event_questionnaire
                    (event_id, question, answer_type, is_deleted, created_by, created_date)
                    VALUES($1, $2, $3, $4, $5, $6);`;

                    let insertNewQues = [
                        question.questionId,
                        question.responseType,
                        eventsData.updatedBy,
                        new Date().toUTCString()
                    ];
                    await client.query(insertNewQue, insertNewQues);
                }
            }

            client.end()
            console.log("Before commit");
            await client.query("COMMIT");

            return ({
                data: {
                    status: 'success'
                }
            })

        }
        catch (err) {
            await client.query("ROLLBACK");
            console.error(`eventReqOperations.js::UpdateEvent() --> error : ${JSON.stringify(err)}`)
            console.log("Transaction ROLLBACK called");
            return (errorHandling.handleDBError('transactionError'));
        }
    }
    catch (error) {
        console.error(`reqOperations.js::insertevents() --> error : ${JSON.stringify(err)}`);
        return (errorHandling.handleDBError('transactionError'));
    }
}

async function getVenues(venueData) {

    let client = dbConnections.getConnection();
    await client.connect();
    try {

        let condition = ''
        if (venueData.parishIds.length != 0) {
            let venueString = venueData.parishIds.join(',');
            condition = ` and to2.org_id in (${venueString})  `;
        }

        let getVenuesQuery = `select jsonb_build_object( 'venueId' , tv.venue_id, 'venueName', tv."name") as res_row
                            from t_organization to2 , t_venue tv 
                            where parent_org_id = ${venueData.regionId} 
                            ${condition} and tv.org_id = to2.org_id;`;

        let res = await client.query(getVenuesQuery);
        let consolidatedData = [];
        if (res && res.rowCount > 0) {
            for (let row of res.rows)
                consolidatedData.push(row.res_row);
        }

        return ({
            data: {
                status: 'success',
                venueList: consolidatedData
            }
        })

    } catch (error) {
        client.end();
        console.error(`eventReqOperations.js::getVenues() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    }

}

module.exports = {
    updateEvent,
    getVenues
}