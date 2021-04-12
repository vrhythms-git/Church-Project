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



async function insertEvents(eventsData) {


    let client = dbConnections.getConnection();
    console.log("User Data" + JSON.stringify(eventsData));
    await client.connect();
    try {
        await client.query("BEGIN");
        try {
            let eventId = 0;
            console.log("1");
            /********************** t_event*******************************************************************************************/
            const insertevent = `INSERT INTO public.t_event(name, event_type, description, org_id, start_date, end_date, registration_start_date, registration_end_date) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning event_id;`
            const insertevent_values = [
                eventsData.name,
                eventsData.eventType,
                eventsData.description,
                eventsData.eventRegion,
                eventsData.startDate,
                eventsData.endDate,
                eventsData.registrationStartDate,
                eventsData.registrationEndDate,
            ];
            console.log("insertevent_values", insertevent_values);
            let result = await client.query(insertevent, insertevent_values);
            this.eventId = result.rows[0].event_id;
            console.log("event id" + this.eventId);


            for(let parish of eventsData.parishName){
                console.log("parish", parish);
                const insertParishData = `INSERT INTO t_event_organization(org_type, org_id) VALUES($1, $2);`
                insertParishDataValues = [
                    'Parish',
                     parish
                ];
                await client.query(insertParishData, insertParishDataValues);
            }




            /********************** t_event_venue************************************************************************************/
            console.log("2");
            const insertVenue = `INSERT INTO t_event_venue(event_id, venue_id, proctor_id)
                    VALUES ($1, $2, $3);`

            console.log("eventsData.venues", eventsData.venues);

            for (let venue of eventsData.venues) {
                //t_event_venue 
                console.log(`Inserting venue ${JSON.stringify(venue)}`)
                insertVenue_value =
                    [
                        this.eventId,
                        venue.venueId,
                        venue.proctorId
                    ]
                await client.query(insertVenue, insertVenue_value);
            }


            /********************** t_event_category_map,   t_event_cat_staff_map*******************************************************************************/
            console.log("3");
            console.log("eventsData.categories", eventsData.categories);

            for (let category of eventsData.categories) {

                console.log("4");

                const insertCategory = `INSERT INTO t_event_category_map(event_id, event_category_id)
                VALUES ($1, $2) returning event_cat_map_id;`
                console.log(`Inserting category ${JSON.stringify(category)}`);
                insertCategory_value =
                    [
                        this.eventId,
                        category.eventCategoryID
                    ]
                let result = await client.query(insertCategory, insertCategory_value);
                this.eventCategoryID = result.rows[0].event_cat_map_id;
                //this.venueId = result.rows[0].venue_id;



                
                console.log("5");
                console.log("category.venueId", category.venueId);
                for(let venue of category.venueId){
                    const eventCatVenueMap = `INSERT INTO t_event_category_venue_map(event_cat_map_id, event_venue_id) VALUES ($1, $2);`
                    eventCatVenueMapValues = [
                        this.eventCategoryID,
                        venue
                    ]
                    await client.query(eventCatVenueMap, eventCatVenueMapValues)
                }

               

                console.log("6");
                console.log("category", category);
                const insertCatUserMap = `INSERT INTO  t_event_cat_staff_map(event_id, event_category_id, user_id, role_type)
                    VALUES ($1, $2, $4, $3),($1, $2, $5, $3),($1, $2, $6, $3);`

                insertCatUserMap_values = [
                    this.eventId,
                    this.eventCategoryID,
                    'Judge',
                    category.judge1,
                    category.judge2,
                    category.judge3
                ]

                console.log("insertCatUserMap_values", insertCatUserMap_values);
                await client.query(insertCatUserMap, insertCatUserMap_values);
            }

            console.log("6");

            const insertQuestionare = `INSERT INTO t_event_questionnaire(event_id, question, answer_type)
                    VALUES ($1, $2, $3);`

            for (let question of eventsData.questionnaire) {
                //t_event_venue 
                console.log(`Inserting category ${JSON.stringify(question)}`);
                insertQuestionareValue =
                    [
                        this.eventId,
                        question.question,
                        question.responseType
                    ]
                await client.query(insertQuestionare, insertQuestionareValue);
            }

            //client.end()
            console.log("Before commit");
            await client.query("COMMIT");
            console.log("After commit");

            return ({
                data: {
                    status: 'success'
                }
            })

        }
        catch (err) {
            await client.query("ROLLBACK");
            console.error(`reqOperations.js::insertevents() --> error : ${JSON.stringify(err)}`)
            console.log("Transaction ROLLBACK called");
            return (errorHandling.handleDBError('transactionError'));
        }
    }
    catch (error) {
        console.error(`reqOperations.js::insertevents() --> error : ${JSON.stringify(err)}`);
        return (errorHandling.handleDBError('transactionError'));
    }
}

async function getRegionAndParish() {

    let client = dbConnections.getConnection();
    await client.connect();
    try {
        let metadata = {};
        let regions = [];

        let getRegionAndParish = `select to3.org_id region_id, to3.name region_name, to2.org_id parish_id, to2.name parish_name  
            from t_organization to2, t_organization to3 
            where to2.org_type = 'Parish'
            and to3.org_id = to2.parent_org_id 
            order by region_name, parish_name;`
        let res = await client.query(getRegionAndParish);
        if (res && res.rowCount > 0) {
            console.log("In response" + res);
            regionId = null;
            parishes = [];
            region = {};
            for (let row of res.rows) {

                if (regionId != row.region_id) {
                    region = {};
                    //parishs = {};
                    parishes = [];
                    region.regionName = row.region_name;
                    region.regionId = row.region_id;
                    if (regionId != null) {
                        region.parishes = parishes;
                        regions.push(region);                  
                    }
                    regionId = row.region_id;
                    console.log("regions", regions);
                }

                parish = {};
                parish.parishId = row.parish_id;
                parish.parishName = row.parish_name;
                parishes.push(parish);
            }

            region.parishes = parishes;
            regions.push(region);    

        }

        metadata.regions = regions;

        return ({
            data: {
                status: 'success',
                metaData: metadata
            }
        })

    } catch (error) {
        client.end();
        console.error(`reqOperations.js::getProctorData() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    }
}

async function getProctorData(userData) {

    let client = dbConnections.getConnection();
    await client.connect();
    try {
        let metadata = {};
        console.log("userData", userData);
        let getProctorData = `select user_id, CONCAT(first_name, ' ',last_name) as name from v_user where user_org_id = ${userData};`
        let res = await client.query(getProctorData);
        if (res && res.rowCount > 0) {
            console.log("In response" + res);

            let proctorData = [];
            for (let row of res.rows) {
                let proctor = {};
                proctor.userId = row.user_id;
                proctor.name = row.name;
                proctorData.push(proctor);
            }
            metadata.proctorData = proctorData;
        }

        return ({
            data: {
                status: 'success',
                metaData: metadata
            }
        })

    } catch (error) {
        client.end();
        console.error(`reqOperations.js::getProctorData() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));


    }
}




module.exports = {
    updateEvent,
    getVenues,
    getProctorData,
    insertEvents,
    getRegionAndParish,
    getProctorData
}