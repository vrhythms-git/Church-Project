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

        // if (userInfo.data.memberType != "member") {
        //     console.log("Not member");
        // let newUserInsStmt = `INSERT INTO t_user(
        //     email_id, org_id, firebase_id, is_approved)
        //   VALUES (          
        //          '${userInfo.data.email}',
        //          '${userInfo.data.orgId}',
        //          '${userInfo.data.fbId}',
        //          true
        //   ) returning user_id;`

        let newUserInsStmt = `INSERT INTO public.t_user
            (email_id, org_id, firebase_id, title, first_name, middle_name, last_name, about_yourself, created_date, member_type )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning user_id;`;

        let newUserInsStmtValue = [
            userInfo.data.email,
            userInfo.data.orgId,
            userInfo.data.fbId,
            userInfo.data.title,
            userInfo.data.firstName,
            userInfo.data.middleName,
            userInfo.data.lastName,
            userInfo.data.abtyrslf,
            new Date().toISOString(),
            userInfo.data.memberType
        ];

        let result = await client.query(newUserInsStmt, newUserInsStmtValue);
        //  console.log("2", this.userId);
        let newUserId = result.rows[0].user_id;
        console.log('Newly created user\'s id is : ' + newUserId);
        // this.isFamilyHead = userInfo.data.isFamilyHead;
        // console.log("3", this.isFamilyHead);


        let newPersonTblInsQuery = `INSERT INTO public.t_person
            (user_id, dob,  mobile_no, created_by, created_date, membership_type)
            VALUES($1 , $2, $3, $4, $5, $6);`;

        let newPersonTblInsQueryValue = [
            newUserId,
            userInfo.data.dob,
            userInfo.data.mobileNo,
            newUserId,
            new Date().toISOString(),
            userInfo.data.memberType
        ];

        await client.query(newPersonTblInsQuery, newPersonTblInsQueryValue);

        // }
        // else {
        //     console.log("Is member");
        //     let newUserInsStmt = `INSERT INTO t_user(
        //         email_id, org_id, firebase_id)
        //       VALUES (          
        //              '${userInfo.data.email}',
        //              '${userInfo.data.orgId}',
        //              '${userInfo.data.fbId}'
        //       ) returning user_id;`
        //     let result = await client.query(newUserInsStmt);
        //     console.log("2", this.userId);
        //     this.userId = result.rows[0].user_id;
        //     console.log("2", this.userId);
        //     this.isFamilyHead = userInfo.data.isFamilyHead;
        //     console.log("3", this.isFamilyHead);

        // }
        /****************************************** t_person******************************************************************************/
        // console.log("2");
        // let insertPerson = `INSERT INTO t_person(
        //         user_id, title, first_name, middle_name, last_name, mobile_no)
        //       VALUES ($1, $2, $3, $4, $5, $6);`

        // console.log("2", this.userId);
        // insertPersonValues =
        //     [
        //         this.userId,
        //         userInfo.data.title,
        //         userInfo.data.firstName,
        //         userInfo.data.middleName,
        //         userInfo.data.lastName,
        //         userInfo.data.mobileNo
        //     ]

        // console.log(insertPersonValues);
        // console.log("4");

        // await client.query(insertPerson, insertPersonValues);

        /**********************************************t_user_role_mapping*********************************************************************************** */

        // console.log("3");
        // console.log("isfamily head ", this.isFamilyHead);
        // if (this.isFamilyHead) {
        //     console.log("6");
        //     console.log("this.userId", this.userId);
        //     let insertRoleMapping = `insert into t_user_role_mapping (user_id, role_id)
        //         select ${this.userId}, id from t_role where name = 'Family Head';`
        //     await client.query(insertRoleMapping);
        // }
        // if (!this.isFamilyHead) {
        //   console.log("7");
        let insertRoleMappingmember = `insert into t_user_role_mapping (user_id, role_id)
                select ${newUserId}, role_id from t_role where name = 'Member';`
        await client.query(insertRoleMappingmember);
        //}

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
        console.error(`reqOperations.js::processSignInRequest() --> error : ${error}`)
        console.log("Transaction ROLLBACK called");
        return (errorHandling.handleDBError('transactionError'));
    }
}



async function processGetUserMetaDataRequest(uid) {


    let client = dbConnections.getConnection();
    await client.connect();

    //Validate user, if not valid then respond him back with appropriate request
    // try {
    //     //console.log('Validating user approval and his deleted status.')
    //     const userValidationQuery = `SELECT  CASE WHEN tu.is_approved = false THEN false
    //                                         WHEN tu.is_approved = true THEN true
    //                                         ELSE false
    //                                 end as is_approved,

    //                                 CASE WHEN tu.is_deleted = false THEN false
    //                                         WHEN tu.is_deleted = true THEN true
    //                                         ELSE false
    //                                 end as is_deleted
    //                                 FROM t_user tu where user_id = '${uid}' ;`;

    //     let result = await client.query(userValidationQuery);
    //     console.log(`for user ${uid} is_approved : ${result.rows[0].is_approved} and is_deleted : ${result.rows[0].is_deleted}`)
    //     if (result.rows[0].is_approved == false)
    //         return errorHandling.handleDBError('not_approved')
    //     if (result.rows[0].is_deleted == true)
    //         return errorHandling.handleDBError('account_deleted')

    // } catch (error) {
    //     console.error('reqOperations::processGetUserMetaDataRequest() ---> error occured : ' + error)
    //     return errorHandling.handleDBError('connectionError')
    // }


    try {
        // let query = `select user_id,first_name,last_name,email_id,mobile_no, role_name,menu_name,perm_name 
        //             from v_user
        //             where firebase_id = '${firebaseToken}';`

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
                 vu.user_org_id org_id,
                 vu.is_family_head,
                 vu.is_approved,
                 vu.membership_type   
                from v_user vu where user_id = '${uid}';`

         let lastLoggedIn =  `select 
                                    action_timestamp as last_logged_in
                                from 
                                    t_audit_log 
                                where 
                                    user_id ='${uid}'
                                    and "action" = 'LOG_IN' 
                                order by 
                                    audit_log_id desc FETCH FIRST 1 ROW ONLY;`       


        let res = await client.query(query);
        let lastLoggedInRes = await client.query(lastLoggedIn);


        console.log("4", res.rowCount);


        if (res && res.rowCount > 0) {

            console.log("5");

            let metaData = {};
            let permissions = [];
            let memberDetails = [];
            let menus = [];

            metaData.isApproved = res.rows[0].is_approved;
            metaData.userId = res.rows[0].user_id;
            metaData.fbUid = res.rows[0].fbuid;
            metaData.emailId = res.rows[0].email_id;
            metaData.title = res.rows[0].title;
            metaData.firstName = res.rows[0].first_name;
            metaData.lastName = res.rows[0].last_name;
            metaData.dob = res.rows[0].dob;
            metaData.aboutYourself = res.rows[0].about_yourself;
            metaData.orgName = res.rows[0].org_name;
            metaData.orgId = res.rows[0].org_id;
            metaData.membershipType = res.rows[0].membership_type
            metaData.lastLoggedIn = lastLoggedInRes.rows[0].last_logged_in 
            metaData.mobile_no = res.rows[0].mobile_no;

            if (res.rows[0].is_approved == true) {


                let isFamilyMember = `select 
                                            case when count(family_head_id) > 0 then true else false end is_family_member 
                                        from 
                                            t_person_relationship 
                                        where 
                                            family_member_id = '${uid}';`

                let isFamilyMemberRes = await client.query(isFamilyMember);                                            

                metaData.middleName = res.rows[0].middle_name;
                metaData.nickName = res.rows[0].nick_name;
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
                metaData.userRole = res.rows[0].role_name;
                metaData.orgName = res.rows[0].org_name;
                metaData.orgId = res.rows[0].org_id;
                metaData.isFamilyHead = res.rows[0].is_family_head;
                metaData.isFamilyMember = isFamilyMemberRes.rows[0].is_family_member;
                

                for (let row of res.rows) {

                    let index = menus.findIndex((item => item.name == row.menu_name))
                    if (index == -1) {
                        let tempJson = {
                            name: row.menu_name,
                            url: row.menu_url,
                            icon: row.menu_icon
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
                    tpr.relationship_id relationship_id
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
            }

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


async function getuserRecords(userType, loggedInUser) {

    let client = dbConnections.getConnection();
    await client.connect();
    try {

        let condition = ' ';

        if (userType == 'approval_requests') {
            condition = ' vu.is_approved = false AND '
        } else if (userType == 'approved') {
            condition = ' vu.is_approved = true AND '
        }



        let getuserRecords =
            `SELECT DISTINCT vu.user_id,
                        vu.email_id,
                        vu.title,
                        vu.first_name,
                        vu.middle_name,
                        vu.last_name,
                        vu.nick_name,
                        vu.dob,
                        vu.mobile_no,
                        vu.address_line1,
                        vu.address_line2,
                        vu.address_line3,
                        vu.city,
                        vu.state,
                        vu.postal_code,
                        vu.country ,
                        vu.home_phone_no,
                        vu.baptismal_name,
                        vu.marital_status,
                        vu.date_of_marriage,
                        vu.about_yourself,
                        vu.is_family_head,
                        vu.role_id,
                        vu.user_org_id org_id,
                        vu.user_org_type org_type,
                        membership_type,
                        vu.user_org parish_name
                    FROM  v_user vu
                    WHERE ${condition} vu.user_org_id IN ( WITH recursive child_orgs 
                                 AS (
                                    SELECT org_id
                                    FROM   t_organization parent_org 
                                    WHERE  org_id IN
                                            (
                                                    SELECT a.org_id
                                                    FROM   t_user_role_context a,                                                                            t_user b
                                                    WHERE  b.user_id = ${loggedInUser}        
                                                    AND    a.user_id = b.user_id)                                                        UNION
                                    SELECT     child_org.org_id child_id
                                    FROM       t_organization child_org
                                    INNER JOIN child_orgs c
                                    ON         c.org_id = child_org.parent_org_id ) SELECT *
                                        FROM   child_orgs ) order by user_id desc;`

        //console.log('Executing query : ' + getuserRecords)

        if (userType == 'rejected') {

            getuserRecords = ` select                      
                                th.user_id, 
                                th.title,
                                th.first_name,
                                th.last_name,
                                tol.reason,
                                (select "name" from t_organization to2 where org_id = th.org_id) parish_name,
                                th.member_type  
                                from t_user_history th inner join t_user_operation_log tol 
                                on th.user_id = tol.user_id and operation_type = 'Request Rejected' WHERE th.org_id IN ( WITH recursive child_orgs 
                                            AS (
                                                SELECT org_id
                                                FROM   t_organization parent_org 
                                                WHERE  org_id IN
                                                        (
                                                                SELECT a.org_id
                                                                FROM   t_user_role_context a,                                                                            t_user b
                                                                WHERE  b.user_id = ${loggedInUser}        
                                                                AND    a.user_id = b.user_id)                                                        UNION
                                                SELECT     child_org.org_id child_id
                                                FROM       t_organization child_org
                                                INNER JOIN child_orgs c
                                                ON         c.org_id = child_org.parent_org_id ) SELECT *
                                                    FROM   child_orgs );`;
        }

        let res = await client.query(getuserRecords);

        let user = {}
        let users = [];
        let roles = [];
        let userid = 0;

        if (res && res.rowCount > 0) {

            console.log("In response" + res);


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
                    user.reason = row.reason
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
                    user.baptismalName = row.baptismal_name;
                    user.maritalStatus = row.marital_status;
                    user.dateofMarriage = row.date_of_marriage;
                    user.aboutYourself = row.about_yourself;
                    user.isFamilyHead = row.is_family_head;
                    user.roleId = row.role_id;
                    user.orgId = row.org_id;
                    user.orgType = row.org_type;
                    user.memberType = row.membership_type;
                    user.membershipType = row.member_type;
                    user.parish_name = row.parish_name;

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
        } else {
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
        let getRoles = `select role_id id, name from t_role where is_deleted = 'no' order by name;`
        let getorgs = `select org_type, org_id id, name, level from t_organization where is_deleted = 'no' order by level, org_type, name;`
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

    let client = dbConnections.getConnection();
    await client.connect();
    try {
        let metadata = {};
        let getEventCategory = `select event_category_id id, name, description ,school_grade_from,school_grade_to from t_event_category;`
        let res = await client.query(getEventCategory);
        if (res && res.rowCount > 0) {
            console.log("In response" + res);
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
            //client.end()

        }



        let getVenueData = `select * from t_venue;`
        let res1 = await client.query(getVenueData);
        if (res1 && res1.rowCount > 0) {
            console.log("In getVenueData" + res1);

            let venuesData = [];
            for (let row of res1.rows) {
                let venues = {};
                venues.venueId = row.venue_id;
                venues.name = row.name;
                venues.orgId = row.org_id;
                venues.description = row.description;
                venues.addressLine1 = row.address_line1;
                venues.addressLine2 = row.address_line2;
                venues.addressLine3 = row.address_line3;
                venues.city = row.city;
                venues.state = row.state;
                venues.postalCode = row.postal_code;
                venues.country = row.country;
                venues.mobileNo = row.mobile_no;
                venues.homePhoneNo = row.phone_no;
                venues.mapUrl = row.map_url;
                venuesData.push(venues);
            }
            metadata.venuesData = venuesData;
            client.end()

        }

        return ({
            data: {
                status: 'success',
                metaData: metadata
            }
        })

    } catch (error) {
        client.end();
        console.error(`reqOperations.js::getuserRecords() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));


    }
}

async function getParishData() {

    return new Promise((resolve, reject) => {
        let getParishData = `select org_id id, name from t_organization where org_type = 'Parish'`
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

/* .............get events Data from database.................. */
async function getEventData() {
    let client = dbConnections.getConnection();
    await client.connect();
    try {
        let metadata = {};
        let getEventData = `select * from t_event`;
        let res = await client.query(getEventData);
        if (res && res.rowCount > 0) {
            console.log("In Event response : " + res);
            let eventData = [];
            for (let row of res.rows) {
                let events = {};
                events.event_Id = row.event_id;
                events.name = row.name;
                events.event_type = row.event_type;
                events.description = row.description;
                events.startDate = row.start_date;
                events.endDate = row.end_date;
                events.registrationStartDate = row.registration_start_date;
                events.registrationEndDate = row.registration_end_date;
                events.orgId = row.org_id;
                eventData.push(events);
            }
            metadata.eventData = eventData;
            client.end()
        }
        return ({
            data: {
                status: 'success',
                metaData: metadata

            }
        })

    } catch (error) {
        client.end();
        console.log(`reqOperations.js::getEventData() --> error executing query as : ${error}`);
        return (errorHandling.handleDBError('connectionError'));
    }
}



async function processUpdateUserRoles(userData) {
    let client = dbConnections.getConnection();
    //  console.log("User Data" + JSON.stringify(userData));
    try {
        await client.connect();
        await client.query("BEGIN");
        // console.log("1");

        if (userData.isFamilyHead == true || userData.isFamilyHead == "true") {

            let insertRoleMapping = `insert into t_user_role_mapping (user_id, role_id)
                (select ${userData.userId}, role_id from t_role where name = 'Family Head');`
            await client.query(insertRoleMapping)
            console.log('User is family head gave him add member permission');
        }
        if (userData.isFamilyHead == false || userData.isFamilyHead == "false") {

            let insertRoleMappingmember = `insert into t_user_role_mapping (user_id, role_id)
                select ${userData.userId}, role_id from t_role where name = 'Member';`

            await client.query(insertRoleMappingmember)
        }

        /********************** t_user************************* */

        const updateUserTbl = `UPDATE public.t_user
                SET  org_id=$1,
                     title=$2, 
                     first_name=$3, 
                     middle_name=$4,
                     last_name=$5,
                     about_yourself=$6,
                     is_family_head=$7,
                     updated_by=$8, 
                     updated_date=$9
                WHERE user_id=$10;`;

        const updateUserTbl_values = [
            userData.orgId,
            userData.title,
            userData.firstName,
            userData.middleName,
            userData.lastName,
            userData.aboutYourself,
            userData.isFamilyHead == 'true' ? true : false,
            userData.updatedBy,
            new Date().toISOString(),
            userData.userId
        ];

        //console.log(updateUserTbl_values);
        await client.query(updateUserTbl, updateUserTbl_values)

        // console.log("3");
        /*************************** t_person********************************************* */

        const updatePersonTbl = `UPDATE PUBLIC.t_person
                        SET     nick_name = $1,
                                dob = $2,
                                address_line1 = $3,
                                address_line2 = $4,
                                address_line3 = $5,
                                city = $6,
                                state = $7,
                                postal_code = $8,
                                country = $9,
                                mobile_no = $10,
                                home_phone_no = $11,
                                updated_by = $12,
                                updated_date = $13,
                                baptismal_name = $14,
                                marital_status = $15,
                                date_of_marriage = $16
                        WHERE   user_id = $17; `

        const updatePersonTblValues = [
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
            userData.updatedBy,
            new Date().toISOString(),
            userData.baptismalName,
            userData.maritalStatus,
            userData.dateofMarriage,
            userData.userId
        ];

        await client.query(updatePersonTbl, updatePersonTblValues)

        /***************************** Family Member Data Insertion**************************************************** */

        if (userData.memberDetails != undefined || userData.memberDetails != null) {
            let existingMembers = [];
            for (let details of userData.memberDetails) {
                console.log("details", details);

                // let selectEmail = `select user_id usercount, family_member_id membercount 
                // from t_user
                // left outer join t_person_relationship on family_member_id = user_id
                // where email_id = '${details.emailId}';`

                /*Query to check if family head adding member with his/hers email id and first name, last name, email id combination exists or not 
                Output:(Boolean)
                    true  : Combination does not exists.
                    false : Combination exists. 
                */
                let condition1Query = `select 
                                            case when count(user_id) != 0 
                                            and count(family_member_id) != 0 then true else false end as result 
                                        from 
                                            t_user tu 
                                            left outer join t_person_relationship on family_member_id = tu.user_id 
                                        where 
                                            email_id = '${details.emailId}' 
                                            and lower(tu.first_name) != lower('${details.firstName}') 
                                            and lower(tu.last_name) != lower('${details.lastName}')`;

                /* Condition to check if the given new member email id is exists in system or not.
                Output:(Boolean) :
                    true  :  email id exists.
                    false : email id does not exists. 
                */
                let condition2Query = `select 
                                            case when count(user_id) != 0 then true else false end as is_user, 
                                            case when count(family_member_id) != 0 then true else false end as is_fm_id 
                                        from 
                                            t_user 
                                            left outer join t_person_relationship on family_member_id = user_id 
                                        where 
                                            email_id = '${details.emailId}';`;



                let condition1Result = await client.query(condition1Query);
                let condition2Result = await client.query(condition2Query);

                // console.log("selectEmail", selectEmail);
                // let emailResults = await client.query(selectEmail);

                // console.log("emailResults", emailResults);

                const insertPerson = `INSERT INTO public.t_person
                (user_id, dob,  mobile_no, created_by, created_date, membership_type)
                VALUES($1 , $2, $3, $4, $5, $6);`;

                let insertPersonRelationship = `INSERT INTO t_person_relationship(
                    family_head_id, family_member_id, relationship, updated_by, updated_date)
                      VALUES ($1, $2, $3, $4, $5);`

                console.log('Does  member\'s email exists in system: ',
                    (condition2Result.rows[0].is_user == false) ? 'No' : 'Yes');

                console.log('Does member\'s relationship exists in system: ',
                    (condition2Result.rows[0].is_fm_id == false) ? 'Yes' : 'No');

                console.log('Does new member\'s first name, last name and email combination exists in system: ',
                    (condition1Result.rows[0].result == false) ? 'Yes' : 'No');


                if (condition1Result.rows[0].result == false && condition2Result.rows[0].is_user == true) {
                    // In case where new member first name last name and email combination dosent exists in the system. 
                    // But only email id exists in the system
                    // then system should create new member user with same email but different first name and last name combination; 
                    console.log('Member is using parent\'s email id, so populating new member data into the tables')

                    try {

                        const insertuserTbl = `INSERT INTO public.t_user
                        (org_id, email_id, firebase_id, title, first_name, middle_name, last_name, created_by, created_date, member_type, is_approved )
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning user_id;`;

                        //Populating t_user table
                        const insertuserTblValues = [
                            userData.orgId,
                            userData.emailId,
                            '',
                            details.title,
                            details.firstName,
                            details.middleName,
                            details.lastName,
                            userData.updatedBy,
                            new Date().toISOString(),
                            'member',
                            true
                        ]

                        let result = await client.query(insertuserTbl, insertuserTblValues)
                        let newUserId = result.rows[0].user_id;
                        console.log('t_user table populated!, with new user_id : ', newUserId)

                        //Populating t_person table
                        insertPersonValues =
                            [
                                newUserId,
                                details.dob,
                                details.mobileNo,
                                userData.updatedBy,
                                new Date().toISOString(),
                                'member'
                            ]
                        await client.query(insertPerson, insertPersonValues);
                        console.log('t_person table populated!')

                        //Populating t_user_role_mapping table  

                        let insertRoleMappingmember = `insert into t_user_role_mapping (user_id, role_id)
                        select ${newUserId}, role_id from t_role where name = 'Member';`
                        await client.query(insertRoleMappingmember);
                        console.log('t_user_role_mapping table populated!')

                        //Populating t_person_relationship table
                        insertPersonRelationshipValues = [
                            userData.userId,
                            newUserId,
                            details.relationship,
                            userData.updatedBy,
                            new Date().toISOString()
                        ]

                        await client.query(insertPersonRelationship, insertPersonRelationshipValues);
                        console.log('t_person_relationship table populated!')

                        console.log('New member created successfully with user id : ' + newUserId);
                        existingMembers.push(newUserId);

                    } catch (error) {

                        client.query("ROLLBACK");
                        console.error(`reqOperations.js::processUpdateUserRoles() --> error : ${error}`);
                        console.log("Transaction ROLLBACK called");
                        return (errorHandling.handleDBError('transactionError'));
                    }




                } else if (condition1Result.rows[0].result == false && condition2Result.rows[0].is_user == false && condition2Result.rows[0].is_user == false) {
                    //if Provided new email id does not exists ini system then create new firebase account,
                    // and populate user records in respective tables
                    console.log('Member is using his//her own email id, so  creating new account in firebase and populating new member data into the tables')
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
                    let newUserId;
                    try {
                        console.log('Inserting records into t_user ....');
                        console.log('New member UID' + fbuid)


                        const insertuserTbl = `INSERT INTO public.t_user
                (email_id, org_id, firebase_id, title, first_name, middle_name, last_name, created_by, created_date, member_type, is_approved )
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning user_id;`;

                        const insertuserTblValues = [
                            details.emailId,
                            userData.orgId,
                            fbuid,
                            details.title,
                            details.firstName,
                            details.middleName,
                            details.lastName,
                            userData.updatedBy,
                            new Date().toISOString(),
                            'member',
                            true
                        ]

                        let result = await client.query(insertuserTbl, insertuserTblValues)
                        newUserId = result.rows[0].user_id;


                    } catch (error) {
                        console.error('Error while insterting record into t_user table as  : ' + error);
                    }

                    ////////////////////////////////////////////////   t_person  /////////////////////////////////////////////////////////////////////////////

                    console.log('Inserting records into t_person ....');
                    console.log('New user if for member is ' + details.emailId + ' is ' + newUserId)

                    try {
                        // let insertPerson = `INSERT INTO t_person(
                        //                 user_id, title, first_name, middle_name, last_name, dob, mobile_no)
                        //                 VALUES ($1, $2, $3, $4, $5, $6, $7);`

                        insertPersonValues =
                            [
                                newUserId,
                                details.dob,
                                details.mobileNo,
                                userData.updatedBy,
                                new Date().toISOString(),
                                'member'
                            ]

                        console.log('insertPersonValues :' + insertPersonValues);
                        await client.query(insertPerson, insertPersonValues);

                    } catch (error) {
                        console.error('Error while insterting record into t_person table as  : ' + error);
                    }




                    console.log("this.NewUserId", newUserId);
                    // console.log("insertRoleMappingmember", insertRoleMappingmember);
                    let insertRoleMappingmember = `insert into t_user_role_mapping (user_id, role_id)
                    select ${newUserId}, role_id from t_role where name = 'Member';`
                    await client.query(insertRoleMappingmember);

                    ///////////////////////////////////////////////  t_person_relationship  //////////////////////////////////////////////////////////////////////////////


                    console.log('Inserting records into t_person_relationship ....');

                    insertPersonRelationshipValues = [
                        userData.userId,
                        newUserId,
                        details.relationship,
                        userData.updatedBy,
                        new Date().toISOString()
                    ]

                    console.log("insertPersonRelationshipValues", insertPersonRelationshipValues);

                    await client.query(insertPersonRelationship, insertPersonRelationshipValues);

                    console.log('New member created successfully.');

                    existingMembers.push(newUserId);

                    ///this.userId = result.rows[0].user_id;
                    //console.log("userid", this.userId)

                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                }
                else {

                    console.log("Updating  user general information section...");

                    let selectEmail = `select user_id usercount, family_member_id membercount 
                                        from t_user
                                        left outer join t_person_relationship on family_member_id = user_id
                                        where email_id = '${details.emailId}';`
                    // console.log("selectEmail", selectEmail);
                    let emailResults = await client.query(selectEmail);


                    if (condition1Result.rows[0].result == false && condition2Result.rows[0].result == true) {

                        // console.log("details", details);
                        // console.log("1");

                        let insertPersonRelationship = `INSERT INTO t_person_relationship(
                        family_head_id, family_member_id, relationship, updated_by, updated_date)
                          VALUES ($1, $2, $3, $4, $5);`

                        //  console.log("2");

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
                    else {
                        let updateRelationship = `UPDATE t_person_relationship SET is_deleted = false where family_member_id =${emailResults.rows[0].membercount};`
                        console.log("updateRelationship", updateRelationship);
                        await client.query(updateRelationship);
                    }

                    existingMembers.push(emailResults.rows[0].usercount);
                }
            }

            //// Delete users which are not present in membership detail array
            if (existingMembers.length > 0) {
                let usersToDelete = existingMembers.join(',');
                let deleteRelationship = `UPDATE t_person_relationship SET is_deleted = true where family_member_id not in (${usersToDelete});`
                console.log("deleteRelationship", deleteRelationship);
                await client.query(deleteRelationship);
            }
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
        console.error(`reqOperations.js::processUpdateUserRoles() --> error : ${err}`);
        console.log("Transaction ROLLBACK called");
        return (errorHandling.handleDBError('transactionError'));
    }
}

async function getParishData() {

    return new Promise((resolve, reject) => {
        let getParishData = `select org_id id, name from t_organization where org_type = 'Parish'`
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
        await client.query(deleteFromUserTable, (err, res) => {
            if (err)
                console.log('Error occured : ' + err)
        });

        let deleteFromPersonTable = `UPDATE t_person SET is_deleted = true where user_id in (${userData.deleteUser});`

        await client.query(deleteFromPersonTable, (err, res) => {
            if (err)
                console.log('Error occured : ' + err)
        });
        await client.end();
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

        await client.end();
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



function generatePassword() {
    var length = 10,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}


module.exports = {
    processSignInRequest,
    processGetUserMetaDataRequest,
    getuserRecords,
    processUpdateUserRoles,
    getRoleMetadata,
    getEventCategory,
    getParishData,
    deleteUsers,
    getEventData,
    getProctorData
}
