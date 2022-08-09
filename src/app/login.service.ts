import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  username:String;
  userLoginStatus:boolean;
  adminLoginStatus:boolean;
  role:String;
  userid:String;
  //inject HttpClient
  constructor(private hc:HttpClient) {}
  //a method to make http post  
  doLogin(userObj):Observable<any>
  {
      return this.hc.post('/user/login',userObj);
  }

  doLogout()
  {
    localStorage.removeItem("token");
  }

  readProfile():Observable<any> {
    return this.hc.get(`/user/readprofile/${this.userid}`);
  }

  updateProfile(userObj) :Observable<any> {
    return this.hc.put(`/user/updateprofile/${this.userid}`,userObj);
  }

  searchuser(username) :Observable<any> {
    return this.hc.get(`/user/search/${username}`); 
  }
}
