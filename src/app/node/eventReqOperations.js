const { Client, Pool } = require('pg');
const _ = require('underscore');
const firebase = require('firebase');
const firebaseConfig = require('./firebase/firebaseAdminUtils');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const dbConnections = require(`${__dirname}/dbConnection`);




async function updateEvent(eventsData) {


    let client = dbConnections.getConnection();
  // console.log("User Data" + JSON.stringify(eventsData));
    await client.connect();
    try {
        await client.query("BEGIN");
        try {
            let eventId = 0;
          //  console.log("1");
            /********************** t_event*******************************************************************************************/
            const insertevent = `INSERT INTO public.t_event(name, event_type, description, org_id, start_date, end_date, registration_start_date, registration_end_date) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning event_id;`
            const insertevent_values = [
                eventsData.name,
                eventsData.eventType,
                eventsData.description,
                eventsData.orgId,
                eventsData.startDate,
                eventsData.endDate,
                eventsData.registrationStartDate,
                eventsData.registrationEndDate,
            ];
            let result = await client.query(insertevent, insertevent_values);
            this.eventId = result.rows[0].event_id;
            console.log("event id" + this.eventId);


            /********************** t_event_venue************************************************************************************/
            console.log("2");
            const insertVenue = `INSERT INTO t_event_venue(event_id, name, description, address_line1, address_line2, city, state, postal_code, country, proctor_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`

            for (let venue of eventsData.venues) {
                //t_event_venue 
                console.log(`Inserting venue ${JSON.stringify(venue)}`)
                insertVenue_value =
                    [
                        this.eventId,
                        venue.name,
                        venue.description,
                        venue.addressLine1,
                        venue.addressLine2,
                        venue.city,
                        venue.state,
                        venue.postalCode,
                        venue.country,
                        venue.proctorId
                    ]
                await client.query(insertVenue, insertVenue_value)
            }



            /********************** t_event_category_map,  t_event_cat_user_map*******************************************************************************/
            console.log("3");
            const insertCategory = `INSERT INTO t_event_category_map(event_id, event_category_id)
                    VALUES ($1, $2);`

            for (let category of eventsData.categories) {
                //t_event_venue 
                console.log(`Inserting category ${JSON.stringify(category)}`);
                insertCategory_value =
                    [
                        this.eventId,
                        category.eventCategoryID
                    ]
                await client.query(insertCategory, insertCategory_value);

                const insertCatUserMap = `INSERT INTO t_event_cat_user_map(event_id, event_category_id, user_id, role_type)
                    VALUES ($1, $2, $4, $3),($1, $2, $5, $3),($1, $2, $6, $3);`

                insertCatUserMap_values = [
                    this.eventId,
                    category.eventCategoryID,
                    'Judge',
                    category.judge1,
                    category.judge2,
                    category.judge3
                ]
                await client.query(insertCatUserMap, insertCatUserMap_values);
            }

            console.log("4");

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

module.exports={
    updateEvent
}