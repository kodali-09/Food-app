import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ArticleData } from './data/article-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {
//to make http request
//-->inject HttpClient object from root injector
constructor(private hc:HttpClient){}
//-->make http req on that object

  private bsArticle = new BehaviorSubject<ArticleData>(null);

  articleData = this.bsArticle.asObservable();

  private bsRecipe = new BehaviorSubject<any>(null);
  
  recipeData = this.bsRecipe.asObservable();

  private bsUser = new BehaviorSubject<any>(null);

  userData = this.bsUser.asObservable();

  private bsAdmin = new BehaviorSubject<any>(null);

  adminData = this.bsAdmin.asObservable();

  getData():Observable<object[]>  //data is present in observable
  {
   return  this.hc.get<object[]>('https://jsonplaceholder.typicode.com/posts');
  }
  //make another http get req
  getUserData():Observable<object>
  {
    return  this.hc.get('https://reqres.in/api/users');
  }

  public sendUserData(userdata:any) {
    this.bsUser.next(userdata);
  }

  public sendAdminData(admindata:any) {
    this.bsAdmin.next(admindata);
  }

  public sendArticle(article: ArticleData) {
    this.bsArticle.next(article);
  }
  sendRecipe(recipe: any) {
    //console.log("inside data service",recipe);
    this.bsRecipe.next(recipe);
  }
}
