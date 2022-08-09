import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeOperationService {

  constructor(private hc:HttpClient,private ls:LoginService) { }
  
  addRecipe(userObj):Observable<any>
  {
    console.log('addRecipe')
     return this.hc.post('/recipe/add',userObj)
  }
  getRecipe():Observable<any>{
    return this.hc.get('/recipe/get-recipe');
  }
  getRecipeObjByUserName() {
    return this.hc.get(`/recipe/getRecipeByUsername/${this.ls.userid}`);
  }
  removeRecipe(id):Observable<any> {
    return this.hc.delete(`/recipe/remove/${id}`);
  }
  deleteRecipes(obj):Observable<any>{
    console.log("body is ",obj);
    return this.hc.put('/recipe/delete-many',obj);
  }

  getTotalRecipes() {
    return this.hc.get(`/recipe/noOfRecipes/${this.ls.userid}`);
  }
  
  getRequiredCategories(name)
  {
    return this.hc.get(`/recipe/getCategories/${name}`);
  }

  LikeRecipe(dataObj): Observable<any>  {
    return this.hc.post('/recipe/likeRecipe',dataObj);
  }

  removeLike(dataObj): Observable<any> {
    return this.hc.post('/recipe/dislikeRecipe',dataObj);
  }

  getTotalLikesToParticularRecipe(recipeid):Observable<any> {
    return this.hc.get(`/recipe/noOfLikesToRecipe/${recipeid}`);
  }

  getTotalLikesToUserForRecipe() :Observable<any> {
    return this.hc.get(`/recipe/totalLikesToUserForRecipe/${this.ls.userid}`);
  }

  checkIfUserAlreadyLiked(dataObj):Observable<any> {
    return this.hc.post('/recipe/userLikedRecipe',dataObj);
  } 
}
