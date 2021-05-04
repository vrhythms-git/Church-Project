const _ = require('underscore');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const dbConnections = require(`${__dirname}/dbConnection`);


async function persistParticipantAttendance(attData, loggedInUser) {

    let client = await dbConnections.getConnection();
    try {
        console.log('Marking attendance, action is : ' + attData.action + ' and marked by(Proctor) ' + loggedInUser);
        let action = attData.action;
        if (action === 'save') {
            console.log('Total participants to mark : ' + attData.attendance.length)
            for (let participant of attData.attendance) {

                let markAttQuery = `update t_participant_event_reg_cat set has_attended = ${participant.hasAttended}
                                        where user_id = ${participant.participantId} 
                                        and event_category_id = ${attData.category}
                                        and event_participant_registration_id = ${participant.eventPartRegId}`

                await client.query(markAttQuery);
                console.log(`Participant ${participant.hasAttended == true ? 'present' : 'absent'} for reg. id ${participant.eventPartRegId}`);
            }

        } 
         if (action === 'submit') {

            let markAttSubmitted = `update t_event_category_map set is_attendance_submitted = true 
                                          where event_category_id = ${attData.category} 
                                          and event_id= ${attData.eventId} ;`

            await client.query(markAttSubmitted);
            console.log(`Marked ${attData.eventId} event's ${attData.category} category as submitted!`);
            console.log(`calling persistParticipantAttendance() again to persist attendance marking.`);
            attData.action = 'save';
            persistParticipantAttendance(attData, loggedInUser);
        }

        return { 
            data : {
                status : 'success'
            }
        }

    } catch (error) {
        console.error(`reqAttendanceOperations.js::persistParticipantAttendance() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    } finally {
        client.release();
    }
}

module.exports = {
    persistParticipantAttendance
}