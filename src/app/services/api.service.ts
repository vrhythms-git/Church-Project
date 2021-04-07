import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }
 // private _baseUrl = 'https://cormentis.herokuapp.com';
 private _baseUrl = 'http://localhost:8081/api';

  signUpNewUser(userData: any):Observable<any> {
    console.log(`signUpNewUser called..`)
    // let headerObj = new HttpHeaders({
    //                                   'Authorization': localStorage.getItem('cormUserTokenId')!,
    //                                   'Content-Type' : 'application/json'
    //                                 });
    // console.log('headers set to ' + JSON.stringify(headerObj))
    return this.http.post(`${this._baseUrl}/signUp`, userData);
    // return this.http.post(`${this._baseUrl}/signUp`, searchString, { headers: headerObj });
  }


  callGetService(endPoint:string):Observable<any> {
    console.log(`callGetService called..`)
    let headerObj = new HttpHeaders({
                                      'Authorization': localStorage.getItem('chUserToken')!,
                                      'Content-Type' : 'application/json'
                                    });
    console.log('headers set to ' + JSON.stringify(headerObj))
    return this.http.get(`${this._baseUrl}/${endPoint}`,{ headers: headerObj });
  }
  getUsersData(loggedInUserId: any):Observable<any>{
    console.log(`calling the usesData()`);
    let headerObj = new HttpHeaders({
                    'Authorization': localStorage.getItem('cormUserTokenId')!,
                    'Content-Type' : 'application/json'
                  });
    console.log( 'user data is : ' + this.http.get(`${this._baseUrl}/getuserRecords?loggedInUser=loggedInUserId`),loggedInUserId);
    return this.http.get(`${this._baseUrl}/getuserRecords?loggedInUser=` +loggedInUserId);   
}

getUnapprovedUserData(loggedInUserId: any):Observable<any>{
  console.log(`calling the getUnapprovedUserData()`);
  let headerObj = new HttpHeaders({
                  'Authorization': localStorage.getItem('cormUserTokenId')!,
                  'Content-Type' : 'application/json'
                });
  console.log( 'user data is : ' + this.http.get(`${this._baseUrl}/getuserRecords`),loggedInUserId);
  return this.http.get(`${this._baseUrl}/getuserRecords?type=unapproved&loggedInUser=`+ loggedInUserId );  
   
}

getUserRoleData():Observable<any>{
  console.log(`calling the usersRoleData()`);
  let headerObj = new HttpHeaders({
                  'Authorization': localStorage.getItem('chUserToken')!,
                  'Content-Type' : 'application/json'
                });
  console.log( 'user data is : ' + this.http.get(`${this._baseUrl}/getRoleMetaData`));
  return this.http.get(`${this._baseUrl}/getRoleMetaData` );   
}

getParishListData():Observable<any>{
  console.log(`calling the ParishListData()`);
  // let headerObj = new HttpHeaders({
  //                 'Authorization': localStorage.getItem('chUserToken')!,
  //                 'Content-Type' : 'application/json'
  //               });
  // console.log( 'user data is : ' + this.http.get(`${this._baseUrl}/getRoleMetaData`));
  return this.http.get(`${this._baseUrl}/getParishData` );   
}

deleteUser(userData : any){
  console.log("Delete User Profile Called..")
let headerObj = new HttpHeaders({
                                    'Authorization': localStorage.getItem('chUserToken')!,
                                    'Content-Type' : 'application/json'
                                  });
 console.log('headers set to ' + JSON.stringify(headerObj))
 console.log(JSON.stringify(userData));
return this.http.post(`${this._baseUrl}/deleteUsers`, JSON.stringify(userData),{ headers: headerObj } );
}
updateUserProfile(userData  : any){
console.log("update User Profile Called..")
let headerObj = new HttpHeaders({
                                    'Authorization': localStorage.getItem('chUserToken')!,
                                    'Content-Type' : 'application/json'
                                  });
 console.log('headers set to ' + JSON.stringify(headerObj))
 console.log(JSON.stringify(userData));
return this.http.post(`${this._baseUrl}/updateUserRoles`, JSON.stringify(userData),{ headers: headerObj } );
}

getEventCategoryData():Observable<any>{
  console.log(`calling the getEventCategory()`);
  let headerObj = new HttpHeaders({
                  'Authorization': localStorage.getItem('chUserToken')!,
                  'Content-Type' : 'application/json'
                });
  console.log( 'Event Category data is : ' + this.http.get(`${this._baseUrl}/getEventCategory`));
  return this.http.get(`${this._baseUrl}/getEventCategory` );   
}

approveOrRejReq(reqData : any){
  console.log("update User Profile Called..")
  let headerObj = new HttpHeaders({
                                      'Authorization': localStorage.getItem('chUserToken')!,
                                      'Content-Type' : 'application/json'
                                    });
   console.log('headers set to ' + JSON.stringify(headerObj))
   console.log(JSON.stringify(reqData));
  return this.http.post(`${this._baseUrl}/setUserApprovalState`, JSON.stringify(reqData),{ headers: headerObj } );
}

getCountryStates(){
  console.log(`calling the getCountryStates()`);
  
  return this.http.get(`${this._baseUrl}/getCountryStates` );   
}

insertevents(eventsData  : any){
  console.log("update User Profile Called..")
  let headerObj = new HttpHeaders({
                                      'Authorization': localStorage.getItem('chUserToken')!,
                                      'Content-Type' : 'application/json'
                                    });
   console.log('headers set to ' + JSON.stringify(headerObj))
   console.log(JSON.stringify(eventsData));
  return this.http.post(`${this._baseUrl}/insertevents`, JSON.stringify(eventsData),{ headers: headerObj } );
  }

  getProctorData(userData: any):Observable<any>{
    console.log(`calling the getProctorData()`);
    let headerObj = new HttpHeaders({
                    'Authorization': localStorage.getItem('chUserToken')!,
                    'Content-Type' : 'application/json'
                  });
    console.log( 'getProctorData is : ' + this.http.get(`${this._baseUrl}/getProctorData`), userData);
    return this.http.get(`${this._baseUrl}/getProctorData?userData=`+ userData );   
  }
}

