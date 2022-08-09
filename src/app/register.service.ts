import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  //inject http client obj
  constructor(private httpClient:HttpClient) { }
  //
  doRegister(userObj):Observable<any>
  {
     return this.httpClient.post('/user/register',userObj)
  }

  addAdmin(dataObj):Observable<any>
  {
    return this.httpClient.post('/admin/addAdmin',dataObj);
  }
}
