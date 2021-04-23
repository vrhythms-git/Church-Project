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

        let orgId = [];
        orgId = venueData.orgId.join(',');
        console.log("orgId", orgId);


        let getVenuesQuery = `select jsonb_build_object( 'venueId' , tv.venue_id, 
                             'venueName', tv."name") as res_row
                              from t_organization to2 , t_venue tv 
                              where tv.org_id = to2.org_id and to2.org_id in
                            (        
	                            with recursive child_orgs as (
	                            select parent_org.org_id org_id
	                            from t_organization parent_org
	                            where org_id in (${orgId}) 
	                            and org_type = '${venueData.orgType}' 
	                            union
	                            select child_org.org_id child_id
	                            from t_organization child_org
	                            inner join child_orgs c on c.org_id = child_org.parent_org_id
	                        )   select org_id from child_orgs
                        );`;

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
            if (eventsData != null) {
                let eventId = 0;
                console.log("1");
                /********************** t_event*******************************************************************************************/
                const insertevent = `INSERT INTO public.t_event(name, event_type, description, start_date, end_date, registration_start_date, registration_end_date, event_url) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning event_id;`
                const insertevent_values = [
                    eventsData.name,
                    eventsData.eventType,
                    eventsData.description,
                    eventsData.startDate,
                    eventsData.endDate,
                    eventsData.registrationStartDate,
                    eventsData.registrationEndDate,
                    eventsData.eventUrl
                ];
                console.log("insertevent_values", insertevent_values);
                let result = await client.query(insertevent, insertevent_values);
                this.eventId = result.rows[0].event_id;
                console.log("event id" + this.eventId);



                if (eventsData.orgId != null) {
                    for (let org of eventsData.orgId) {
                        console.log("org", org);
                        const insertOrgTypeData = `INSERT INTO t_event_organization(event_id, org_type, org_id) VALUES($1, $2, $3);`
                        insertOrgTypeDataValues = [
                            this.eventId,
                            eventsData.orgType,
                            org
                        ];
                        console.log("insertOrgTypeDataValues", insertOrgTypeDataValues);
                        await client.query(insertOrgTypeData, insertOrgTypeDataValues);
                    }
                }




                /********************** t_event_venue************************************************************************************/
                console.log("2");
                const insertVenue = `INSERT INTO t_event_venue(event_id, venue_id, proctor_id)
                    VALUES ($1, $2, $3);`


                if (eventsData.venues != null) {
                    for (let venue of eventsData.venues) {
                        //t_event_venue 
                        console.log(`Inserting venue ${JSON.stringify(venue)}`);

                        insertVenue_value =
                            [
                                this.eventId,
                                venue.venueId,
                                venue.proctorId
                            ]
                        if (venue.venueId != "") {
                            await client.query(insertVenue, insertVenue_value);
                        }
                    }
                }


                /********************** t_event_category_map,   t_event_cat_staff_map*******************************************************************************/
                console.log("3");

                if (eventsData.categories != null) {
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

                        for (let venue of category.venueId) {
                            console.log("venue", venue);
                            const eventCatVenueMap = `INSERT INTO t_event_category_venue_map(event_cat_map_id, event_venue_id) VALUES ($1, $2);`
                            eventCatVenueMapValues = [
                                this.eventCategoryID,
                                venue
                            ]
                            await client.query(eventCatVenueMap, eventCatVenueMapValues);
                        }


                        for (let judge of category.judges) {

                            const insertCatUserMap = `INSERT INTO  t_event_cat_staff_map(event_id, event_category_map_id, role_type, user_id)
                                                       VALUES ($1, $2, $3, $4);`

                            insertCatUserMap_values = [
                                this.eventId,
                                this.eventCategoryID,
                                'Judge',
                                judge
                            ]

                            console.log("insertCatUserMap_values", insertCatUserMap_values);
                            await client.query(insertCatUserMap, insertCatUserMap_values);

                        }

                    }
                }

                console.log("6");

                const insertQuestionare = `INSERT INTO t_event_questionnaire(event_id, question, answer_type)
                    VALUES ($1, $2, $3);`


                if (eventsData.questionnaire != null) {
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
                }

                await client.query("COMMIT");
                console.log("After commit");
                client.end();
                return ({
                    data: {
                        status: 'success'
                    }
                })
            }

        }
        catch (err) {
            client.connect()
            await client.query("ROLLBACK");
            console.error(`reqOperations.js::insertevents() --> error : ${JSON.stringify(err)}`)
            console.log("Transaction ROLLBACK called");
            client.end();
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
            order by region_id, parish_name;`
        let res = await client.query(getRegionAndParish);
        if (res && res.rowCount > 0) {
            regionId = null;
            parishes = [];
            region = {};
            for (let row of res.rows) {



                if (regionId != row.region_id) {

                    console.log("row.region_id", row.region_id);



                    if (regionId != null) {
                        console.log("regionId", regionId);

                        region.parishes = parishes;
                        regions.push(region);
                    }

                    region = {};
                    //parishs = {};
                    parishes = [];

                    region.regionName = row.region_name;
                    region.regionId = row.region_id;
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
        client.end();
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

async function getEventType() {

    let client = dbConnections.getConnection();
    await client.connect();
    try {
        let metadata = {};
        let eventType = [];

        let getEventType = `select tet.name event_type, tet.is_venue_required, tet.is_proctor_required, tet.is_judge_required, 
        tec.event_category_id, tec.name event_category_name, tec.school_grade_from, tec.school_grade_to , tet.is_school_grade_required
        from t_event_type tet , t_event_category tec 
        where tet.is_deleted = false 
        and tec.event_type_id = tet.event_type_id ;`
        let res = await client.query(getEventType);

        if (res && res.rowCount > 0) {
            type = null;
            eventName = [];
            eventTypes = {};

            for (let row of res.rows) {

                if (type != row.event_type) {

                    if (type != null) {
                        eventTypes.eventName = eventName;
                        eventType.push(eventTypes);

                    }
                    eventTypes = {};
                    eventName = [];
                    eventTypes.eventType = row.event_type;
                    eventTypes.isVenueRequired = row.is_venue_required;
                    eventTypes.isProctorRequired = row.is_proctor_required;
                    eventTypes.isJudgeRequired = row.is_judge_required;
                    eventTypes.isSchoolGradeRequired = row.is_school_grade_required;
                    type = row.event_type;

                }

                eventNames = {};
                eventNames.id = row.event_category_id;
                eventNames.name = row.event_category_name;
                eventNames.description = row.description;
                eventNames.schoolGradeFrom = row.school_grade_from;
                eventNames.schoolGradeTo = row.school_grade_to;
                eventName.push(eventNames);
            }
            eventTypes.eventName = eventName;
            eventType.push(eventTypes);
        }

        metadata.eventType = eventType;
        client.end();
        return ({
            data: {
                status: 'success',
                metaData: metadata
            }
        })

    } catch (error) {
        client.end();
        console.error(`reqOperations.js::getEventType() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    }
}

async function getProctorData(userData) {

    let client = dbConnections.getConnection();
    await client.connect();
    try {
        let metadata = {};
        console.log("userData", JSON.stringify(userData));
        let rolesData = [];

        var roles = "'" + userData.rolesData.join("','") + "'";

        let getProctorData = `select distinct user_id, concat(first_name ,' ', last_name) as name 
        from v_user 
        where role_name  in (${roles});`

        let res = await client.query(getProctorData);
        if (res && res.rowCount > 0) {

            let proctorData = [];
            for (let row of res.rows) {
                let proctor = {};
                proctor.userId = row.user_id;
                proctor.name = row.name;
                proctorData.push(proctor);
            }
            metadata.proctorData = proctorData;
        }
        client.end();
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






async function getEventQuestionnaireData() {
    let client = dbConnections.getConnection();
    await client.connect();
    try {
        let metadata = {};
        let getEventQuestionnaireData = `select * from t_event_questionnaire`;
        let res = await client.query(getEventQuestionnaireData);
        if (res && res.rowCount > 0) {
            console.log("In Question response : " + res);
            let questionData = [];
            for (let row of res.rows) {
                let questions = {};
                questions.questionId = row.question_id;
                questions.eventId = row.event_id;
                questions.question = row.question;
                questions.answerType = row.answer_type;
                questionData.push(questions);
            }
            metadata.questionData = questionData;
            client.end();
        }
        return ({
            data: {
                status: 'success',
                metaData: metadata
            }
        })

    } catch (error) {
        client.end();
        console.log(`reqOperations.js::getEventQuestionnaireData() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    }
}
/*............get all Events from db for registration purpose........*/
async function getEventForRegistration() {
    let client = dbConnections.getConnection();
    await client.connect();
    try {
        let metadata = {};
        let getEventForRegistration = `select distinct  event_id, event_name, event_type, event_desciption, event_start_date, event_end_date from v_event ve where 
                                            ve.registration_start_date <= current_date
                                        and  ve.registration_end_date >= current_date
                                        and ve.is_deleted = false;`;
        let res = await client.query(getEventForRegistration);
        if (res && res.rowCount > 0) {
            console.log("In Event response : " + res);
            let eventData = [];
            for (let row of res.rows) {
                let events = {};
                events.event_Id = row.event_id;
                events.name = row.event_name;
                events.event_type = row.event_type;
                events.description = row.event_desciption;
                events.startDate = row.event_start_date;
                events.endDate = row.event_end_date;
                events.registrationStartDate = row.registration_start_date;
                events.registrationEndDate = row.registration_end_date;
                events.orgId = row.org_id;
                eventData.push(events);
            }
            metadata.eventData = eventData;
        }
        client.end();
        return ({
            data: {
                status: 'success',
                metaData: metadata

            }
        })

    } catch (error) {
        client.end();
        console.log(`reqOperations.js::getEventForRegistration() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    }
}



module.exports = {
    updateEvent,
    getVenues,
    getProctorData,
    insertEvents,
    getRegionAndParish,
    getProctorData,
    getEventType,
    getEventQuestionnaireData,
    getEventForRegistration
}