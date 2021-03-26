const { Client, Pool } = require('pg');
const _ = require('underscore');
const firebase = require('firebase');
const firebaseConfig = require('./firebase/firebaseAdminUtils');
const errorHandling = require('./ErrorHandling/commonDBError');
const { result } = require('underscore');
const dbConnections = require(`${__dirname}/dbConnection`);



try {
    firebase.initializeApp(firebaseConfig.firebaseConfig)
    console.log('firebase successfully initilized.');
} catch (error) {
    console.log(`Error while initilizing firebase as : ${error}`);
}


async function processSignInRequest(userInfo) {

    let client = dbConnections.getConnection();
    console.log("User Data" + JSON.stringify(userInfo));
    try {
        await client.connect();
        await client.query("BEGIN");
        let userId;
        let isFamilyHead;
        console.log("1");
        if (userInfo.data.memberType != "member") {
            console.log("Not member");
            let newUserInsStmt = `INSERT INTO t_user(
                email_id, org_id, firebase_id, is_approved)
              VALUES (          
                     '${userInfo.data.email}',
                     '${userInfo.data.orgId}',
                     '${userInfo.data.fbId}',
                     true
              ) returning user_id;`
            let result = await client.query(newUserInsStmt);
            console.log("2", this.userId);
            this.userId = result.rows[0].user_id;
            console.log("2", this.userId);
            this.isFamilyHead = userInfo.data.isFamilyHead;
            console.log("3", this.isFamilyHead);
        }
        else {
            console.log("Is member");
            let newUserInsStmt = `INSERT INTO t_user(
                email_id, org_id, firebase_id)
              VALUES (          
                     '${userInfo.data.email}',
                     '${userInfo.data.orgId}',
                     '${userInfo.data.fbId}'
              ) returning user_id;`
            let result = await client.query(newUserInsStmt);
            console.log("2", this.userId);
            this.userId = result.rows[0].user_id;
            console.log("2", this.userId);
            this.isFamilyHead = userInfo.data.isFamilyHead;
            console.log("3", this.isFamilyHead);

        }
        /****************************************** t_person******************************************************************************/
        console.log("2");
        let insertPerson = `INSERT INTO t_person(
                user_id, title, first_name, middle_name, last_name, mobile_no)
              VALUES ($1, $2, $3, $4, $5, $6);`

        console.log("2", this.userId);
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
        client.end()

        return ({
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


    let client = dbConnections.getConnection();
    await client.connect();
    console.log("1");
    try {
        // let query = `select user_id,first_name,last_name,email_id,mobile_no, role_name,menu_name,perm_name 
        //             from v_user
        //             where firebase_id = '${firebaseToken}';`

        console.log("2");
        let query = `select distinct vu.user_id, vu.email_id,
         vu.title, vu.first_name, vu.middle_name, vu.last_name,
				vu.nick_name, vu.dob,
                 vu.mobile_no,
				vu.address_line1, vu.address_line2,
                 vu.address_line3, vu.city, vu.state,
                  vu.postal_code, vu.country
				,vu.home_phone_no, vu.baptismal_name, 
                vu.marital_status, vu.date_of_marriage,
                 vu.about_yourself,
				vu.role_name, 
                vu.menu_name,
                vu.url menu_url,
                vu.firebase_id fbuid,
                vu.icon_path menu_icon,
                 vu.perm_name, 
                 vu.user_org org_name, 
                 vu.user_org_id org_id, vu.is_family_head 
                from v_user vu where firebase_id = '${firebaseToken}';`


        console.log("3");
        let res = await client.query(query);


        console.log("4", res.rowCount);


        if (res && res.rowCount > 0) {

            console.log("5");

            let metaData = {};
            let permissions = [];
            let memberDetails = [];
            let menus = [];

            metaData.userId = res.rows[0].user_id;
            metaData.fbUid = res.rows[0].fbuid;
            metaData.emailId = res.rows[0].email_id;
            metaData.title = res.rows[0].title;
            metaData.firstName = res.rows[0].first_name;
            metaData.middleName = res.rows[0].middle_name;
            metaData.lastName = res.rows[0].last_name;
            metaData.nickName = res.rows[0].nick_name;
            metaData.dob = res.rows[0].dob;
            metaData.mobile_no = res.rows[0].mobile_no;
            metaData.addressLine1 = res.rows[0].address_line1;
            metaData.addressLine2 = res.rows[0].address_line2;
            metaData.addressLine3 = res.rows[0].address_line3;
            metaData.city = res.rows[0].city;
            metaData.state = res.rows[0].state;
            metaData.postalCode = res.rows[0].postal_code;
            metaData.country = res.rows[0].country;
            metaData.homePhoneNo = res.rows[0].home_phone_no;
            metaData.baptismalName = res.rows[0].baptismal_name;
            metaData.maritalStatus = res.rows[0].marital_status;
            metaData.dateOfMarriage = res.rows[0].date_of_marriage;
            metaData.aboutYourself = res.rows[0].about_yourself;
            metaData.userRole = res.rows[0].role_name;
            metaData.orgName = res.rows[0].org_name;
            metaData.orgId = res.rows[0].org_id;
            metaData.isFamilyHead = res.rows[0].is_family_head;

            for (let row of res.rows) {

              let index = menus.findIndex((item => item.name == row.menu_name))
                if(index == -1){
                    let tempJson = {
                        name: row.menu_name,
                        url : row.menu_url,
                        icon : row.menu_icon
                    };
                    menus.push(tempJson);
                }

                // if (menus.indexOf(row.menu_name) < 0)
                //     menus.push(row.menu_name)
                if (permissions.indexOf(row.perm_name) < 0) {
                    permissions.push(row.perm_name)
                }

            }
            metaData.permissions = permissions;
            metaData.menus = menus;

            console.log("metaData.userId", metaData.userId);

            let query1 = `select distinct vu.user_id, vu.email_id, vu.title,
                    vu.first_name, vu.middle_name, vu.last_name,
			    	vu.dob, vu.mobile_no, tpr.relationship,
                    tpr.id relationship_id
                    from v_user vu, t_person_relationship tpr 
                    where tpr.family_head_id = '${metaData.userId}' 
                    and tpr.is_deleted = 'no'
                    and vu.user_id = tpr.family_member_id;`

            let res1 = await client.query(query1);

            for (row of res1.rows) {
                let member = {};
                member.userId = row.user_id;
                member.emailId = row.email_id;
                member.title = row.title;
                member.firstName = row.first_name;
                member.middleName = row.middle_name;
                member.lastName = row.last_name;
                member.dob = row.dob;
                member.mobileNo = row.mobile_no;
                member.relationship = row.relationship;
                member.relationshipId = row.relationship_id;
                memberDetails.push(member);
            }

            metaData.memberDetails = memberDetails;

            client.end();

            return ({
                data: {
                    status: 'success',
                    metaData: metaData
                }
            })
        }

    } catch (error) {
        client.end();
        console.error(`reqOperations.js::processGetUserMetaDataRequest() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    }

}


async function getuserRecords() {

    let client = dbConnections.getConnection();
    await client.connect();
    try {
        let getuserRecords = `select distinct vu.user_id, vu.email_id,
            vu.title, vu.first_name, vu.middle_name, vu.last_name,
                   vu.nick_name, vu.dob,
                    vu.mobile_no,
                   vu.address_line1, vu.address_line2,
                    vu.address_line3, vu.city, vu.state,
                     vu.postal_code, vu.country
                   ,vu.home_phone_no, vu.baptismal_name, 
                   vu.marital_status, vu.date_of_marriage,
                    vu.about_yourself,
                   vu.role_id, vu.org_id, vu.org_type
                   from v_user vu order by vu.user_id;`


        let res = await client.query(getuserRecords);

        if (res && res.rowCount > 0) {

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
                    user.emailId = row.email_id;
                    user.title = row.title;
                    user.firstName = row.first_name;
                    user.middleNmae = row.middle_name;
                    user.lastName = row.last_name;
                    user.nickName = row.nick_name;
                    user.dob = row.dob;
                    user.mobileNo = row.mobile_no;
                    user.addressLine1 = row.address_line1;
                    user.addressLine2 = row.address_line2;
                    user.addressLine3 = row.address_line3;
                    user.city = row.city;
                    user.state = row.state;
                    user.postalCode = row.postal_code;
                    user.country = row.country;
                    user.homePhoneNo = row.home_phone_no;
                    user.baptismalNname = row.baptismal_name;
                    user.maritalStatus = row.marital_status;
                    user.dateofMarriage = row.date_of_marriage;
                    user.aboutYourself = row.about_yourself;
                    user.roleId = row.role_id;
                    user.orgId = row.org_id;
                    user.orgType = row.org_type;
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
            client.end();
            return ({
                data: {
                    status: 'success',
                    metaData: users
                }
            })
        }
    } catch (error) {
        client.end();
        console.error(`reqOperations.js::getuserRecords() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    }
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
                    client.end()
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
                    client.end()
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



async function processUpdateUserRoles(userData) {
    let client = dbConnections.getConnection();
    console.log("User Data" + JSON.stringify(userData));
    try {
        await client.connect();
        await client.query("BEGIN");
        console.log("1");
        /********************** t_user************************* */
        const updateUserTbl = `UPDATE t_user SET
                      updated_by=$1,
                      updated_date=$2, 
                      org_id=$3,
                      is_family_head=$4
                  WHERE user_id= $5;`;

        console.log("2");

        const updateUserTbl_values = [
            userData.updatedBy,
            new Date().toISOString(),
            userData.orgId,
            userData.isFamilyHead,
            userData.userId,
        ];
        console.log(updateUserTbl_values);
        await client.query(updateUserTbl, updateUserTbl_values);

        console.log("3");
        /*************************** t_person********************************************* */
        const updatePersonTbl = `UPDATE t_person SET
                title=$1,
                first_name=$2, 
                middle_name=$3,
                last_name=$4,
                nick_name=$5,
                dob=$6,
                address_line1=$7,
                address_line2=$8,
                address_line3=$9,
                city=$10,
                state=$11,
                postal_code=$12,
                country=$13,
                mobile_no=$14,
                home_phone_no=$15,
                baptismal_name=$16,
                marital_status=$17,
                date_of_marriage=$18,
                about_yourself=$19,
                updated_by=$20,
                updated_date=$21
            WHERE user_id= $22;`;

        console.log("4");
        const updatePersonTblValues = [
            userData.title,
            userData.firstName,
            userData.middleName,
            userData.lastName,
            userData.nickName,
            userData.dob,
            userData.addressLine1,
            userData.addressLine2,
            userData.addressLine3,
            userData.city,
            userData.state,
            userData.postalCode,
            userData.country,
            userData.mobileNo,
            userData.homePhoneNo,
            userData.batismalName,
            userData.maritalStatus,
            userData.dateofMarriage,
            userData.aboutYourself,
            userData.updatedBy,
            new Date().toISOString(),
            userData.userId,
        ];
        console.log("updatePersonTblValues", updatePersonTblValues);
        console.log("5");
        await client.query(updatePersonTbl, updatePersonTblValues);

        /***************************** Family Member Data Insertion**************************************************** */

        console.log("6");

        if (userData.memberDetails != undefined || userData.memberDetails != null) {

         
            let existingMembers = [];

            for (let details of userData.memberDetails) {

                console.log("details", details);

                

           
                let selectEmail = `select user_id usercount, family_member_id membercount 
                from t_user
                left outer join t_person_relationship on family_member_id = user_id
                where email_id = '${details.emailId}';`


                console.log("selectEmail", selectEmail);
                let emailResults = await client.query(selectEmail);

                console.log("emailResults", emailResults);


                if (emailResults.rowCount == 0) {
                    let fbuid = "";
                    try {

                        await firebase.auth().createUserWithEmailAndPassword(details.emailId, 'User#123!').then((data) => {
                            try {
                                fbuid = data.user.uid;
                            } catch (err) {
                                console.log('Caught an error while creating member accout in firebase as :  ' + JSON.stringify(error))
                            }

                        }).catch((error) => {
                            console.log('Caught an error while creating member accout in firebase as :  ' + JSON.stringify(error))
                        });

                    } catch (error) {
                        console.log('Creating account firebase.... error! : ' + error);
                    }


                    /////////////////////////////////////////    t_user    /////////////////////////////////////////////////////////////////////////////////////
                    let NewUserId;
                    try {
                        console.log('Inserting records into t_user ....');
                        console.log('New member UID' + fbuid)
                        const insertuserTbl = `INSERT INTO t_user(
                        email_id, org_id, firebase_id)
                        VALUES (                    
                          '${details.emailId}',
                           ${userData.orgId},
                          '${fbuid}'
                        ) returning user_id;`;

                        let result = await client.query(insertuserTbl);
                        NewUserId = result.rows[0].user_id;

                    } catch (error) {
                        console.error('Error while insterting record into t_user table as  : ' + NewUserId);
                    }

                    ////////////////////////////////////////////////   t_person  /////////////////////////////////////////////////////////////////////////////

                    console.log('Inserting records into t_person ....');
                    console.log('New user if for member is ' + details.emailId + ' is ' + NewUserId)

                    try {
                        let insertPerson = `INSERT INTO t_person(
                                        user_id, title, first_name, middle_name, last_name, dob, mobile_no)
                                        VALUES ($1, $2, $3, $4, $5, $6, $7);`

                        insertPersonValues =
                            [
                                NewUserId,
                                details.title,
                                details.firstName,
                                details.middleName,
                                details.lastName,
                                details.dob,
                                details.mobileNo
                            ]

                        console.log('insertPersonValues :' + insertPersonValues);
                        await client.query(insertPerson, insertPersonValues);

                    } catch (error) {
                        console.error('Error while insterting record into t_person table as  : ' + error);
                    }

                


                    console.log("this.NewUserId",NewUserId);
                    let insertRoleMappingmember = `insert into t_user_role_mapping (user_id, role_id)
                    select ${NewUserId}, id from t_role where name = 'Member';`
                    console.log("insertRoleMappingmember", insertRoleMappingmember);
                    await client.query(insertRoleMappingmember);

                    ///////////////////////////////////////////////  t_person_relationship  //////////////////////////////////////////////////////////////////////////////

                    
                    console.log('Inserting records into t_person_relationship ....');


                    let insertPersonRelationship = `INSERT INTO t_person_relationship(
                        family_head_id, family_member_id, relationship, updated_by, updated_date)
                          VALUES ($1, $2, $3, $4, $5);`

                    insertPersonRelationshipValues = [
                        userData.userId,
                        NewUserId,
                        details.relationship,
                        userData.updatedBy,
                        new Date().toISOString()
                    ]

                    console.log("insertPersonRelationshipValues", insertPersonRelationshipValues);

                    await client.query(insertPersonRelationship, insertPersonRelationshipValues);

                    console.log('New member created successfully.');

                    existingMembers.push(NewUserId);

                    ///this.userId = result.rows[0].user_id;
                    //console.log("userid", this.userId)





                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                }
                else {

                    console.log("emailResults.rows[0].membercount",emailResults.rows[0].membercount);

                    if (emailResults.rows[0].membercount == null) {

                    console.log("details", details);
                    console.log("1");
            
                    let insertPersonRelationship = `INSERT INTO t_person_relationship(
                        family_head_id, family_member_id, relationship, updated_by, updated_date)
                          VALUES ($1, $2, $3, $4, $5);`

                    console.log("2");

                    insertPersonRelationshipValues = [
                        userData.userId,
                        emailResults.rows[0].usercount,
                        details.relationship,
                        userData.updatedBy,
                        new Date().toISOString()
                    ]

                    console.log("insertPersonRelationshipValues", insertPersonRelationshipValues);

                    await client.query(insertPersonRelationship, insertPersonRelationshipValues);
                     }
                    else{
                        let updateRelationship = `UPDATE t_person_relationship SET is_deleted = 'no' where family_member_id =${emailResults.rows[0].membercount};`
                        console.log("updateRelationship", updateRelationship);
                        await client.query(updateRelationship);
                     }

                    existingMembers.push(emailResults.rows[0].usercount);
                }
            }

            //// Delete users which are not present in membership detail array

            let usersToDelete = existingMembers.join(',');
            let deleteRelationship = `UPDATE t_person_relationship SET is_deleted = 'yes' where family_member_id not in (${usersToDelete});`
            console.log("deleteRelationship", deleteRelationship);
            await client.query(deleteRelationship);

        }


        /**********************Insert -> t_user_role_mapping ************************* */



        console.log("10");

        if (userData.roles != undefined || userData.roles != null) {
            console.log("7");
            /**********************Delete -> t_user_role_mapping ************************* */
            const deleteFromRoleMapping = `DELETE FROM public.t_user_role_mapping WHERE user_id='${userData.userId}';`
            await client.query(deleteFromRoleMapping);

            console.log("8");
            /**********************Delete -> t_user_role_context ************************* */
            const deleteFromRoleContext = `DELETE FROM public.t_user_role_context WHERE user_id='${userData.userId}';`
            client.query(deleteFromRoleContext);

            console.log("9");



            for (let role of userData.roles) {

                const insertRoleMapping = `INSERT INTO public.t_user_role_mapping(
                    role_id, user_id, is_deleted)
                    VALUES ($1, $2, $3);`

                //t_user_role_context 
                console.log(`Inserting role ${JSON.stringify(role)} into t_user_role_mapping t_user_role_context and t_user_role_context table.`)
                insertRoleMapping_value = [role.roleId, userData.userId, false];
                await client.query(insertRoleMapping, insertRoleMapping_value);

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

                //t_user_role_context
                console.log("RoleData");
                insertRoleContext_value = [role.roleId, userData.userId, role.orgId, false, userData.updatedBy, new Date().toISOString(), userData.updatedBy, new Date().toISOString()]
                console.log(role.roleId, userData.userId, role.orgId, false, userData.updatedBy, new Date().toISOString(), userData.updatedBy, new Date().toISOString());
                await client.query(insertRoleContext, insertRoleContext_value);

            }
        }


        console.log("11");

        console.log("Before commit");
        await client.query("COMMIT");
        console.log("After commit");
        client.end();
        return ({
            data: {
                status: 'success'
            }
        })


    } catch (err) {
        client.query("ROLLBACK");
        console.error(`reqOperations.js::processUpdateUserRoles() --> error : ${JSON.stringify(err)}`);
        console.log("Transaction ROLLBACK called");
        return (errorHandling.handleDBError('transactionError'));
    }
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


async function deleteUsers(userData) {

    let client = await dbConnections.getConnection();
  
    try {
      //  let usersToDelete = userData.deleteUser.join(',');
       // let deleteFromUserTable = `UPDATE t_user SET is_deleted = 'yes' where user_id in ('${usersToDelete}');`
       let deleteFromUserTable = `UPDATE t_user SET is_deleted = true where user_id in (${userData.deleteUser});`
        console.log("deleteFromUserTable : " + deleteFromUserTable)
        await client.connect();
        await client.query(deleteFromUserTable, (err, res)=>{
            if(err)
            console.log('Error occured : ' + err)
        });

        let deleteFromPersonTable = `UPDATE t_person SET is_deleted = true where user_id in (${userData.deleteUser});`

        await client.query(deleteFromPersonTable,  (err, res)=>{
            if(err)
            console.log('Error occured : ' + err)
        });

        return ({
            data: {
                status: 'success',
            }
        });

    } catch (err) {
        client.query("ROLLBACK");
        console.error(`reqOperations.js::deleteUsers() --> error : ${JSON.stringify(err)}`);
        console.log("Transaction ROLLBACK called");
        return (errorHandling.handleDBError('transactionError'));
    }
}

module.exports = {
    processSignInRequest,
    processGetUserMetaDataRequest,
    getuserRecords,
    processUpdateUserRoles,
    getRoleMetadata,
    getEventCategory,
    getParishData,
    insertEvents,
    deleteUsers
}
