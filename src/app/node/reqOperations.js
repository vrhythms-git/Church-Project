const { Client, Pool } = require('pg');
const _ = require('underscore');

const errorHandling = require('./ErrorHandling/commonDBError');
const dbConnections = require(`${__dirname}/dbConnection`);


async function processSignInRequest(userInfo) {

    let client = dbConnections.getConnection();
    console.log("User Data" + JSON.stringify(userInfo));
        try {
            await client.connect();
            await client.query("BEGIN");
            let userId;
            let isFamilyHead;
            console.log("1");
            let newUserInsStmt = `INSERT INTO t_user(
                 email_id, org_id, firebase_id)
               VALUES (          
                      '${userInfo.data.email}',
                      '${userInfo.data.orgId}',
                      '${userInfo.data.fbId}'
               ) returning user_id;`

            let result = await client.query(newUserInsStmt);

            console.log("2",this.userId);
            this.userId = result.rows[0].user_id;
            console.log("2",this.userId);
            this.isFamilyHead = userInfo.data.isFamilyHead;
            console.log("3", this.isFamilyHead);

            /****************************************** t_person******************************************************************************/
            console.log("2");
            let insertPerson = `INSERT INTO t_person(
                user_id, title, first_name, middle_name, last_name, mobile_no)
              VALUES ($1, $2, $3, $4, $5, $6);`

            console.log("2",this.userId);
            insertPersonValues =
                [
                    this.userId,
                    userInfo.data.title,
                    userInfo.data.firstName,
                    userInfo.data.middleName,
                    userInfo.data.lastName,
                    userInfo.data.mobileNo
                ]

                console.log(insertPersonValues);
                console.log("4");

            await client.query(insertPerson, insertPersonValues);

            /**********************************************t_user_role_mapping*********************************************************************************** */

            console.log("3");
            console.log("isfamily head ", this.isFamilyHead);
            if (this.isFamilyHead) {
                console.log("6");
                console.log("this.userId", this.userId);
                let insertRoleMapping = `insert into t_user_role_mapping (user_id, role_id)
                select ${this.userId}, id from t_role where name = 'Family Head';`
                await client.query(insertRoleMapping);
            }
            if (!this.isFamilyHead) {
                console.log("7");
                let insertRoleMappingmember = `insert into t_user_role_mapping (user_id, role_id)
                select ${this.userId}, id from t_role where name = 'Member';`
                await client.query(insertRoleMappingmember);
            }

            console.log("Before commit");
            await client.query("COMMIT");
            console.log("After commit");
            //client.end()

            return({
                data: {
                    status: 'success'
                }
            })

        } 
        catch (error) {
            await client.query("ROLLBACK");
            console.error(`reqOperations.js::processSignInRequest() --> error : ${JSON.stringify(error)}`)
            console.log("Transaction ROLLBACK called");
            return (errorHandling.handleDBError('transactionError'));
        }
    }



async function processGetUserMetaDataRequest(firebaseToken) {

    return new Promise((resolve, reject) => {

        let query = `select user_id,first_name,last_name,email_id,mobile_no, role_name,menu_name,perm_name 
                    from v_user
                    where firebase_id = '${firebaseToken}';`

        let client = dbConnections.getConnection();
        try {
            client.connect();
            client.query(query, (err, res) => {
                if (err) {
                    console.error(`reqOperations.js::processGetUserMetaDataRequest() --> error while fetching results : ${err}`)
                    reject(errorHandling.handleDBError('queryExecutionError'));
                    return;
                }

                client.end()
                if (res) {

                    let metaData = {}
                    let permissions = [];
                    let menus = [];

                    metaData.firstName = res.rows[0].first_name;
                    metaData.userId = res.rows[0].user_id;
                    metaData.lastName = res.rows[0].last_name;
                    metaData.emailId = res.rows[0].email_id;
                    metaData.mobile_no = res.rows[0].mobile_no;
                    metaData.userRole = res.rows[0].role_name;

                    for (let row of res.rows) {

                        if (menus.indexOf(row.menu_name) < 0)
                            menus.push(row.menu_name)
                        if (permissions.indexOf(row.perm_name) < 0) {
                            permissions.push(row.perm_name)
                        }

                    }
                    metaData.permissions = permissions;
                    metaData.menus = menus;


                    resolve({
                        data: {
                            status: 'success',
                            metaData: metaData
                        }
                    })
                }
            });
        } catch (error) {
            console.error(`reqOperations.js::processGetUserMetaDataRequest() --> error executing query as : ${error}`);
            reject(errorHandling.handleDBError('connectionError'));
        }
    });
}


async function getuserRecords() {

    return new Promise((resolve, reject) => {
        let getuserRecords = `select distinct user_id,first_name,middle_name,last_name,dob,mobile_no,email_id,address_line1,address_line2,city,postal_code,country,role_id,org_type,org_id from v_user order by user_id;`
        let client = dbConnections.getConnection();

        try {
            client.connect();
            client.query(getuserRecords, (err, res) => {
                if (err) {
                    console.log("Inside Error" + res);
                    console.error(`reqOperations.js::processSignInRequest() --> error while fetching results : ${err}`)
                    reject(errorHandling.handleDBError('queryExecutionError'));
                    return;
                }
                console.log("Before Client end" + res);
                client.end()
                console.log("After Client end" + res);
                if (res) {

                    console.log("In response" + res);
                    let user = {}
                    let users = [];
                    let roles = [];
                    let userid = 0;

                    for (let row of res.rows) {
                        console.log("Datbase User id" + row.user_id);
                        console.log("User id" + userid);
                        if (userid != row.user_id && userid != 0) {
                            console.log("In Pushing user to users" + row.user_id);
                            user.roles = roles;
                            users.push(user);
                            user = {}
                            roles = []
                            //   userid = row.user_id;
                        }
                        if (userid != row.user_id) {
                            console.log("User id In IF Condition" + row.user_id);

                            user.userId = row.user_id;
                            user.firstName = row.first_name;
                            user.middleNmae = row.middle_name;
                            user.lastName = row.last_name;
                            user.dob = row.dob;
                            user.mobileNo = row.mobile_no;
                            user.emailId = row.email_id;
                            user.addressLine1 = row.address_line1;
                            user.addressLine2 = row.address_line2;
                            user.city = row.city;
                            user.postalCode = row.postal_code;
                            user.country = row.country;
                            // if(userid == 0){
                            //     userid = row.user_id;
                            // }
                            userid = row.user_id;
                        }
                        //console.log("In for" + JSON.stringify(user));
                        let role = {}
                        role.roleId = row.role_id;
                        role.orgType = row.org_type;
                        role.orgId = row.org_id;
                        console.log("In user" + user);
                        console.log("In role" + JSON.stringify(role));
                        console.log("In roles" + JSON.stringify(roles));

                        if (_.findWhere(roles, role) == null) {
                            console.log("role" + JSON.stringify(role));
                            roles.push(role);
                        }

                    }
                    user.roles = roles;
                    users.push(user);
                    console.log("Before Resolve" + res);
                    resolve({
                        data: {
                            status: 'success',
                            metaData: users
                        }
                    })
                }
            });
        } catch (error) {
            console.error(`reqOperations.js::processSignInRequest() --> error executing query as : ${error}`);
            reject(errorHandling.handleDBError('connectionError'));
        }
    });
}

async function getRoleMetadata() {

    return new Promise((resolve, reject) => {
        let getRoles = `select id, name from t_role where is_deleted = 'no' order by name;`
        let getorgs = `select org_type, id, name, level from t_organization where is_deleted = 'no' order by level, org_type, name;`
        let client = dbConnections.getConnection();
        let metadata = {};
        let roles = [];
        let org = {};
        orgs = [];
        details = [];

        try {
            client.connect();
            client.query(getRoles, (err, res) => {
                if (err) {
                    console.log("Inside Error" + res);
                    console.error(`reqOperations.js::processSignInRequest() --> error while fetching results : ${err}`)
                    reject(errorHandling.handleDBError('queryExecutionError'));
                    return;
                }
                //client.end();
                if (res) {
                    for (let row of res.rows) {
                        let role = {}
                        role.id = row.id;
                        role.name = row.name;
                        roles.push(role);
                    }
                    metadata.roles = roles;
                }
                // resolve({
                //     data: {
                //         status: 'success',
                //         metadata: metadata
                //     }
                // })

            });

            // client.connect();
            client.query(getorgs, (err, res) => {
                if (err) {
                    console.log("Inside Error" + res);
                    console.error(`reqOperations.js::processSignInRequest() --> error while fetching results : ${err}`)
                    reject(errorHandling.handleDBError('queryExecutionError'));
                    return;
                }
                client.end();
                if (res) {

                    orgtype = null;

                    for (let row of res.rows) {

                        if (orgtype != row.org_type && orgtype != null) {
                            org.details = details;
                            orgs.push(org);
                            org = {};
                            details = [];
                        }
                        if (orgtype != row.org_type) {
                            org.orgtype = row.org_type;
                            orgtype = row.org_type;
                        }
                        let detail = {};
                        detail.id = row.id;
                        detail.name = row.name;
                        details.push(detail);
                    }
                    org.details = details;
                    orgs.push(org);
                    metadata.orgs = orgs;
                    //metadata.roles = roles;
                }
                resolve({
                    data: {
                        status: 'success',
                        metadata: metadata
                    }
                })
            });

        } catch (error) {
            console.error(`reqOperations.js::processSignInRequest() --> error executing query as : ${error}`);
            reject(errorHandling.handleDBError('connectionError'));
        }
    });
}


async function getEventCategory() {

    return new Promise((resolve, reject) => {
        let getEventCategory = `select id,name,description,school_grade_from,school_grade_to from t_event_category;`
        let client = dbConnections.getConnection();

        try {
            client.connect();
            client.query(getEventCategory, (err, res) => {
                if (err) {
                    console.log("Inside Error" + res);
                    console.error(`reqOperations.js::getEventCategory() --> error while fetching results : ${err}`)
                    reject(errorHandling.handleDBError('queryExecutionError'));
                    return;
                }
                client.end()
                if (res) {
                    console.log("In response" + res);
                    let metadata = {};
                    let eventCategory = [];
                    for (let row of res.rows) {
                        let events = {};
                        events.id = row.id;
                        events.name = row.name;
                        events.description = row.description;
                        events.schoolGradeFrom = row.school_grade_from;
                        events.schoolGradeTo = row.school_grade_to;
                        eventCategory.push(events);
                    }
                    metadata.eventCategory = eventCategory;
                    resolve({
                        data: {
                            status: 'success',
                            metaData: metadata
                        }
                    })
                }
            });
        } catch (error) {
            console.error(`reqOperations.js::processSignInRequest() --> error executing query as : ${error}`);
            reject(errorHandling.handleDBError('connectionError'));
        }
    });
}

async function getParishData() {

    return new Promise((resolve, reject) => {
        let getParishData = `select id, name from t_organization where org_type = 'Parish'`
        let client = dbConnections.getConnection();

        try {
            client.connect();
            client.query(getParishData, (err, res) => {
                if (err) {
                    console.log("Inside Error" + res);
                    console.error(`reqOperations.js::getParishData() --> error while fetching results : ${err}`)
                    reject(errorHandling.handleDBError('queryExecutionError'));
                    return;
                }
                client.end()
                if (res) {
                    console.log("In response" + res);
                    let metadata = {};
                    let Parish = [];
                    for (let row of res.rows) {
                        let data = {};
                        data.id = row.id;
                        data.name = row.name;
                        Parish.push(data);
                    }
                    metadata.Parish = Parish;
                    resolve({
                        data: {
                            status: 'success',
                            metaData: metadata
                        }
                    })
                }
            });
        } catch (error) {
            console.error(`reqOperations.js::processSignInRequest() --> error executing query as : ${error}`);
            reject(errorHandling.handleDBError('connectionError'));
        }
    });
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
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning id;`
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
            this.eventId = result.rows[0].id;
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







async function processUpdateUserRoles(userData) {

    return new Promise((resolve, reject) => {
        let client = dbConnections.getConnection();
        console.log("User Data" + JSON.stringify(userData));
        client.connect();
        //      dbConnections.getCoonectionPool().connect().catch(err => {
        //     console.log("\nclient.connect():", err.name);
        //     for (item in err) {
        //         if (err[item] != undefined)
        //             console.error(`reqOperations.js::processUpdateUserRoles() --> error while fetching results : ${JSON.stringify(err)}`)
        //         reject(errorHandling.handleDBError('queryExecutionError'));
        //         return;
        //     }
        // }).then((client)=>{
        try {
            client.query("BEGIN");
            try {
                console.log("1");
                /********************** t_user************************* */
                const updateUserTbl = `UPDATE public.t_user
                  SET first_name=$1,
                      middle_name=$2, 
                      last_name=$3,
                      mobile_no=$4, 
                      updated_by=$5,
                      updated_date=$6, 
                      address_line1=$7,
                      address_line2=$8, 
                      city=$9, 
                      state=$10, 
                      postal_code=$11, 
                      country=$12,
                      dob=$13
                  WHERE user_id= $14;`;
                console.log("2");
                const updateUserTbl_values = [
                    userData.firstName,
                    userData.middleName,
                    userData.lastName,
                    userData.mobileNo,
                    userData.updatedBy,
                    new Date().toISOString(),
                    userData.addressLine1,
                    userData.addressLine2,
                    userData.city,
                    userData.state,
                    userData.postalCode,
                    userData.country,
                    userData.dob,
                    userData.userId,
                ];



                client.query(updateUserTbl, updateUserTbl_values, function (err, result) {
                    if (err) {
                        client.query("ROLLBACK");
                        console.error(`reqOperations.js::processUpdateUserRoles() --> Error occurred while updating data into t_user table: ${JSON.stringify(err)}`)
                        console.log("Transaction ROLLBACK called");
                        reject(errorHandling.handleDBError('transactionError'))
                    } else {
                        client.query("COMMIT");
                        console.log("reqOperations.js::t_user: Transaction COMMIT row count:", result.rowCount);
                    }
                });

                /**********************Delete -> t_user_role_mapping ************************* */
                const deleteFromRoleMapping = `DELETE FROM public.t_user_role_mapping WHERE user_id='${userData.userId}';`
                client.query(deleteFromRoleMapping, function (err, result) {
                    if (err) {
                        client.query("ROLLBACK");
                        console.error(`reqOperations.js::processUpdateUserRoles() --> Error occurred while deleting datafrom t_user_role_mapping table: ${JSON.stringify(err)}`)
                        console.log("Transaction ROLLBACK called");
                        reject(errorHandling.handleDBError('transactionError'))
                    } else {
                        client.query("COMMIT");
                        console.log("reqOperations.js::t_user_role_mapping: Transaction COMMIT row count:", result.rowCount);
                    }
                });

                /**********************Delete -> t_user_role_context ************************* */
                const deleteFromRoleContext = `DELETE FROM public.t_user_role_context WHERE user_id='${userData.userId}';`
                client.query(deleteFromRoleContext, function (err, result) {
                    if (err) {
                        client.query("ROLLBACK");
                        console.error(`reqOperations.js::processUpdateUserRoles() --> Error occurred while deleting datafrom t_user_role_mapping table: ${JSON.stringify(err)}`)
                        console.log("Transaction ROLLBACK called");
                        reject(errorHandling.handleDBError('transactionError'))
                    } else {
                        client.query("COMMIT");
                        console.log("reqOperations.js::t_user_role_context Transaction COMMIT row count:", result.rowCount);
                    }
                });

                /**********************Insert -> t_user_role_mapping ************************* */

                const insertRoleMapping = `INSERT INTO public.t_user_role_mapping(
                    role_id, user_id, is_deleted)
                    VALUES ($1, $2, $3);`
                const insertRoleContext = `INSERT INTO public.t_user_role_context(
                                                        role_id,
                                                        user_id,
                                                        org_id, 
                                                        is_deleted,
                                                        created_by,
                                                        created_date,
                                                        updated_by, 
                                                        updated_date)
                                                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`

                for (let role of userData.roles) {
                    //t_user_role_context 
                    console.log(`Inserting role ${JSON.stringify(role)} into t_user_role_mapping t_user_role_context and t_user_role_context table.`)
                    insertRoleMapping_value = [role.roleId, userData.userId, false]
                    client.query(insertRoleMapping, insertRoleMapping_value, function (err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            console.error(`reqOperations.js::processUpdateUserRoles() --> Error occurred while inserting data in t_user_role_mapping table: ${JSON.stringify(err)}`)
                            console.log("Transaction ROLLBACK called");
                            reject(errorHandling.handleDBError('transactionError'))
                            return;
                        } else {
                            client.query("COMMIT");
                            console.log("reqOperations.js::processUpdateUserRoles() t_user_role_context Transaction COMMIT row count:", result.rowCount);
                        }
                    });

                    //t_user_role_context
                    console.log("RoleData");
                    insertRoleContext_value = [role.roleId, userData.userId, role.orgId, false, userData.updatedBy, new Date().toISOString(), userData.updatedBy, new Date().toISOString()]
                    console.log(role.roleId, userData.userId, role.orgId, false, userData.updatedBy, new Date().toISOString(), userData.updatedBy, new Date().toISOString());
                    client.query(insertRoleContext, insertRoleContext_value, function (err, result) {
                        if (err) {
                            client.query("ROLLBACK");
                            console.error(`reqOperations.js::processUpdateUserRoles() --> Error occurred while Inserting data in t_user_role_context table: ${err}`)
                            console.log("Transaction ROLLBACK called");
                            reject(errorHandling.handleDBError('transactionError'))
                            return;
                        } else {
                            client.query("COMMIT");
                            console.log("reqOperations.js::processUpdateUserRoles() t_user_role_context Transaction COMMIT row count:", result.rowCount);
                        }
                    });
                }

                resolve({
                    data: {
                        status: 'success'
                    }
                })

            } catch (err) {
                client.query("ROLLBACK");
                console.error(`reqOperations.js::processUpdateUserRoles() --> error : ${JSON.stringify(err)}`)
                console.log("Transaction ROLLBACK called");
                reject(errorHandling.handleDBError('transactionError'))
            }

        } catch (error) {
            console.error(`reqOperations.js::processUpdateUserRoles() --> error : ${JSON.stringify(err)}`)
            reject(errorHandling.handleDBError('transactionError'))
        }
    });
    //  });
}

async function getParishData() {

    return new Promise((resolve, reject) => {
        let getParishData = `select id, name from t_organization where org_type = 'Parish'`
        let client = dbConnections.getConnection();

        try {
            client.connect();
            client.query(getParishData, (err, res) => {
                if (err) {
                    console.log("Inside Error" + res);
                    console.error(`reqOperations.js::getParishData() --> error while fetching results : ${err}`)
                    reject(errorHandling.handleDBError('queryExecutionError'));
                    return;
                }
                client.end()
                if (res) {
                    console.log("In response" + res);
                    let metadata = {};
                    let Parish = [];
                    for (let row of res.rows) {
                        let data = {};
                        data.id = row.id;
                        data.name = row.name;
                        Parish.push(data);
                    }
                    metadata.Parish = Parish;
                    resolve({
                        data: {
                            status: 'success',
                            metaData: metadata
                        }
                    })
                }
            });
        } catch (error) {
            console.error(`reqOperations.js::processSignInRequest() --> error executing query as : ${error}`);
            reject(errorHandling.handleDBError('connectionError'));
        }
    });
}

module.exports = {
    processSignInRequest,
    processGetUserMetaDataRequest,
    getuserRecords,
    processUpdateUserRoles,
    getRoleMetadata,
    getEventCategory,
    getParishData,
    insertEvents
}
