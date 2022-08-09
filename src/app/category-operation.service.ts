import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryOperationService {

  constructor(private hc: HttpClient,private loginService: LoginService) { }
  addCategory(dataObj): Observable<any> {
    return this.hc.post('/category/add',dataObj);
  }
  removeCategory(id):Observable<any> {
    return this.hc.delete(`/category/remove/${id}`);
  }

  getCategoryDataListByUserName() {
    const parent = this;
    return new Promise(function (fulfilled, rejected) {
      parent.hc.get(`/category/getCategoryByUsername/${parent.loginService.userid}`).subscribe(data => {
        fulfilled(data);
      },
        error => {
          rejected(error);
        });
    });
  }

  getCategoryDataList() {
    const parent = this;
    return new Promise(function (fulfilled, rejected) {
      parent.hc.get('/category/get').subscribe(data => {
        fulfilled(data);
      },
        error => {
          rejected(error);
        });
    });
  }
  removeSelectedCategories(obj):Observable<any> {
    return this.hc.put('/category/removeSelectedCategories',obj);
  }
}
