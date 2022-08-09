import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecentActionsService {

  constructor(private hc:HttpClient) { }
  addAction(userObj):Observable<any>
  {
    //console.log('addRecipe')
     return this.hc.post('/recent-actions/add-action',userObj)
  }
  getActions():Observable<any>{
    //console.log('get actions');
    return this.hc.get('/recent-actions/get-action');
  }
}
