const { Client, Pool } = require('pg');
const _ = require('underscore');
const firebase = require('firebase');
const firebaseConfig = require('./firebase/firebaseAdminUtils');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const { json } = require('express');
const dbConnections = require(`${__dirname}/dbConnection`);


async function getEventById(eventId) {

    console.log('getEventById called, Fetching event data for : ' + eventId);

    
    let event = {};
  //  return new Promise((resolve, reject) => {
        
        try {
            let client = dbConnections.getConnection();        
            await client.connect();
              
            //client.query("BEGIN");
            try {
                let venues = [];
                let categories = [];
                let questionnaire = [];
                let orgIds = [];
                let eventCategoryId = 0;
                let eventVenueId = 0;

                // console.log("1");
                /********************** v_event*******************************************************************************************/
                const eventQuery = `select distinct event_id, event_type, event_name, event_desciption, registration_start_date, registration_end_date, event_start_date,
                                event_end_date, org_type, org_id, org_name, 
                                event_venue_id, venue_id, event_venue_name, proctor_id,
                                event_category_id, category_name, category_type, school_grade_from, school_grade_to,
                                event_category_id, event_cat_staff_map_id, judge_id,
                                question_id, question, question_response_id , answer_type , answer 
                                from v_event  where is_deleted = false and event_id = ${eventId}
                                order by event_category_id,venue_id  ;`

                let result = await client.query(eventQuery,);

                //console.log("2");

                if (result && result.rowCount > 0) {
                    //console.log("Event name == ", result.rows[0].event_name)
                    event.eventId = result.rows[0].event_id;
                    event.name = result.rows[0].event_name;
                    event.description = result.rows[0].event_desciption;
                    event.eventType = result.rows[0].event_type;
                    event.registrationStartDate = result.rows[0].registration_start_date;
                    event.registrationEndDate = result.rows[0].registration_end_date;
                    event.startDate = result.rows[0].event_start_date;
                    event.endDate = result.rows[0].event_end_date;
                    event.orgType = result.rows[0].org_type;

                    let category = {};
                    let venue = {};
                    let judges = [];
                    let venueId = [];
                    let question = {};


                    for (let row of result.rows) {

                        // Get list of org ids
                        //console.log("Org id===", row.org_id);
                        if (row.org_id != null) {
                            //     console.log("2.1");
                            if (orgIds.indexOf(row.org_id) < 0)
                                orgIds.push(row.org_id)
                        }


                        //Get list of venues
                        if (row.venue_id != null) {

                            if (eventVenueId == 0) {
                                eventVenueId = row.event_venue_id;
                            } else if (row.event_venue_id != eventVenueId) {

                                if (_.findWhere(venues, venue) == null) {
                                    //  console.log("Adding venue to array ===", JSON.stringify(venue));
                                    venues.push(venue);
                                }
                                venue = {};
                            }

                            // console.log("4");

                            venue.venueId = row.venue_id;
                            venue.eventVenueId = row.event_venue_id;
                            venue.event_venue_id = row.event_venue_id;
                            venue.proctorId = row.proctor_id;
                            //venue.name = row.event_venue_name;


                        }

                        // console.log("5");


                        // Get categories
                        if (eventCategoryId == 0) {
                            eventCategoryId = row.event_category_id;
                            //console.log("6 " , eventCategoryId);                    

                        } else if (row.event_category_id != eventCategoryId) {
                            eventCategoryId = row.event_category_id;

                            // Add Venue and judges to category and add categry to categories array
                            category.venueId = venueId;
                            category.judges = judges;

                            if (_.findWhere(categories, category) == null) {
                                categories.push(category);
                            }

                            category = {};
                            venueId = [];
                            judges = [];
                        }

                        category.eventCategoryID = eventCategoryId;
                        category.eventCatMapId = row.event_cat_map_id;
                        category.name = row.category_name;
                        category.schoolGradeFrom = row.school_grade_from;
                        category.schoolGradeTo = row.school_grade_to;

                        if (row.venue_id != null) {
                            // console.log("6.2", row.venue_id);
                            if (venueId.indexOf(row.venue_id) < 0)
                                venueId.push(row.venue_id)
                        }

                        if (row.judge_id != null) {
                            //console.log("6.3", row.judge_id);
                            if (judges.indexOf(row.judge_id) < 0)
                                judges.push(row.judge_id)
                        }

                        //Get list of questions
                        //console.log("7");

                        if (row.question_id != null) {
                            //  console.log("7.1");

                            question.questionId = row.question_id;
                            question.question = row.question;
                            question.answerType = row.answer_type;
                            question.questionResponseId = row.questio_response_id;
                            question.answer = row.answer;

                            if (_.findWhere(questionnaire, question) == null) {
                                questionnaire.push(question);
                            }
                        }

                    } // End of for loop

                    //console.log("8");


                    // Processing for the last row
                    if (_.findWhere(venues, venue) == null) {
                        // console.log("venue" + JSON.stringify(venue));
                        venues.push(venue);
                    }

                    //console.log("9");


                    if (_.findWhere(questionnaire, question) == null) {
                        questionnaire.push(question);
                    }


                    //console.log("10");

                    // For last row add venue and judges to category
                    category.venueId = venueId;
                    category.judges = judges;

                    if (_.findWhere(categories, category) == null) {
                        categories.push(category);
                    }

                    //console.log("11");


                    event.orgId = orgIds;
                    event.venues = venues;
                    event.categories = categories;
                    event.questionnaire = questionnaire;


                    // console.log("12");

                    console.log(`Stringified JSON is : ` + JSON.stringify(event))
              
                     
    
                }
                client.end()

                return({
                    data: {
                        status: 'success',
                        eventData: event
                    }
                })
              
                //console.log(`Stringified JSON is : ` + JSON.stringify(event))

                // console.log(JSON.stringify(event));

            } catch (err) {
               // client.query("ROLLBACK");
                console.error(`reqOperations.js::insertevents() inner try block --> error : ${err}`)
                console.log("Transaction ROLLBACK called");
                return(errorHandling.handleDBError('transactionError'));
            } finally {
                //console.log('Finally block executed.. Connection closed.')
               // client.close();
            }
        }
        catch (error) {
            console.error(`reqOperations.js::insertevents() --> outer try block : ${error}`);
            return(errorHandling.handleDBError('connectionError'));
        } finally {
            // console.log('Finally block executed.. Connection closed.')
          //  client.close()
        }
   // });
}

module.exports = {
    getEventById
}