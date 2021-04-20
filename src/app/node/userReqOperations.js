const { Client, Pool } = require('pg');
const _ = require('underscore');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const dbConnections = require(`${__dirname}/dbConnection`);

async function setUserApprovalState(userData) {

    let client = await dbConnections.getConnection();
    await client.connect();
    try {
        if (userData.isApproved == true) {

            try {

                let randomMemId = (Math.random() * (9999999 - 1000000) + 1000000).toFixed(0);

                let upUserTbl = `UPDATE t_user SET is_approved = true where user_id = ${userData.userId} ;`

                await client.query(upUserTbl, (err, res) => {
                    if (err) {
                        console.error(`userReqOperations.js::setUserApprovalState() --> error while updating table t_user: ${err}`)
                        return (errorHandling.handleDBError('queryExecutionError'));
                    }
                    else console.log(upUserTbl + 'Executed successfully.');
                });

                let isMemberIdAlreadyExists = `select count(membership_no) mem_no_count from t_user_parish where membership_no = '${randomMemId}';`

                let flag = true;

                for (let i = 0; i < 10; i++) {
                    await client.query(isMemberIdAlreadyExists, (err, res) => {
                        if (err) {
                            console.error(`userReqOperations.js::setUserApprovalState() --> random member exists?: ${err}`)
                        }
                        if (res) {
                            console.log("is member ID already exists? " + res.rows[i].mem_no_count)
                            if (res.rows[i].mem_no_count == 0) {
                                flag = false;
                                let putRowInParisgTbl = `INSERT INTO PUBLIC.t_user_parish
                            (
                             user_id,
                             membership_no,
                             membership_type,
                             membership_effective_date,
                             created_by,
                             created_date,
                             updated_by,
                             updated_date)
                         VALUES ( $1, $2, $3, $4, $5, $6, $7, $8);`

                                let putRowInParisgTblValues = [userData.userId, randomMemId, 'Guest', new Date().toISOString(), userData.LoggedInuserId, new Date().toISOString(), userData.LoggedInuserId, new Date().toISOString()]

                                client.query(putRowInParisgTbl, putRowInParisgTblValues, (err, res) => {
                                    if (err) {
                                        console.error(`userReqOperations.js::setUserApprovalState() --> error while inserting into table t_user_parish: ${err}`)
                                        return (errorHandling.handleDBError('queryExecutionError'));
                                    }
                                    else console.log(putRowInParisgTbl + 'Executed successfully.');
                                });
                            }
                            else
                                randomMemId = (Math.random() * (9999999 - 1000000) + 1000000).toFixed(0);

                        }
                    });

                    if (flag == true)
                        break;
                }

                let operationTblQuery = `INSERT INTO public.t_user_operation_log
    (user_id, operation_type, performed_by, performed_date) VALUES($1, $2, $3 ,$4);`;

                let operationTblQueryValues = [userData.userId, 'Request Approved', userData.loggedInuserId, new Date().toISOString()]


                await client.query(operationTblQuery, operationTblQueryValues, (err, res) => {
                    if (err) {
                        console.error(`userReqOperations.js::setUserApprovalState() --> error while inserting into table t_user_operation_log: ${err}`)
                        return (errorHandling.handleDBError('queryExecutionError'));
                    }
                    else console.log(operationTblQuery + ' Executed successfully.');
                });

                return {
                    data: {
                        status: 'success'
                    }
                }

            } catch (error) {
                console.error(`userReqOperations.js::setUserApprovalState() --> error executing query as : ${error}`);
                return (errorHandling.handleDBError('connectionError'));
            }

        } else if (userData.isApproved == false) {

            let moveUsrTblRowtoUsrHistyTbl = `insert into t_user_history(
                                            user_id , email_id, org_id, firebase_id, 
                                            title, first_name, middle_name, last_name, 
                                            about_yourself, is_locked, is_deleted, 
                                            is_family_head, created_by, created_date, 
                                            updated_by, updated_date, is_approved, member_type)
                                            select 
                                            user_id , email_id, org_id, firebase_id, 
                                            title, first_name, middle_name, last_name, 
                                            about_yourself, is_locked, is_deleted, 
                                            is_family_head, created_by, created_date, 
                                            updated_by, updated_date, is_approved, member_type
                                            from t_user tu where user_id = ${userData.userId};`

            let deleteFromUsrTbl = `delete from t_user where user_id = ${userData.userId};`;

            let deleteFromPrsonTbl = `delete from t_person where user_id = ${userData.userId};`; 
            
            await client.query(moveUsrTblRowtoUsrHistyTbl);
            console.log('Copied row form t_user to t_user_history table for user id : ' +  userData.userId);
            await client.query(deleteFromUsrTbl);
            console.log('Deleted row from t_user table! for user id : ' + userData.userId);
            await client.query(deleteFromPrsonTbl);
            console.log('deleted row from t_person table for user id : ' + userData.userId);
    
            // let upUserTbl = `UPDATE t_user SET is_approved = false, is_deleted = true where user_id = ${userData.userId} ;`

            // await client.query(upUserTbl, (err, res) => {
            //     if (err) {
            //         console.error(`userReqOperations.js::setUserApprovalState() --> error while updating table t_user: ${err}`)
            //         return (errorHandling.handleDBError('queryExecutionError'));
            //     }
            //     else console.log(upUserTbl + ' Executed successfully.');
            //     //client.end();
            // });


            let operationTblQuery = `INSERT INTO public.t_user_operation_log
    (user_id, operation_type, reason, performed_by, performed_date) VALUES($1, $2, $3 ,$4, $5);`;

            let operationTblQueryValues = [userData.userId, 'Request Rejected', userData.comment, userData.loggedInuserId, new Date().toISOString()]

            await client.query(operationTblQuery, operationTblQueryValues);
            console.log('Inserted row into t_user_operation_log table for user id: ' + userData.userId);

            client.end();
            return {
                data: {
                    status: 'success'
                }
            }

        }

    } catch (error) {
        console.error(`userReqOperations.js::setUserApprovalState() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    }
}

async function updateUnApprovedUser(userData) {
    console.log("userReqOperations.js::updateUnApprovedUser called. Updating unapproved user's data...");

    try{
    let client = dbConnections.getConnection();
    await client.connect();

    let updateUserTableStmt = `UPDATE t_user
                                SET org_id=$1, title=$2, first_name=$3, last_name=$4, about_yourself=$5, 
                                updated_by=$6, updated_date=$7, member_type=$8
                                WHERE user_id=$9;`;

    let updateUserTableValues = [
        userData.orgId,
        userData.title,
        userData.firstName,
        userData.lastName,
        userData.abtyrslf,
        userData.userId,
        new Date().toISOString(),
        userData.memberType,
        userData.userId
    ];
    console.log('t_user updated!');

    await client.query(updateUserTableStmt, updateUserTableValues);


    let updatePersonTableStmt = `UPDATE t_person
                              SET dob=$1, updated_by=$2, updated_date=$3, membership_type=$4
                              WHERE user_id=$5;`;

    let updatePersonTableValues = [
        userData.dob,
        userData.userId,
        new Date().toISOString(),
        userData.memberType,
        userData.userId
    ]

    await client.query(updatePersonTableStmt, updatePersonTableValues);
    console.log('t_person updated!');
    await client.end();

    return {
        data : {
            status:"success"
        }
    }
       
}catch(error){
    console.error(`userReqOperations.js::updateUnApprovedUser() --> error executing query as : ${error}`);
    return (errorHandling.handleDBError('connectionError'));
}
}

module.exports = {
    setUserApprovalState,
    updateUnApprovedUser
}
