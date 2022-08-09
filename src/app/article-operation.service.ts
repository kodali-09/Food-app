import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleOperationService {

  constructor(private hc: HttpClient, private loginService: LoginService) { }
  addArticle(dataObj): Observable<any> {
    return this.hc.post('/article/add', dataObj);
  }
  removeAticle(id):Observable<any> {
    return this.hc.delete(`/article/remove/${id}`);
  }
  getArticleDataList() {
    const parent = this;
    return new Promise(function (fulfilled, rejected) {
      parent.hc.get('/article/get').subscribe(data => {
        fulfilled(data);
      },
        error => {
          rejected(error);
        });
    });
  }

  getArticleDataListByUserName() {
    const parent = this;
    return new Promise(function (fulfilled, rejected) {
      parent.hc.get(`/article/getArticleByUsername/${parent.loginService.userid}`).subscribe(data => {
        fulfilled(data);
      },
        error => {
          rejected(error);
        });
    });
  }

  getTotalArticles() {
    return this.hc.get(`/article/noOfArticles/${this.loginService.userid}`);
  }

  removeSelectedArticles(obj):Observable<any> {
    return this.hc.put('/article/removeSelectedArticles',obj);
  }

  LikeArticle(dataObj): Observable<any>  {
    return this.hc.post('/article/likeArticle',dataObj);
  }

  removeLike(dataObj): Observable<any> {
    return this.hc.post('/article/dislikeArticle',dataObj);
  }

  getTotalLikesToParticularArticle(articleid):Observable<any> {
    return this.hc.get(`/article/noOfLikesToArticle/${articleid}`);
  }

  getTotalLikesToUserForArticle() :Observable<any> {
    return this.hc.get(`/article/totalLikesToUserForArticle/${this.loginService.userid}`);
  }

  checkIfUserAlreadyLiked(dataObj):Observable<any> {
    return this.hc.post('/article/userLikedArticle',dataObj);
  } 

}
