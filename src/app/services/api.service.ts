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
}
