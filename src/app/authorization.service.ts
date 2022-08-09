import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
      //check for token in local storage
      let token=localStorage.getItem("token");
      //if token is not present 
      //forward req object
      if(token==undefined)
      {
        return next.handle(req);
      }
      //if token is existed
      //clone the req object by adding token at header of it.
      //forward to next interceptor/backend
      let cloneReqObj=req.clone({
      headers:req.headers.set('Authorization','Bearer '+token)});
      //forward to next interceptor/backend
      return next.handle(cloneReqObj);
    }
}
